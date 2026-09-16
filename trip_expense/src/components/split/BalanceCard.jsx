import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { User, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';

export default function BalanceCard({ balance }) {
  const isPositive = balance.netBalance > 0.01;
  const isNegative = balance.netBalance < -0.01;

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div className="card-header-flex" style={{ marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="user-avatar" style={{ width: '38px', height: '38px', fontSize: '0.85rem' }}>
            {(balance.name || 'U').substring(0, 2).toUpperCase()}
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{balance.name}</span>
        </div>

        <span 
          style={{ 
            fontWeight: 700, 
            fontSize: '1.1rem',
            color: isPositive ? 'var(--accent-success)' : isNegative ? 'var(--accent-danger)' : 'var(--text-muted)'
          }}
        >
          {isPositive ? `+${formatCurrency(balance.netBalance)}` : isNegative ? `-${formatCurrency(Math.abs(balance.netBalance))}` : 'Settled'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', backgroundColor: 'var(--bg-app)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Total Paid</span>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>{formatCurrency(balance.paid)}</p>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Share Owed</span>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>{formatCurrency(balance.share)}</p>
        </div>
      </div>
    </div>
  );
}
