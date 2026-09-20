import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { Clock, MapPin, Trash2, Edit } from 'lucide-react';

export default function ActivityCard({ activity, onEdit, onDelete }) {
  return (
    <div className="expense-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.6rem' }}>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ 
            fontSize: '0.8rem', 
            fontWeight: 700, 
            backgroundColor: 'var(--primary-light)', 
            color: 'var(--primary)', 
            padding: '0.2rem 0.6rem', 
            borderRadius: 'var(--radius-sm)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <Clock size={13} />
            {activity.startTime} - {activity.endTime}
          </span>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            {activity.title}
          </h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {activity.estimatedCost > 0 && (
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-success)' }}>
              ~{formatCurrency(activity.estimatedCost)}
            </span>
          )}
          {onEdit && (
            <button
              className="icon-btn"
              style={{ width: '30px', height: '30px' }}
              onClick={() => onEdit(activity)}
              title="Edit Activity"
            >
              <Edit size={14} />
            </button>
          )}
          {onDelete && (
            <button 
              className="btn-icon-danger" 
              style={{ width: '30px', height: '30px' }}
              onClick={() => onDelete(activity.id)}
              title="Delete Activity"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {activity.location && (
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <MapPin size={14} />
          {activity.location}
        </span>
      )}

      {activity.notes && (
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-app)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', width: '100%', margin: 0 }}>
          {activity.notes}
        </p>
      )}
    </div>
  );
}
