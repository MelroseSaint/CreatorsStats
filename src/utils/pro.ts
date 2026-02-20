const PRO_KEY = 'pro_enabled';
const PRO_SOURCE_KEY = 'pro_source';

export function isProEnabled(): boolean {
  return localStorage.getItem(PRO_KEY) === 'true';
}

export function getProSource(): string | null {
  return localStorage.getItem(PRO_SOURCE_KEY);
}

export function enablePro(): void {
  localStorage.setItem(PRO_KEY, 'true');
  localStorage.setItem(PRO_SOURCE_KEY, 'owner');
}

export function disablePro(): void {
  localStorage.removeItem(PRO_KEY);
  localStorage.removeItem(PRO_SOURCE_KEY);
}

export function verifyOwnerKey(key: string): boolean {
  return key === 'growthmelrose';
}
