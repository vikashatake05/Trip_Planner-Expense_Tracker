import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatShortDate } from '../../utils/formatters';
import { Hotel, Utensils, Bus, Ticket, ShoppingBag, Edit, Trash2, Users } from 'lucide-react';

const CATEGORY_ICONS = {
  'Accommodation': Hotel,
  'Food': Utensils,
  'Transport': Bus,
  'Activities': Ticket,
  'Others': ShoppingBag
};

const CATEGORY_LABELS = {
  accommodation: 'Accommodation',
  food: 'Food',
  transport: 'Transport',
  activities: 'Activities',
  shopping: 'Others',
  other: 'Others',
  others: 'Others'
};

export default function ExpenseCard({ expense, tripId, onDelete }) {
  const category = CATEGORY_LABELS[String(expense.category || '').toLowerCase()] || 'Others';
  const Icon = CATEGORY_ICONS[category] || ShoppingBag;
  const splitCount = expense.splitBetween ? expense.splitBetween.length : 1;

  return (
    <div className="expense-item" style={{ padding: '1rem 1.25rem' }}>
      <div className="expense-left">
        <div className="expense-cat-icon" style={{ width: '44px', height: '44px' }}>
          <Icon size={22} />
        </div>

        <div className="expense-details">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="expense-title" style={{ fontSize: '1rem' }}>{expense.title}</span>
            <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-light)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: 500, color: 'var(--text-muted)' }}>
              {category}
            </span>
          </div>

          <div className="expense-meta" style={{ marginTop: '0.2rem', gap: '0.75rem' }}>
            <span>Paid by <strong>{expense.paidBy}</strong></span>
            <span>•</span>
            <span>{formatShortDate(expense.date)}</span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Users size={12} />
              Split ({splitCount})
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span className="expense-amount" style={{ fontSize: '1.15rem' }}>
          {formatCurrency(expense.amount)}
        </span>

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <Link 
            to={`/trips/${tripId}/expenses/${expense.id}/edit`} 
            className="icon-btn" 
            style={{ width: '34px', height: '34px' }}
            title="Edit Expense"
          >
            <Edit size={15} />
          </Link>

          {onDelete && (
            <button 
              className="btn-icon-danger" 
              style={{ width: '34px', height: '34px' }}
              onClick={() => onDelete(expense.id)}
              title="Delete Expense"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
