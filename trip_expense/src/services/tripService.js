/**
 * Service layer for TripLedger Trips Management.
 */

import { getItem, setItem, STORAGE_KEYS } from './storage';
import { MOCK_TRIPS } from '../data/mockTrips';
import { getExpensesByTripId } from './expenseService';

export const getAllTrips = async () => {
  return getItem(STORAGE_KEYS.TRIPS, MOCK_TRIPS);
};

export const getTripById = async (tripId) => {
  const trips = await getAllTrips();
  const found = trips.find((t) => t.id === tripId);
  return found || MOCK_TRIPS[0];
};

export const saveTrip = async (tripData) => {
  const trips = await getAllTrips();
  
  const generatedId = `trip_${Date.now()}`;
  const newTrip = {
    id: generatedId,
    ...tripData,
    createdAt: new Date().toISOString()
  };

  const updated = [newTrip, ...trips];
  setItem(STORAGE_KEYS.TRIPS, updated);
  
  return newTrip;
};

export const updateTripMembers = async (tripId, members) => {
  const trips = await getAllTrips();
  const updated = trips.map((t) => {
    if (t.id === tripId) {
      return { ...t, members, numberOfTravelers: members.length };
    }
    return t;
  });
  setItem(STORAGE_KEYS.TRIPS, updated);
  return updated.find((t) => t.id === tripId);
};

export const getUserTrips = async (userId, userEmail) => {
  const trips = await getAllTrips();
  return trips.filter((t) => {
    if (t.ownerId === userId) return true;
    if (t.members && t.members.some(m => m.userId === userId || m.email.toLowerCase() === (userEmail || '').toLowerCase())) {
      return true;
    }
    return false;
  });
};

export const getTripExpenses = getExpensesByTripId;
