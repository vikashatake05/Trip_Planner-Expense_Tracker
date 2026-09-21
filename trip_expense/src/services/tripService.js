/**
 * Service layer for TripLedger Trips Management.
 * Connects directly to Express REST API on http://localhost:5050/api/trips
 */

import api from './api';
import { getExpensesByTripId } from './expenseService';

export const getAllTrips = async () => {
  try {
    const res = await api.get('/trips');
    if (res.data && res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (err) {
    throw new Error(`Unable to load trips: ${err.message}`);
  }
};

export const getTripById = async (tripId) => {
  try {
    const res = await api.get(`/trips/${tripId}`);
    if (res.data && res.data.success && res.data.data) {
      return res.data.data;
    }
  } catch (err) {
    throw new Error(`Unable to load trip: ${err.message}`);
  }
};

export const saveTrip = async (tripData) => {
  try {
    const res = await api.post('/trips', tripData);
    if (res.data && res.data.success && res.data.data) {
      const createdTrip = res.data.data;
      return createdTrip;
    }
  } catch (err) {
    throw new Error(`Unable to save trip: ${err.message}`);
  }
};

export const updateTripMembers = async (tripId, members) => {
  try {
    const res = await api.patch(`/trips/${tripId}`, { members, numberOfTravelers: members.length });
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch (err) {
    throw new Error(`Unable to update trip members: ${err.message}`);
  }
};

export const deleteTrip = async (tripId) => {
  try {
    await api.delete(`/trips/${tripId}`);
  } catch (err) {
    throw new Error(`Unable to delete trip: ${err.message}`);
  }
};

export const getUserTrips = async () => {
  return getAllTrips();
};

export const getTripExpenses = getExpensesByTripId;
