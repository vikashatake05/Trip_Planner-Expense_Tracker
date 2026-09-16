import React from 'react';

export default function SummaryCard({ title, value, icon: Icon, color = 'var(--primary)', bg = 'var(--primary-light)' }) {
  return (
    <div className="summary-card">
      <div className="summary-icon-box" style={{ color, backgroundColor: bg }}>
        <Icon size={24} />
      </div>
      <div className="summary-content">
        <span className="summary-value">{value}</span>
        <span className="summary-title">{title}</span>
      </div>
    </div>
  );
}
