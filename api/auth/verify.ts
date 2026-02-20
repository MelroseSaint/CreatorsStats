import jwt from 'jsonwebtoken';
import Stripe from 'stripe';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ELIGIBLE_STATUSES = ['active', 'trialing'];

async function getSubscriptionStatus(stripe: Stripe, subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
  return {
    status: subscription.status.toUpperCase(),
    currentPeriodEnd: subscription.current_period_end * 1000,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided', valid: false });
    }

    const deviceId = req.headers['x-device-id'];

    if (!deviceId) {
      return res.status(400).json({ error: 'Missing device ID', valid: false });
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-change-me';
    
    const decoded = jwt.verify(token, secret) as any;

    // Verify deviceId matches
    if (decoded.deviceId !== deviceId) {
      return res.status(401).json({ error: 'Device mismatch', valid: false });
    }

    // Check if Stripe subscription - verify with Stripe
    if (decoded.sub === 'stripe' && decoded.subscriptionId) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
      
      try {
        const subStatus = await getSubscriptionStatus(stripe, decoded.subscriptionId);
        
        const isEligible = ELIGIBLE_STATUSES.includes(subStatus.status.toLowerCase());

        if (!isEligible) {
          return res.status(401).json({ 
            valid: false, 
            status: subStatus.status,
            error: 'Subscription not active',
          });
        }

        // Issue refreshed token
        const renewedToken = jwt.sign(
          {
            pro: true,
            sub: 'stripe',
            customerId: decoded.customerId,
            subscriptionId: decoded.subscriptionId,
            deviceId: decoded.deviceId,
            status: subStatus.status,
          },
          secret,
          { expiresIn: '24h' }
        );

        return res.status(200).json({
          valid: true,
          status: subStatus.status,
          currentPeriodEnd: subStatus.currentPeriodEnd,
          cancelAtPeriodEnd: subStatus.cancelAtPeriodEnd,
          customerId: decoded.customerId,
          subscriptionId: decoded.subscriptionId,
          renewedToken,
        });
      } catch (stripeError) {
        console.error('Stripe verification error:', stripeError);
        return res.status(401).json({ valid: false, error: 'Subscription check failed' });
      }
    }

    // Owner subscription - just validate JWT (no Stripe check needed)
    if (decoded.sub === 'owner') {
      return res.status(200).json({
        valid: true,
        status: 'OWNER',
      });
    }

    // For other subscriptions, just validate JWT
    return res.status(200).json({ 
      valid: true, 
      status: 'ACTIVE',
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired', valid: false });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token', valid: false });
    }
    console.error('Auth verify error:', error);
    return res.status(500).json({ error: 'Verification failed', valid: false });
  }
}
