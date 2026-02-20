import jwt from 'jsonwebtoken';
import Stripe from 'stripe';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId, deviceId } = req.body;

    if (!sessionId || !deviceId) {
      return res.status(400).json({ error: 'Missing sessionId or deviceId' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });

    // Verify payment status
    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not completed' });
    }

    // Verify it has a subscription
    if (!session.subscription) {
      return res.status(400).json({ error: 'No subscription found in session' });
    }

    const subscriptionId = typeof session.subscription === 'string' 
      ? session.subscription 
      : session.subscription.id;

    const customerId = typeof session.customer === 'string'
      ? session.customer
      : session.customer?.id;

    if (!customerId) {
      return res.status(400).json({ error: 'No customer found' });
    }

    // Get current subscription status from Stripe
    const subStatus = await getSubscriptionStatus(stripe, subscriptionId);

    // Check if eligible
    if (!ELIGIBLE_STATUSES.includes(subStatus.status.toLowerCase())) {
      return res.status(401).json({ 
        error: 'Subscription not eligible',
        status: subStatus.status,
      });
    }

    // Issue JWT
    const secret = process.env.JWT_SECRET || 'fallback-secret-change-me';
    const token = jwt.sign(
      {
        pro: true,
        sub: 'stripe',
        stripeCustomerId: customerId,
        subscriptionId,
        deviceId,
        status: subStatus.status,
      },
      secret,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      token,
      status: subStatus.status,
      customerId,
      subscriptionId,
      currentPeriodEnd: subStatus.currentPeriodEnd,
      cancelAtPeriodEnd: subStatus.cancelAtPeriodEnd,
    });
  } catch (error) {
    console.error('Stripe activate error:', error);
    return res.status(500).json({ error: 'Activation failed' });
  }
}
