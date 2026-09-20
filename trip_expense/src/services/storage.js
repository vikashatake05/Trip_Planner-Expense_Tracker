/**
 * Storage Layer for TripLedger.
 * Centralized localStorage persistence manager.
 */

const KEYS = {
  USERS: 'tripledger_users',
  CURRENT_USER: 'tripledger_current_user',
  TRIPS: 'tripledger_trips',
  EXPENSES: 'tripledger_expenses',
  NOTIFICATIONS: 'tripledger_notifications',
  ITINERARY: 'tripledger_itinerary',
  INVITATIONS: 'tripledger_invitations'
};

export const initStorage = () => {
  // Local storage remains available for session-only UI state.
};

// Initialize immediately
initStorage();

export const getItem = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`Storage getItem error [${key}]:`, err);
    return fallback;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Storage setItem error [${key}]:`, err);
  }
};

export const STORAGE_KEYS = KEYS;
