import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function SettlementList({ settlements = [] }) {
  if (settlements.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <CheckCircle2 size={40} style={{ color: 'var(--accent-success)', margin: '0 auto 0.75rem' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>All Balances Settled!</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Everyone has paid their exact share. No pending debt transfers required.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header-flex" style={{ marginBottom: '1.25rem' }}>
        <h2 className="card-title">
          <span>Who Owes Whom</span>
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {settlements.length} transfer{settlements.length === 1 ? '' : 's'} to settle
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {settlements.map((item, idx) => (
          <div 
            key={idx} 
            className="expense-item" 
            style={{ 
              backgroundColor: 'var(--bg-app)', 
              borderColor: 'var(--border-light)',
              justify: 'space-between',
              padding: '1rem 1.25rem' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 700, color: 'var(--accent-danger)' }}>{item.fromName}</span>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <span>owes</span>
                <ArrowRight size={16} />
              </div>
              <span style={{ fontWeight: 700, color: 'var(--accent-success)' }}>{item.toName}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {formatCurrency(item.amount)}
              </span>
              <button className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                Settle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
