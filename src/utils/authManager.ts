/**
 * User Account & Attribution Tracking Model
 * Manages in-app onboarding, registered email profiles, install source attribution,
 * and persistent subscriber records.
 */

export interface RegisteredUser {
  id: string;
  email: string;
  name?: string;
  registeredAt: number;
  installSource: 'microsoft_store' | 'website_direct' | 'organic_desktop' | 'standalone_exe';
  campaignId?: string; // e.g., 'website_landing_page', 'store_badge'
  machineId: string;
  isEmailVerified: boolean;
  totalKeystrokes: number;
  lastActiveTimestamp: number;
  trialExpiresTimestamp: number;
  isSubscribed: boolean;
  licenseKey?: string;
}

export interface AuthState {
  user: RegisteredUser | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  registeredUsersList: RegisteredUser[]; // Local simulation / sync storage for all captured signups
}

const USER_STORAGE_KEY = 'thocky_active_user_v1';
const ALL_USERS_STORAGE_KEY = 'thocky_captured_leads_v1';
const ONBOARDING_COMPLETED_KEY = 'thocky_onboarding_completed_v1';

// Generate or retrieve persistent local machine identifier
export function getMachineIdentifier(): string {
  let machineId = localStorage.getItem('thocky_machine_uuid');
  if (!machineId) {
    machineId = `WIN-PC-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    localStorage.setItem('thocky_machine_uuid', machineId);
  }
  return machineId;
}

// Get all captured customer signups
export function getAllCapturedUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(ALL_USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Unable to load captured users:', err);
  }
  return [];
}

// Get active signed-in user
export function getActiveUser(): RegisteredUser | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email) return parsed;
    }
  } catch (err) {
    console.warn('Unable to load active user:', err);
  }
  return null;
}

export function hasCompletedOnboarding(): boolean {
  return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true';
}

export function setOnboardingCompleted(completed: boolean): void {
  localStorage.setItem(ONBOARDING_COMPLETED_KEY, completed ? 'true' : 'false');
  window.dispatchEvent(new Event('thocky_auth_changed'));
}

// Register or sign in a user with install attribution
export function registerUser(
  email: string,
  name?: string,
  installSource: RegisteredUser['installSource'] = 'microsoft_store',
  campaignId: string = 'website_landing_page'
): RegisteredUser {
  const normalizedEmail = email.trim().toLowerCase();
  const machineId = getMachineIdentifier();
  const now = Date.now();
  const trialDurationMs = 3 * 24 * 60 * 60 * 1000;

  const allUsers = getAllCapturedUsers();
  let existing = allUsers.find((u) => u.email === normalizedEmail);

  if (existing) {
    // Update last active
    existing.lastActiveTimestamp = now;
    existing.name = name || existing.name;
  } else {
    existing = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: normalizedEmail,
      name: name || (normalizedEmail.split('@')[0] ? normalizedEmail.split('@')[0].replace(/[._-]/g, ' ') : 'Desktop User'),
      registeredAt: now,
      installSource,
      campaignId,
      machineId,
      isEmailVerified: true,
      totalKeystrokes: 0,
      lastActiveTimestamp: now,
      trialExpiresTimestamp: now + trialDurationMs,
      isSubscribed: false,
    };
    allUsers.unshift(existing);
  }

  // Persist
  localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(allUsers));
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(existing));
  localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');

  window.dispatchEvent(new Event('thocky_auth_changed'));
  return existing;
}

// Update active user keystroke count or subscription status
export function updateUserStats(keystrokesAdded: number = 1, isSubscribed?: boolean, licenseKey?: string): void {
  const user = getActiveUser();
  if (!user) return;

  user.totalKeystrokes = (user.totalKeystrokes || 0) + keystrokesAdded;
  user.lastActiveTimestamp = Date.now();
  if (typeof isSubscribed === 'boolean') {
    user.isSubscribed = isSubscribed;
  }
  if (licenseKey) {
    user.licenseKey = licenseKey;
  }

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

  const allUsers = getAllCapturedUsers();
  const index = allUsers.findIndex((u) => u.email === user.email);
  if (index !== -1) {
    allUsers[index] = user;
    localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(allUsers));
  }

  window.dispatchEvent(new Event('thocky_auth_changed'));
}

// Sign out
export function signOutUser(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
  window.dispatchEvent(new Event('thocky_auth_changed'));
}
