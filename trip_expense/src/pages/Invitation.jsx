import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getInvitationByToken, acceptInvitation, declineInvitation } from '../services/invitationService';
import { getCurrentUser } from '../services/authService';
import { formatDateRange, formatCurrency } from '../utils/formatters';
import { Compass, Users, Calendar, IndianRupee, CheckCircle2, XCircle } from 'lucide-react';

export default function Invitation() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [invitationData, setInvitationData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    async function loadInvite() {
      const user = getCurrentUser();
      setCurrentUser(user);

      const res = await getInvitationByToken(token);
      setInvitationData(res);
      setLoading(false);
    }
    loadInvite();
  }, [token]);

  const handleAccept = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setLoading(true);
    const res = await acceptInvitation(token, currentUser);
    setStatusMessage({ type: 'success', text: 'Invitation Accepted! Redirecting to Trip Dashboard...' });
    setTimeout(() => {
      navigate(`/trips/${res.tripId}/dashboard`);
    }, 1000);
  };

  const handleDecline = async () => {
    setLoading(true);
    await declineInvitation(token);
    setStatusMessage({ type: 'info', text: 'Invitation declined.' });
    setTimeout(() => {
      navigate('/trips');
    }, 1200);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading invitation details...</p>
      </div>
    );
  }

  const { invitation, trip } = invitationData || {};

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
        
        <div className="brand-logo" style={{ margin: '0 auto 1.25rem', width: '50px', height: '50px' }}>
          <Compass size={28} />
        </div>

        <h1 className="page-title" style={{ fontSize: '1.8rem' }}>You're Invited!</h1>
        <p className="page-subtitle" style={{ fontSize: '1rem', marginTop: '0.35rem' }}>
          <strong>{invitation?.invitedBy || 'A friend'}</strong> invited you to join:
        </p>

        {trip && (
          <div style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', margin: '1.75rem 0', textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              {trip.name || `${trip.destination} Trip`}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} />
                {formatDateRange(trip.startDate, trip.endDate)}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={16} />
                {trip.numberOfTravelers} Travelers
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <IndianRupee size={16} />
                {formatCurrency(trip.budget)} Budget
              </span>
            </div>
          </div>
        )}

        {statusMessage && (
          <div className="budget-warning-banner" style={{ backgroundColor: 'var(--accent-success-bg)', color: 'var(--accent-success)', borderColor: '#A7F3D0', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={18} />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {!currentUser ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--accent-warning)', fontWeight: 600 }}>
              Please log in or create an account to accept this trip invitation.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Link to="/login" className="btn-primary" style={{ justifyContent: 'center' }}>
                Login
              </Link>
              <Link to="/signup" className="btn-secondary" style={{ justifyContent: 'center' }}>
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <button className="btn-primary" onClick={handleAccept}>
              <CheckCircle2 size={18} />
              <span>Accept Invitation</span>
            </button>
            <button className="btn-secondary" onClick={handleDecline} style={{ color: 'var(--accent-danger)' }}>
              <XCircle size={18} />
              <span>Decline</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
