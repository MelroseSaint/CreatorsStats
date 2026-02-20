const PRO_KEY = 'pro_enabled';
const PRO_TOKEN_KEY = 'pro_token';
const DEVICE_ID_KEY = 'device_id';
const PRO_SOURCE_KEY = 'pro_source';

function getOrCreateDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

export function getDeviceId(): string {
  return getOrCreateDeviceId();
}

export function isProEnabled(): boolean {
  return localStorage.getItem(PRO_KEY) === 'true';
}

export function getProSource(): string | null {
  return localStorage.getItem(PRO_SOURCE_KEY);
}

export function getProToken(): string | null {
  return localStorage.getItem(PRO_TOKEN_KEY);
}

export function setProToken(token: string): void {
  localStorage.setItem(PRO_TOKEN_KEY, token);
  localStorage.setItem(PRO_KEY, 'true');
}

export function enablePro(source: 'owner' | 'stripe'): void {
  localStorage.setItem(PRO_KEY, 'true');
  localStorage.setItem(PRO_SOURCE_KEY, source);
}

export function disablePro(): void {
  localStorage.removeItem(PRO_KEY);
  localStorage.removeItem(PRO_TOKEN_KEY);
  localStorage.removeItem(PRO_SOURCE_KEY);
}

export function verifyOwnerKey(key: string): boolean {
  return key === 'growthmelrose';
}

export async function verifyToken(): Promise<boolean> {
  const token = getProToken();
  const deviceId = getDeviceId();
  
  if (!token) {
    disablePro();
    return false;
  }

  try {
    const response = await fetch('/api/auth/verify', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Device-Id': deviceId,
      },
    });

    if (!response.ok) {
      disablePro();
      return false;
    }

    const data = await response.json();
    return data.valid === true;
  } catch (error) {
    console.error('Token verification failed:', error);
    disablePro();
    return false;
  }
}

export async function unlockWithOwnerKey(key: string): Promise<{ success: boolean; error?: string }> {
  const deviceId = getDeviceId();

  try {
    const response = await fetch('/api/owner/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, deviceId }),
    });

    if (!response.ok) {
      const data = await response.json();
      return { success: false, error: data.error || 'Unlock failed' };
    }

    const data = await response.json();
    setProToken(data.token);
    enablePro('owner');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

export async function verifyStripeSubscriber(email: string): Promise<{ success: boolean; error?: string }> {
  const deviceId = getDeviceId();

  try {
    const response = await fetch('/api/stripe/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, deviceId }),
    });

    if (!response.ok) {
      const data = await response.json();
      return { success: false, error: data.error || 'Verification failed' };
    }

    const data = await response.json();
    setProToken(data.token);
    enablePro('stripe');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}
