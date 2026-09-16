/**
 * Auth Service for TripLedger.
 * Manages user authentication, registration, session state, and profile updates.
 * 
 * FUTURE API ENDPOINTS:
 * POST /api/auth/login
 * POST /api/auth/register
 * GET /api/auth/me
 */

import { getItem, setItem, STORAGE_KEYS } from './storage';
import { CURRENT_MOCK_USER } from '../data/mockUsers';

export const getCurrentUser = () => {
  return getItem(STORAGE_KEYS.CURRENT_USER, CURRENT_MOCK_USER);
};

export const loginUser = async (email, password) => {
  /*
  // Future Express API:
  // const res = await api.post('/auth/login', { email, password });
  // setItem('tripledger_token', res.data.token);
  // return res.data.user;
  */
  const users = getItem(STORAGE_KEYS.USERS, []);
  const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (found) {
    setItem(STORAGE_KEYS.CURRENT_USER, found);
    return found;
  }

  // Create mock user if logging in with new email
  const nameFromEmail = email.split('@')[0];
  const initials = nameFromEmail.substring(0, 2).toUpperCase();
  const newUser = {
    id: `usr_${Date.now()}`,
    name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
    email: email.trim(),
    avatar: initials,
    role: 'Traveler'
  };

  const updatedUsers = [...users, newUser];
  setItem(STORAGE_KEYS.USERS, updatedUsers);
  setItem(STORAGE_KEYS.CURRENT_USER, newUser);
  return newUser;
};

export const signupUser = async (name, email, password) => {
  /*
  // Future Express API:
  // const res = await api.post('/auth/register', { name, email, password });
  // return res.data.user;
  */
  const users = getItem(STORAGE_KEYS.USERS, []);
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'US';
  
  const newUser = {
    id: `usr_${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    avatar: initials,
    role: 'Traveler'
  };

  const updatedUsers = [newUser, ...users];
  setItem(STORAGE_KEYS.USERS, updatedUsers);
  setItem(STORAGE_KEYS.CURRENT_USER, newUser);
  return newUser;
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem('tripledger_token');
};

export const updateUserProfile = async (updatedData) => {
  const currentUser = getCurrentUser();
  const users = getItem(STORAGE_KEYS.USERS, []);

  const updatedUser = {
    ...currentUser,
    ...updatedData
  };

  const updatedUsers = users.map((u) => u.id === currentUser.id ? updatedUser : u);
  
  setItem(STORAGE_KEYS.USERS, updatedUsers);
  setItem(STORAGE_KEYS.CURRENT_USER, updatedUser);

  return updatedUser;
};
