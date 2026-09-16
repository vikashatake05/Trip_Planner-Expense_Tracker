import React from 'react';
import { Plus, Trash2, User, Mail } from 'lucide-react';

export default function MemberInput({ members = [], onMembersChange, errors = {} }) {
  const handleAddMember = () => {
    const newMember = {
      id: String(Date.now()),
      name: '',
      email: ''
    };
    onMembersChange([...members, newMember]);
  };

  const handleRemoveMember = (id) => {
    if (members.length <= 1) return; // Maintain at least 1 member
    onMembersChange(members.filter((m) => m.id !== id));
  };

  const handleFieldChange = (id, field, value) => {
    const updated = members.map((m) => {
      if (m.id === id) {
        return { ...m, [field]: value };
      }
      return m;
    });
    onMembersChange(updated);
  };

  return (
    <div className="form-group">
      <div className="form-label">
        <span>Group Members</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>
          {members.length} {members.length === 1 ? 'member' : 'members'} added
        </span>
      </div>

      <div className="member-list">
        {members.map((member, idx) => (
          <div key={member.id || idx} className="member-row">
            <div className="input-wrapper" style={{ flex: 1 }}>
              <User className="input-icon" size={16} />
              <input
                type="text"
                className={`form-input has-icon ${errors[`member_${idx}_name`] ? 'error' : ''}`}
                placeholder="Name (e.g. Rahul)"
                value={member.name}
                onChange={(e) => handleFieldChange(member.id, 'name', e.target.value)}
              />
            </div>

            <div className="input-wrapper" style={{ flex: 1.2 }}>
              <Mail className="input-icon" size={16} />
              <input
                type="email"
                className={`form-input has-icon ${errors[`member_${idx}_email`] ? 'error' : ''}`}
                placeholder="Email (e.g. rahul@example.com)"
                value={member.email}
                onChange={(e) => handleFieldChange(member.id, 'email', e.target.value)}
              />
            </div>

            {members.length > 1 && (
              <button
                type="button"
                className="btn-icon-danger"
                onClick={() => handleRemoveMember(member.id)}
                title="Remove Member"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        {errors.members && (
          <span className="error-text">{errors.members}</span>
        )}
      </div>

      <button
        type="button"
        className="btn-secondary"
        style={{ marginTop: '0.5rem' }}
        onClick={handleAddMember}
      >
        <Plus size={16} />
        <span>Add Member</span>
      </button>
    </div>
  );
}
