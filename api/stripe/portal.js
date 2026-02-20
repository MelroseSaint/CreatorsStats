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
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({ error: 'Missing customerId' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.STRIPE_PORTAL_RETURN_URL || 'https://growthledgerpro.vercel.app/app/settings',
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe portal error:', error);
    return res.status(500).json({ error: 'Failed to create portal session' });
  }
}
