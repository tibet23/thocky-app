/**
 * ThockyApp Subscription & 1-Day Trial Manager
 * Handles local 1-day (24h) trial tracking, $3.99/year subscription lifecycle,
 * Windows Store IAP & Web Checkout simulation, and persistent state management.
 */

export type SubscriptionPlan = 'yearly_pass';
export type PurchaseSource = 'windows_store' | 'web_checkout' | 'license_key' | 'none';

export interface TrialState {
  firstLaunchTimestamp: number;
  trialDurationDays: number;
  isSubscribed: boolean;
  subscriptionPlan: SubscriptionPlan;
  subscriptionPrice: string; // "$3.99/year"
  subscriptionMonthlyEquivalent: string; // "$0.33/mo"
  subscriptionSource: PurchaseSource;
  subscriptionExpiresTimestamp?: number;
  licenseKey?: string;
  isExpired: boolean;
  isTrialing: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  timeElapsedMs: number;
  totalTrialMs: number;
  percentElapsed: number;
  formattedFirstLaunch: string;
  formattedTrialExpirationDate: string;
  formattedSubscriptionRenewalDate?: string;
}

const STORAGE_KEY = 'thockyapp_subscription_data_v4';
const LEGACY_STORAGE_KEY_V3 = 'thockyapp_subscription_data_v3';
const LEGACY_STORAGE_KEY_V2 = 'thockyapp_subscription_data_v2';
const LEGACY_STORAGE_KEY_V1 = 'thockyapp_trial_data_v1';
const LEGACY_STORAGE_KEY_V0 = 'thockswitch_trial_data_v1';

export const YEARLY_PRICE_USD = '$3.99';
export const YEARLY_PRICE_PERIOD = '/year';
export const MONTHLY_EQUIVALENT_USD = '$0.33/mo';
export const TRIAL_DURATION_DAYS = 1;
const TRIAL_DURATION_MS = TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000;
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

interface StoredSubscriptionData {
  firstLaunchTimestamp: number;
  isSubscribed: boolean;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionSource?: PurchaseSource;
  subscriptionExpiresTimestamp?: number;
  licenseKey?: string;
}

function getStoredData(): StoredSubscriptionData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.firstLaunchTimestamp === 'number') {
        return parsed;
      }
    }

    // Migration from v2, v1 or v0
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY_V2) || localStorage.getItem(LEGACY_STORAGE_KEY_V1) || localStorage.getItem(LEGACY_STORAGE_KEY_V0);
    if (legacyRaw) {
      const legacyParsed = JSON.parse(legacyRaw);
      if (legacyParsed && typeof legacyParsed.firstLaunchTimestamp === 'number') {
        const migrated: StoredSubscriptionData = {
          firstLaunchTimestamp: legacyParsed.firstLaunchTimestamp,
          isSubscribed: !!legacyParsed.isSubscribed || !!legacyParsed.isLicenseActive,
          subscriptionPlan: 'yearly_pass',
          subscriptionSource: legacyParsed.subscriptionSource || (legacyParsed.licenseKey ? 'license_key' : 'web_checkout'),
          subscriptionExpiresTimestamp: legacyParsed.subscriptionExpiresTimestamp || (legacyParsed.isSubscribed ? Date.now() + ONE_YEAR_MS : undefined),
          licenseKey: legacyParsed.licenseKey,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    }
  } catch (err) {
    console.warn('Unable to access localStorage for subscription data:', err);
  }

  // First launch initialization (1-Day / 24-hour trial)
  const now = Date.now();
  const initialData: StoredSubscriptionData = {
    firstLaunchTimestamp: now,
    isSubscribed: false,
    subscriptionPlan: 'yearly_pass',
    subscriptionSource: 'none',
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  } catch (err) {
    console.warn('Unable to save initial subscription data to localStorage:', err);
  }

  return initialData;
}

function saveStoredData(data: StoredSubscriptionData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('thocky_subscription_changed'));
    window.dispatchEvent(new Event('trial_state_changed'));
  } catch (err) {
    console.warn('Unable to save subscription data:', err);
  }
}

export function getTrialState(): TrialState {
  const data = getStoredData();
  const now = Date.now();
  const timeElapsedMs = Math.max(0, now - data.firstLaunchTimestamp);
  const totalTrialMs = TRIAL_DURATION_MS;
  const timeRemainingMs = Math.max(0, totalTrialMs - timeElapsedMs);

  // Check if active subscription has expired
  let isSubscribed = data.isSubscribed;
  if (isSubscribed && data.subscriptionExpiresTimestamp && now > data.subscriptionExpiresTimestamp) {
    isSubscribed = false;
  }

  const isExpired = !isSubscribed && timeElapsedMs >= totalTrialMs;
  const isTrialing = !isSubscribed && !isExpired;
  const daysRemaining = Math.max(0, Math.ceil(timeRemainingMs / (24 * 60 * 60 * 1000)));
  const hoursRemaining = Math.max(0, Math.floor(timeRemainingMs / (1000 * 60 * 60)));
  const minutesRemaining = Math.max(0, Math.floor(timeRemainingMs / (1000 * 60)));
  const percentElapsed = Math.min(100, Math.max(0, (timeElapsedMs / totalTrialMs) * 100));

  const trialExpirationTimestamp = data.firstLaunchTimestamp + totalTrialMs;
  const renewalTimestamp = data.subscriptionExpiresTimestamp || (now + ONE_YEAR_MS);

  return {
    firstLaunchTimestamp: data.firstLaunchTimestamp,
    trialDurationDays: TRIAL_DURATION_DAYS,
    isSubscribed,
    subscriptionPlan: data.subscriptionPlan || 'yearly_pass',
    subscriptionPrice: `${YEARLY_PRICE_USD}${YEARLY_PRICE_PERIOD}`,
    subscriptionMonthlyEquivalent: MONTHLY_EQUIVALENT_USD,
    subscriptionSource: data.subscriptionSource || 'none',
    subscriptionExpiresTimestamp: data.subscriptionExpiresTimestamp,
    licenseKey: data.licenseKey,
    isExpired,
    isTrialing,
    daysRemaining,
    hoursRemaining,
    minutesRemaining,
    timeElapsedMs,
    totalTrialMs,
    percentElapsed,
    formattedFirstLaunch: new Date(data.firstLaunchTimestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    formattedTrialExpirationDate: new Date(trialExpirationTimestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    formattedSubscriptionRenewalDate: new Date(renewalTimestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  };
}

/**
 * Subscribes user to the $3.99/year plan via Microsoft Store
 */
export function subscribeYearlyPlan(source: PurchaseSource = 'windows_store', key?: string): boolean {
  const current = getStoredData();
  const oneYearFromNow = Date.now() + ONE_YEAR_MS;

  saveStoredData({
    ...current,
    isSubscribed: true,
    subscriptionPlan: 'yearly_pass',
    subscriptionSource: source,
    subscriptionExpiresTimestamp: oneYearFromNow,
    licenseKey: key || 'MS-STORE-IAP-399YR',
  });
  return true;
}

/**
 * Activates annual subscription with a purchased license key
 */
export function activateLicenseKey(key: string): boolean {
  const trimmed = key.trim().toUpperCase();
  if (trimmed.length < 4) return false;

  const current = getStoredData();
  const oneYearFromNow = Date.now() + ONE_YEAR_MS;

  saveStoredData({
    ...current,
    isSubscribed: true,
    subscriptionPlan: 'yearly_pass',
    subscriptionSource: 'license_key',
    subscriptionExpiresTimestamp: oneYearFromNow,
    licenseKey: trimmed,
  });
  return true;
}

/**
 * Simulates restoring Microsoft Store or Web Purchase
 */
export function restorePurchases(): { success: boolean; message: string } {
  const current = getStoredData();
  if (current.isSubscribed) {
    return {
      success: true,
      message: 'Active yearly subscription ($3.99/year) successfully verified.',
    };
  }

  // Restore active status
  subscribeYearlyPlan('windows_store', 'MS-STORE-RESTORED-399');
  return {
    success: true,
    message: 'Found valid Microsoft Store license for ThockyApp ($3.99/yr). Restored!',
  };
}

/**
 * Cancels active auto-renewal / resets subscription
 */
export function cancelSubscription(): void {
  const current = getStoredData();
  saveStoredData({
    ...current,
    isSubscribed: false,
    subscriptionSource: 'none',
    subscriptionExpiresTimestamp: undefined,
    licenseKey: undefined,
  });
}

/**
 * Resets the 1-day trial back to start (Full 24 hours remaining)
 */
export function resetTrialPeriod(): void {
  saveStoredData({
    firstLaunchTimestamp: Date.now(),
    isSubscribed: false,
    subscriptionPlan: 'yearly_pass',
    subscriptionSource: 'none',
    subscriptionExpiresTimestamp: undefined,
    licenseKey: undefined,
  });
}

/**
 * Simulates trial expiration (advances firstLaunch to 2 days ago)
 */
export function simulateExpiredTrial(): void {
  const twoDaysAgo = Date.now() - (2 * 24 * 60 * 60 * 1000);
  saveStoredData({
    firstLaunchTimestamp: twoDaysAgo,
    isSubscribed: false,
    subscriptionPlan: 'yearly_pass',
    subscriptionSource: 'none',
    subscriptionExpiresTimestamp: undefined,
    licenseKey: undefined,
  });
}

/**
 * Simulates elapsed days (e.g. advance to day 5)
 */
export function simulateDaysElapsed(days: number): void {
  const pastTimestamp = Date.now() - (days * 24 * 60 * 60 * 1000);
  saveStoredData({
    firstLaunchTimestamp: pastTimestamp,
    isSubscribed: false,
    subscriptionPlan: 'yearly_pass',
    subscriptionSource: 'none',
    subscriptionExpiresTimestamp: undefined,
    licenseKey: undefined,
  });
}
