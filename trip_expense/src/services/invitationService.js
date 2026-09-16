/**
 * Invitation Service for TripLedger.
 * Manages email invitations, pending token resolution, accept, and decline actions.
 * 
 * FUTURE API ENDPOINTS:
 * POST /api/trips/:tripId/invitations
 * GET /api/invitations/:token
 * POST /api/invitations/:token/accept
 * POST /api/invitations/:token/decline
 */

import { getItem, setItem, STORAGE_KEYS } from './storage';
import { getTripById, updateTripMembers } from './tripService';

export const createInvitation = async (tripId, memberData, inviterName = 'Vikas S') => {
  const invitations = getItem(STORAGE_KEYS.INVITATIONS, []);
  const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  
  const newInvite = {
    id: `inv_${Date.now()}`,
    tripId,
    invitedBy: inviterName,
    name: memberData.name || memberData.email.split('@')[0],
    email: memberData.email.trim(),
    status: 'PENDING',
    token,
    createdAt: new Date().toISOString()
  };

  const updated = [newInvite, ...invitations];
  setItem(STORAGE_KEYS.INVITATIONS, updated);

  return newInvite;
};

export const getInvitationByToken = async (token) => {
  const invitations = getItem(STORAGE_KEYS.INVITATIONS, []);
  let invite = invitations.find((inv) => inv.token === token);
  
  if (!invite) {
    // Fallback invitation record for testing /invite/:token demo
    invite = {
      id: 'inv_demo',
      tripId: 'goa-trip-2026',
      invitedBy: 'Rahul Sharma',
      name: 'Friend',
      email: 'friend@example.com',
      status: 'PENDING',
      token
    };
  }

  const trip = await getTripById(invite.tripId);
  return { invitation: invite, trip };
};

export const acceptInvitation = async (token, currentUser) => {
  const invitations = getItem(STORAGE_KEYS.INVITATIONS, []);
  let targetInvite = invitations.find((inv) => inv.token === token);

  const tripId = targetInvite ? targetInvite.tripId : 'goa-trip-2026';
  const trip = await getTripById(tripId);

  // Update invitation status to ACCEPTED
  if (targetInvite) {
    const updatedInvites = invitations.map((inv) => 
      inv.token === token ? { ...inv, status: 'ACCEPTED', acceptedAt: new Date().toISOString() } : inv
    );
    setItem(STORAGE_KEYS.INVITATIONS, updatedInvites);
  }

  // Update member status in the Trip
  if (trip && trip.members) {
    const existingIndex = trip.members.findIndex(
      (m) => m.email.toLowerCase() === (currentUser?.email || '').toLowerCase()
    );

    let updatedMembers = [...trip.members];
    if (existingIndex >= 0) {
      updatedMembers[existingIndex] = {
        ...updatedMembers[existingIndex],
        userId: currentUser.id,
        name: currentUser.name,
        status: 'ACCEPTED',
        joinedAt: new Date().toISOString()
      };
    } else {
      updatedMembers.push({
        userId: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: 'MEMBER',
        status: 'ACCEPTED',
        joinedAt: new Date().toISOString()
      });
    }

    await updateTripMembers(tripId, updatedMembers);
  }

  return { success: true, tripId };
};

export const declineInvitation = async (token) => {
  const invitations = getItem(STORAGE_KEYS.INVITATIONS, []);
  const updatedInvites = invitations.map((inv) => 
    inv.token === token ? { ...inv, status: 'DECLINED' } : inv
  );
  setItem(STORAGE_KEYS.INVITATIONS, updatedInvites);
  return { success: true };
};
