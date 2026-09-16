import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Compass, ArrowLeft } from 'lucide-react';

export default function PlaceholderPage({ title = 'Feature Coming Soon' }) {
  const { tripId } = useParams();
  const currentId = tripId || 'goa-trip-2026';

  return (
    <DashboardLayout currentTripId={currentId}>
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px', margin: '2rem auto' }}>
        <div 
          className="summary-icon-box" 
          style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}
        >
          <Compass size={32} />
        </div>
        
        <h1 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{title}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          This page is structured for future Express/Node.js REST API module integration.
        </p>

        <Link 
          to={`/trips/${currentId}/dashboard`} 
          className="btn-primary" 
          style={{ display: 'inline-flex', width: 'auto' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </DashboardLayout>
  );
}
