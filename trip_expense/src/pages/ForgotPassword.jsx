import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="brand-logo" style={{ margin: '0 auto 1rem', width: '44px', height: '44px' }}>
            <Compass size={24} />
          </div>
          <h1 className="page-title" style={{ fontSize: '1.5rem' }}>Forgot your password?</h1>
          <p className="page-subtitle">Enter your email and we'll send you a password reset link.</p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', backgroundColor: 'var(--accent-success-bg)', border: '1px solid #A7F3D0', color: 'var(--accent-success)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <CheckCircle2 size={32} style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontWeight: 600 }}>Reset link sent!</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              If an account exists with <strong>{email}</strong>, a password reset link has been dispatched.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  className="form-input has-icon"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Send Reset Link
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/login" className="view-all-link" style={{ fontSize: '0.9rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
