import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getItem, setItem, STORAGE_KEYS } from '../services/storage';
import { formatShortDate } from '../utils/formatters';
import { Bell, CheckCheck, CreditCard, Mail, PieChart, Calendar } from 'lucide-react';

const NOTIF_ICONS = {
  INVITATION: Mail,
  EXPENSE: CreditCard,
  SETTLEMENT: PieChart,
  ITINERARY: Calendar
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const items = getItem(STORAGE_KEYS.NOTIFICATIONS, []);
    setNotifications(items);
  }, []);

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  const handleMarkRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  return (
    <DashboardLayout>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">Stay updated on trip invites, expenses, and settlements</p>
        </div>

        <button className="btn-secondary" onClick={handleMarkAllRead} style={{ width: 'auto' }}>
          <CheckCheck size={16} />
          <span>Mark All as Read</span>
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {notifications.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No notifications at this time.
            </p>
          ) : (
            notifications.map((notif) => {
              const Icon = NOTIF_ICONS[notif.type] || Bell;

              return (
                <div 
                  key={notif.id} 
                  className="expense-item"
                  style={{
                    backgroundColor: notif.read ? 'var(--bg-surface)' : 'var(--primary-light)',
                    borderColor: notif.read ? 'var(--border-subtle)' : 'var(--primary-border)'
                  }}
                >
                  <div className="expense-left">
                    <div className="expense-cat-icon" style={{ backgroundColor: notif.read ? 'var(--bg-app)' : '#FFFFFF' }}>
                      <Icon size={20} />
                    </div>

                    <div className="expense-details">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="expense-title" style={{ fontSize: '0.95rem' }}>{notif.title}</span>
                        {!notif.read && (
                          <span className="notification-badge" style={{ position: 'static' }} />
                        )}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.15rem 0' }}>
                        {notif.description}
                      </p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                        {formatShortDate(notif.date)}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {notif.link && (
                      <Link to={notif.link} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                        View
                      </Link>
                    )}
                    {!notif.read && (
                      <button className="btn-icon-danger" style={{ width: '32px', height: '32px', color: 'var(--text-muted)' }} onClick={() => handleMarkRead(notif.id)} title="Mark Read">
                        ✓
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
