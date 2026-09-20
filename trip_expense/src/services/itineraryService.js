/**
 * Itinerary Service for TripLedger.
 * Connects directly to Express REST API on http://localhost:5050/api/itinerary
 */

import api from './api';

export const getItineraryByTripId = async (tripId) => {
  try {
    const res = await api.get(`/itinerary/trip/${tripId}`);
    if (res.data && res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (err) {
    throw new Error(`Unable to load itinerary: ${err.message}`);
  }
};

export const addActivity = async (tripId, activityData) => {
  const payload = { tripId: String(tripId), ...activityData };
  try {
    const res = await api.post('/itinerary', payload);
    if (res.data && res.data.success && res.data.data) {
      const newActivity = res.data.data;
      return newActivity;
    }
  } catch (err) {
    throw new Error(`Unable to add activity: ${err.message}`);
  }
};

export const updateActivity = async (activityId, activityData) => {
  try {
    const res = await api.patch(`/itinerary/${activityId}`, activityData);
    if (res.data && res.data.success && res.data.data) return res.data.data;
  } catch (err) {
    throw new Error(`Unable to update activity: ${err.message}`);
  }
};

export const deleteActivity = async (activityId) => {
  try {
    await api.delete(`/itinerary/${activityId}`);
  } catch (err) {
    throw new Error(`Unable to delete activity: ${err.message}`);
  }
};
