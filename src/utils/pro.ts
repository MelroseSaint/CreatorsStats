const PRO_TOKEN_KEY = 'pro_token';
const DEVICE_ID_KEY = 'device_id';
const SUBSCRIPTION_STATUS_KEY = 'subscription_status';

export interface SubscriptionStatus {
  status: string;
  currentPeriodEnd?: number;
  cancelAtPeriodEnd?: boolean;
  customerId?: string;
  subscriptionId?: string;
}

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

export function getProToken(): string | null {
  return localStorage.getItem(PRO_TOKEN_KEY);
}

export function setProToken(token: string): void {
  localStorage.setItem(PRO_TOKEN_KEY, token);
}

export function getSubscriptionStatus(): SubscriptionStatus | null {
  const status = localStorage.getItem(SUBSCRIPTION_STATUS_KEY);
  return status ? JSON.parse(status) : null;
}

export function setSubscriptionStatus(status: SubscriptionStatus): void {
  localStorage.setItem(SUBSCRIPTION_STATUS_KEY, JSON.stringify(status));
}

export function isProEligible(): boolean {
  const status = getSubscriptionStatus();
  if (!status) return false;
  return status.status === 'ACTIVE' || status.status === 'TRIALING' || status.status === 'OWNER';
}

export function clearSubscription(): void {
  localStorage.removeItem(PRO_TOKEN_KEY);
  localStorage.removeItem(SUBSCRIPTION_STATUS_KEY);
}

export async function activateWithSessionId(sessionId: string): Promise<{ success: boolean; error?: string }> {
  const deviceId = getDeviceId();

  try {
    const response = await fetch('/api/stripe/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, deviceId }),
    });

    if (!response.ok) {
      const data = await response.json();
      return { success: false, error: data.error || 'Activation failed' };
    }

    const data = await response.json();
    setProToken(data.token);
    setSubscriptionStatus({
      status: data.status,
      customerId: data.customerId,
      subscriptionId: data.subscriptionId,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd,
    });
    return { success: true };
  } catch (error) {
    console.error('Activation error:', error);
    return { success: false, error: 'Network error' };
  }
}

export async function verifyAndRefreshStatus(): Promise<{ valid: boolean; status?: SubscriptionStatus }> {
  const token = getProToken();
  const deviceId = getDeviceId();

  if (!token) {
    clearSubscription();
    return { valid: false };
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
      clearSubscription();
      return { valid: false };
    }

    const data = await response.json();

    if (!data.valid) {
      clearSubscription();
      return { valid: false };
    }

    const status: SubscriptionStatus = {
      status: data.status,
      customerId: data.customerId,
      subscriptionId: data.subscriptionId,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd,
    };

    setSubscriptionStatus(status);

    if (data.renewedToken) {
      setProToken(data.renewedToken);
    }

    return { valid: true, status };
  } catch (error) {
    console.error('Verification error:', error);
    clearSubscription();
    return { valid: false };
  }
}

export async function getDetailedStatus(): Promise<SubscriptionStatus | null> {
  const token = getProToken();
  const deviceId = getDeviceId();

  if (!token) {
    return null;
  }

  try {
    const response = await fetch('/api/subscription/status', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Device-Id': deviceId,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Status fetch error:', error);
    return null;
  }
}

export function openStripePaymentLink(): void {
  const url = import.meta.env.VITE_STRIPE_CHECKOUT_URL;
  if (url) {
    window.open(url, '_blank');
  }
}

export function openStripePortal(): void {
  const url = import.meta.env.VITE_STRIPE_BILLING_URL;
  if (url) {
    window.open(url, '_blank');
  }
}

export async function unlockWithOwnerKey(key: string): Promise<{ success: boolean; error?: string }> {
  if (key !== 'growthmelrose') {
    return { success: false, error: 'Invalid key' };
  }

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
    setSubscriptionStatus({
      status: 'OWNER',
      customerId: 'owner',
      subscriptionId: 'owner',
    });
    return { success: true };
  } catch (error) {
    console.error('Owner unlock error:', error);
    return { success: false, error: 'Network error' };
  }
}
