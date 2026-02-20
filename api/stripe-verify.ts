import jwt from 'jsonwebtoken';
import Stripe from 'stripe';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, deviceId } = req.body;

    if (!email || !deviceId) {
      return res.status(400).json({ error: 'Missing email or deviceId' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

    // Find customer by email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return res.status(404).json({ error: 'No customer found with this email' });
    }

    const customer = customers.data[0];

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 10,
    });

    if (subscriptions.data.length === 0) {
      return res.status(402).json({ error: 'No active subscription found' });
    }

    // Issue JWT for verified Stripe subscriber
    const secret = process.env.JWT_SECRET || 'fallback-secret-change-me';
    const token = jwt.sign(
      { 
        pro: true, 
        sub: 'stripe', 
        email: customer.email,
        deviceId 
      },
      secret,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Stripe verify error:', error);
    return res.status(500).json({ error: 'Verification failed' });
  }
}
