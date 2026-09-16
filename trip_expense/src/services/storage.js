/**
 * Storage Layer for TripLedger.
 * Centralized localStorage persistence manager.
 */

import { MOCK_USERS, CURRENT_MOCK_USER } from '../data/mockUsers';
import { MOCK_TRIPS } from '../data/mockTrips';
import { INITIAL_MOCK_EXPENSES } from '../data/mockExpenses';
import { MOCK_NOTIFICATIONS } from '../data/mockNotifications';
import { MOCK_ITINERARY } from '../data/mockItinerary';

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
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(MOCK_USERS));
  }
  if (!localStorage.getItem(KEYS.CURRENT_USER)) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(CURRENT_MOCK_USER));
  }
  if (!localStorage.getItem(KEYS.TRIPS)) {
    localStorage.setItem(KEYS.TRIPS, JSON.stringify(MOCK_TRIPS));
  }
  if (!localStorage.getItem(KEYS.EXPENSES)) {
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(INITIAL_MOCK_EXPENSES));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(MOCK_NOTIFICATIONS));
  }
  if (!localStorage.getItem(KEYS.ITINERARY)) {
    localStorage.setItem(KEYS.ITINERARY, JSON.stringify(MOCK_ITINERARY));
  }
  if (!localStorage.getItem(KEYS.INVITATIONS)) {
    const defaultInvites = [
      {
        id: 'inv_101',
        tripId: 'manali-trip-2026',
        token: 'token_manali_102',
        invitedBy: 'Rahul Sharma',
        name: 'Vikas S',
        email: 'vikas@example.com',
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(KEYS.INVITATIONS, JSON.stringify(defaultInvites));
  }
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
