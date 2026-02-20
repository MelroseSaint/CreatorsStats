import jwt from 'jsonwebtoken';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
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

    // Check expiry is still valid (jwt.verify handles this but let's be explicit)
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ error: 'Token expired', valid: false });
    }

    return res.status(200).json({ 
      valid: true, 
      pro: decoded.pro,
      sub: decoded.sub,
      email: decoded.email 
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
