import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import TripMembersList from '../components/trips/TripMembersList';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';
import { getTripById, updateTripMembers } from '../services/tripService';
import { createInvitation } from '../services/invitationService';
import { getCurrentUser } from '../services/authService';
import { User, Mail, Plus } from 'lucide-react';

export default function TripMembers() {
  const { tripId } = useParams();
  const currentId = tripId;

  const [trip, setTrip] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMembersData() {
      const user = getCurrentUser();
      setCurrentUser(user);

      const tData = await getTripById(currentId);
      setTrip(tData);
      setLoading(false);
    }
    loadMembersData();
  }, [currentId]);

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    await createInvitation(currentId, { name: inviteName, email: inviteEmail }, currentUser?.name || 'Vikas');

    const updatedMembers = [
      ...(trip.members || []),
      {
        userId: `usr_pending_${Date.now()}`,
        name: inviteName.trim() || inviteEmail.split('@')[0],
        email: inviteEmail.trim(),
        role: 'MEMBER',
        status: 'PENDING',
        joinedAt: new Date().toISOString()
      }
    ];

    const updatedTrip = await updateTripMembers(currentId, updatedMembers);
    setTrip(updatedTrip);

    setInviteName('');
    setInviteEmail('');
    setIsInviteModalOpen(false);
    setToastMessage('Invitation sent successfully! Pending acceptance.');
  };

  const handleRemoveMember = async (targetEmail) => {
    if (window.confirm(`Remove ${targetEmail} from trip?`)) {
      const updatedMembers = trip.members.filter((m) => m.email.toLowerCase() !== targetEmail.toLowerCase());
      const updatedTrip = await updateTripMembers(currentId, updatedMembers);
      setTrip(updatedTrip);
      setToastMessage(`Member ${targetEmail} removed.`);
    }
  };

  if (loading) {
    return (
      <DashboardLayout currentTripId={currentId}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <p style={{ fontWeight: 600 }}>Loading trip members...</p>
        </div>
      </DashboardLayout>
    );
  }

  const isOwner = trip?.ownerId === currentUser?.id || trip?.createdBy === currentUser?.name;

  return (
    <DashboardLayout currentTripId={currentId}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Trip Members</h1>
          <p className="page-subtitle">Manage travelers and pending invitations for {trip?.name}</p>
        </div>

        <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setIsInviteModalOpen(true)}>
          <Plus size={18} />
          <span>Invite Members</span>
        </button>
      </div>

      <TripMembersList
        members={trip?.members || []}
        onInviteClick={() => setIsInviteModalOpen(true)}
        onRemoveMember={handleRemoveMember}
        isOwner={isOwner}
      />

      <Modal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        title="Invite New Member"
      >
        <form onSubmit={handleSendInvite} className="form-grid" style={{ gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Member Name (Optional)</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                type="text"
                className="form-input has-icon"
                placeholder="e.g. Rahul Sharma"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                className="form-input has-icon"
                placeholder="rahul@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              Send Invitation
            </button>
          </div>
        </form>
      </Modal>

      <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />
    </DashboardLayout>
  );
}
