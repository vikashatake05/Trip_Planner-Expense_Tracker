import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  PlusCircle,
  Map,
  CreditCard,
  PieChart,
  User,
  LogOut,
  X
} from 'lucide-react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose, currentTripId }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'New Trip', path: '/trips/new', icon: PlusCircle },
    { label: 'My Trips', path: '/trips', icon: Map },
    { 
      label: 'Expenses', 
      path: currentTripId ? `/trips/${currentTripId}/expenses` : '/expenses', 
      icon: CreditCard 
    },
    { 
      label: 'Split & Settle', 
      path: currentTripId ? `/trips/${currentTripId}/split` : '/split', 
      icon: PieChart 
    },
    { label: 'Profile', path: '/profile', icon: User }
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError('');

    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      const errorMessage = error?.message?.toLowerCase() || '';
      const sessionIsGone = error?.name === 'AuthSessionMissingError'
        || error?.status === 401
        || errorMessage.includes('session') && errorMessage.includes('missing');

      if (sessionIsGone) {
        navigate('/login', { replace: true });
      } else {
        setLogoutError('We could not log you out. Please try again.');
        setIsLoggingOut(false);
      }
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-logo">
            <Compass size={22} />
          </div>
          <span className="brand-title">TripLedger</span>
          {isOpen && (
            <button 
              className="mobile-toggle" 
              style={{ marginLeft: 'auto', color: '#94A3B8' }}
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Active if exact match or nested sub-route match
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          <button
            type="button"
            className="nav-item"
            style={{ width: '100%', border: 0, background: 'transparent', textAlign: 'left', cursor: 'pointer' }}
            onClick={() => {
              setLogoutError('');
              setIsLogoutModalOpen(true);
            }}
          >
            <LogOut className="icon" />
            <span>Logout</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
            VS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.85rem' }}>Vikas S</span>
            <span>Premium Plan</span>
          </div>
        </div>
      </aside>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => {
          if (!isLoggingOut) setIsLogoutModalOpen(false);
        }}
        title="Log out"
      >
        <p style={{ marginBottom: '1.5rem' }}>Are you sure you want to log out?</p>
        {logoutError && (
          <p style={{ color: 'var(--accent-danger)', marginBottom: '1rem' }}>{logoutError}</p>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsLogoutModalOpen(false)}
            disabled={isLoggingOut}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{ width: 'auto' }}
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </Modal>
    </>
  );
}
