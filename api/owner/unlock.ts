import jwt from 'jsonwebtoken';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { key, deviceId } = req.body;

    if (!key || !deviceId) {
      return res.status(400).json({ error: 'Missing key or deviceId' });
    }

    if (key !== 'growthmelrose') {
      return res.status(401).json({ error: 'Invalid key' });
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-change-me';
    const token = jwt.sign(
      {
        pro: true,
        sub: 'owner',
        deviceId,
        status: 'OWNER',
      },
      secret,
      { expiresIn: '30d' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Owner unlock error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
