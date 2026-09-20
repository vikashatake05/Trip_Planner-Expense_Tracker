import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  PlusCircle,
  Map,
  CreditCard,
  PieChart,
  User,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose, currentTripId }) {
  const location = useLocation();

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
    </>
  );
}
