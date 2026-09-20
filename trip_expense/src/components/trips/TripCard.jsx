import React from 'react';
import { Link } from 'react-router-dom';
import { formatDateRange, formatCurrency } from '../../utils/formatters';
import { calculateBudgetPercentage, getTripStatus } from '../../utils/tripCalculations';
import { MapPin, Calendar, Users, ArrowRight, Trash2 } from 'lucide-react';

export default function TripCard({ trip, spent = 0, onDelete }) {
  const percentage = calculateBudgetPercentage(trip.budget, spent);
  const remaining = Math.max(0, trip.budget - spent);
  const statusInfo = getTripStatus(trip.startDate, trip.endDate);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', position: 'relative' }}>
      <div className="card-header-flex" style={{ marginBottom: 0 }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {trip.name || `${trip.destination} Trip`}
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
            <MapPin size={14} />
            {trip.destination}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={`status-badge ${statusInfo.statusKey}`}>
            <span className="status-dot" />
            {statusInfo.label}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Calendar size={15} />
          {formatDateRange(trip.startDate, trip.endDate)}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Users size={15} />
          {trip.tripType} • {trip.numberOfTravelers} {trip.numberOfTravelers === 1 ? 'member' : 'members'}
        </span>
      </div>

      <div style={{ backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
          <span>Budget: {formatCurrency(trip.budget)}</span>
          <span style={{ color: 'var(--primary)' }}>Spent: {formatCurrency(spent)}</span>
        </div>
        <div className="progress-track" style={{ height: '8px' }}>
          <div className="progress-fill" style={{ width: `${percentage}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>{percentage}% Used</span>
          <span>Remaining: {formatCurrency(remaining)}</span>
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
        <Link 
          to={`/trips/${trip.id}/dashboard`} 
          className="btn-secondary" 
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <span>Open Trip</span>
          <ArrowRight size={16} />
        </Link>

        {onDelete && (
          <button 
            type="button"
            className="btn-icon-danger"
            style={{ width: '40px', height: '40px' }}
            onClick={(e) => {
              e.preventDefault();
              onDelete(trip.id, trip.name || `${trip.destination} Trip`);
            }}
            title="Delete Trip"
            aria-label="Delete Trip"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
