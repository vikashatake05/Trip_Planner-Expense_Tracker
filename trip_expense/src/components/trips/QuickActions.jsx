import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Split, Calendar, Users, Zap } from 'lucide-react';

export default function QuickActions({ tripId }) {
  const navigate = useNavigate();

  const actions = [
    { 
      label: '+ Add Expense', 
      icon: PlusCircle, 
      path: `/trips/${tripId}/expenses/new` 
    },
    { 
      label: 'Split Expense', 
      icon: Split, 
      path: `/trips/${tripId}/split` 
    },
    { 
      label: 'View Trip Plan', 
      icon: Calendar, 
      path: `/trips/${tripId}/itinerary` 
    },
    { 
      label: 'Manage Members', 
      icon: Users, 
      path: `/trips/${tripId}/members` 
    }
  ];

  return (
    <div className="card">
      <div className="card-header-flex">
        <h2 className="card-title">
          <Zap size={20} style={{ color: 'var(--primary)' }} />
          <span>Quick Actions</span>
        </h2>
      </div>

      <div className="quick-actions-grid">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              className="action-btn"
              onClick={() => navigate(act.path)}
            >
              <Icon className="icon" />
              <span>{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
