/**
 * Itinerary Service for TripLedger.
 * Manages daily activities and timeline plans.
 * 
 * FUTURE API ENDPOINTS:
 * GET /api/trips/:tripId/itinerary
 * POST /api/trips/:tripId/itinerary
 * DELETE /api/itinerary/:id
 */

import { getItem, setItem, STORAGE_KEYS } from './storage';
import { MOCK_ITINERARY } from '../data/mockItinerary';

export const getItineraryByTripId = async (tripId) => {
  const items = getItem(STORAGE_KEYS.ITINERARY, MOCK_ITINERARY);
  return items.filter((item) => item.tripId === tripId);
};

export const addActivity = async (tripId, activityData) => {
  const items = getItem(STORAGE_KEYS.ITINERARY, MOCK_ITINERARY);
  
  const newActivity = {
    id: `act_${Date.now()}`,
    tripId,
    ...activityData,
    createdAt: new Date().toISOString()
  };

  const updated = [...items, newActivity];
  setItem(STORAGE_KEYS.ITINERARY, updated);
  return newActivity;
};

export const deleteActivity = async (activityId) => {
  const items = getItem(STORAGE_KEYS.ITINERARY, MOCK_ITINERARY);
  const filtered = items.filter((item) => item.id !== activityId);
  setItem(STORAGE_KEYS.ITINERARY, filtered);
  return true;
};
