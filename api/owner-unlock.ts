import crypto from 'crypto';
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
    const { key, deviceId, routeSecret } = req.body;

    // Optional route secret protection
    if (process.env.OWNER_UNLOCK_ROUTE_SECRET) {
      if (!routeSecret || routeSecret !== process.env.OWNER_UNLOCK_ROUTE_SECRET) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    if (!key || !deviceId) {
      return res.status(400).json({ error: 'Missing key or deviceId' });
    }

    // PBKDF2 derivation
    const salt = `${process.env.OWNER_SALT}:${process.env.OWNER_PEPPER}`;
    const iterations = parseInt(process.env.PBKDF2_ITERS || '100000', 10);
    const derivedKey = crypto.pbkdf2Sync(key, salt, iterations, 32, 'sha256').toString('hex');

    // Constant time comparison
    const inputBuffer = Buffer.from(derivedKey);
    const expectedBuffer = Buffer.from(process.env.OWNER_KEY_DERIVED_HEX || '');
    
    let isValid = false;
    if (inputBuffer.length === expectedBuffer.length && expectedBuffer.length > 0) {
      isValid = crypto.timingSafeEqual(inputBuffer, expectedBuffer);
    }

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid key' });
    }

    // Issue JWT
    const secret = process.env.JWT_SECRET || 'fallback-secret-change-me';
    const token = jwt.sign(
      { pro: true, sub: 'owner', deviceId },
      secret,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Owner unlock error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
