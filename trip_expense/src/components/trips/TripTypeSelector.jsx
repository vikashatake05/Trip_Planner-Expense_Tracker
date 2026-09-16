import React from 'react';
import { User, Users } from 'lucide-react';

export default function TripTypeSelector({ tripType, onChange }) {
  return (
    <div className="segmented-control">
      <button
        type="button"
        className={`segment-option ${tripType === 'Solo' ? 'active' : ''}`}
        onClick={() => onChange('Solo')}
      >
        <User size={18} />
        <span>Solo</span>
      </button>

      <button
        type="button"
        className={`segment-option ${tripType === 'Group' ? 'active' : ''}`}
        onClick={() => onChange('Group')}
      >
        <Users size={18} />
        <span>Group</span>
      </button>
    </div>
  );
}
