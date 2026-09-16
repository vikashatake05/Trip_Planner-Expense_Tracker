import React from 'react';
import { User, ShieldCheck, Mail, Clock } from 'lucide-react';

export default function TripMembersList({ members = [], onInviteClick, onRemoveMember, isOwner = false }) {
  return (
    <div className="card">
      <div className="card-header-flex">
        <h2 className="card-title">
          <User size={20} style={{ color: 'var(--primary)' }} />
          <span>Trip Members ({members.length})</span>
        </h2>

        {onInviteClick && (
          <button className="btn-secondary" onClick={onInviteClick}>
            + Invite Members
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
        {members.map((member, idx) => {
          const isPending = member.status === 'PENDING';
          const isAccepted = member.status === 'ACCEPTED';
          const isOwnerRole = member.role === 'OWNER';

          return (
            <div 
              key={member.userId || member.email || idx} 
              className="expense-item" 
              style={{ justifyContent: 'space-between' }}
            >
              <div className="expense-left">
                <div className="user-avatar" style={{ width: '40px', height: '40px', fontSize: '0.85rem' }}>
                  {(member.name || member.email || 'U').substring(0, 2).toUpperCase()}
                </div>

                <div className="expense-details">
                  <span className="expense-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {member.name || 'Invited User'}
                    {isOwnerRole && (
                      <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                        OWNER
                      </span>
                    )}
                  </span>
                  <span className="expense-meta" style={{ gap: '0.4rem' }}>
                    <Mail size={13} />
                    {member.email}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className={`status-badge ${isAccepted ? 'in_progress' : isPending ? 'upcoming' : 'completed'}`}>
                  {isAccepted ? <ShieldCheck size={13} /> : <Clock size={13} />}
                  {member.status || 'ACCEPTED'}
                </span>

                {isOwner && !isOwnerRole && onRemoveMember && (
                  <button 
                    className="btn-icon-danger" 
                    onClick={() => onRemoveMember(member.email)}
                    title="Remove Member"
                    style={{ width: '32px', height: '32px' }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
