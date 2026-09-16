import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Toast from '../components/common/Toast';
import { logoutUser } from '../services/authService';
import { Bell, Moon, Lock, LogOut } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [inviteNotifs, setInviteNotifs] = useState(true);
  const [expenseNotifs, setExpenseNotifs] = useState(true);
  const [theme, setTheme] = useState('Light');
  const [toastMessage, setToastMessage] = useState('');

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setToastMessage('Application preferences saved!');
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Application Settings</h1>
        <p className="page-subtitle">Configure notifications, currency, theme, and security</p>
      </div>

      <div className="form-container" style={{ maxWidth: '680px', margin: 0 }}>
        <form onSubmit={handleSaveSettings} className="form-grid">
          
          {/* Notifications Section */}
          <div className="card">
            <h2 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
              <Bell size={18} style={{ color: 'var(--primary)' }} />
              <span>Notification Preferences</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.9rem' }}>
                <span>Email Notifications</span>
                <input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.9rem' }}>
                <span>Trip Invitation Alerts</span>
                <input type="checkbox" checked={inviteNotifs} onChange={(e) => setInviteNotifs(e.target.checked)} />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.9rem' }}>
                <span>New Expense & Settlement Updates</span>
                <input type="checkbox" checked={expenseNotifs} onChange={(e) => setExpenseNotifs(e.target.checked)} />
              </label>
            </div>
          </div>

          {/* Display & Currency */}
          <div className="card">
            <h2 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
              <Moon size={18} style={{ color: 'var(--primary)' }} />
              <span>Preferences & Currency</span>
            </h2>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Currency Symbol</label>
                <select className="form-input" defaultValue="INR">
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Application Theme</label>
                <select className="form-input" value={theme} onChange={(e) => setTheme(e.target.value)}>
                  <option value="Light">Light Mode</option>
                  <option value="Dark">Dark Mode (Coming Soon)</option>
                  <option value="System">System Default</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security & Logout */}
          <div className="card">
            <h2 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
              <Lock size={18} style={{ color: 'var(--primary)' }} />
              <span>Security & Session</span>
            </h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>Log Out of Session</p>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sign out of your current browser session</span>
              </div>

              <button type="button" className="btn-secondary" style={{ color: 'var(--accent-danger)' }} onClick={handleLogout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Save Settings
          </button>
        </form>
      </div>

      <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />
    </DashboardLayout>
  );
}
