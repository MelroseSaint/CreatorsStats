import jwt from 'jsonwebtoken';
import Stripe from 'stripe';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const deviceId = req.headers['x-device-id'];

    if (!deviceId) {
      return res.status(400).json({ error: 'Missing device ID' });
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-change-me';
    const decoded = jwt.verify(token, secret) as any;

    if (decoded.deviceId !== deviceId) {
      return res.status(401).json({ error: 'Device mismatch' });
    }

    if (decoded.sub !== 'stripe' || !decoded.subscriptionId) {
      return res.status(400).json({ error: 'Not a Stripe subscription' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

    try {
      const subscription = await stripe.subscriptions.retrieve(decoded.subscriptionId) as any;

      return res.status(200).json({
        status: subscription.status.toUpperCase(),
        currentPeriodEnd: subscription.current_period_end * 1000,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        customerId: decoded.customerId,
        subscriptionId: decoded.subscriptionId,
      });
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      return res.status(500).json({ error: 'Failed to fetch subscription' });
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Status error:', error);
    return res.status(500).json({ error: 'Verification failed' });
  }
}
