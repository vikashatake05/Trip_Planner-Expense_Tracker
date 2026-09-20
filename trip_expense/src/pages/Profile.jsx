import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import SummaryCard from '../components/trips/SummaryCard';
import Toast from '../components/common/Toast';
import { getCurrentUser, updateUserProfile } from '../services/authService';
import { getAllTrips } from '../services/tripService';
import { User, Mail, Map, Sparkles } from 'lucide-react';

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [stats, setStats] = useState({ created: 0, joined: 0, total: 0 });
  const [toastMessage, setToastMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const user = getCurrentUser();
      setCurrentUser(user);
      if (user) {
        setName(user.name || '');
        setEmail(user.email || '');

        const trips = await getAllTrips();
        const created = trips.filter(t => t.ownerId === user.id || t.createdBy === user.name).length;
        const joined = trips.filter(t => t.ownerId !== user.id && t.createdBy !== user.name).length;
        setStats({ created, joined, total: trips.length });
      }
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'VS';
    const updated = await updateUserProfile({ name, email, avatar: initials });

    setCurrentUser(updated);
    setSubmitting(false);
    setToastMessage('Profile updated successfully!');
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">User Profile</h1>
        <p className="page-subtitle">Manage your account information and travel history</p>
      </div>

      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <SummaryCard title="Trips Created" value={stats.created} icon={Map} color="#2563EB" bg="#EFF6FF" />
        <SummaryCard title="Trips Joined" value={stats.joined} icon={Sparkles} color="#10B981" bg="#ECFDF5" />
        <SummaryCard title="Total Trips" value={stats.total} icon={User} color="#8B5CF6" bg="#F3E8FF" />
      </div>

      <div className="form-container" style={{ maxWidth: '640px', margin: 0 }}>
        <div className="form-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
            <div className="user-avatar" style={{ width: '64px', height: '64px', fontSize: '1.4rem' }}>
              {currentUser?.user_metadata?.avatar || currentUser?.user_metadata?.name?.slice(0, 2).toUpperCase() || 'VS'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>{currentUser?.name}</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentUser?.email}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  className="form-input has-icon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  className="form-input has-icon"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={submitting} style={{ marginTop: '0.5rem' }}>
              {submitting ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>

      <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />
    </DashboardLayout>
  );
}
