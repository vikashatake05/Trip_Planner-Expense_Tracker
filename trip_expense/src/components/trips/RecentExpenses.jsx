import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatShortDate } from '../../utils/formatters';
import { 
  Hotel, 
  Utensils, 
  Bus, 
  Ticket, 
  ShoppingBag, 
  ArrowRight,
  Receipt
} from 'lucide-react';

const CATEGORY_ICONS = {
  'Accommodation': Hotel,
  'Food': Utensils,
  'Transport': Bus,
  'Activities': Ticket,
  'Others': ShoppingBag
};

export default function RecentExpenses({ expenses = [], tripId }) {
  const recentList = expenses.slice(0, 4);

  return (
    <div className="card">
      <div className="card-header-flex">
        <h2 className="card-title">
          <Receipt size={20} style={{ color: 'var(--primary)' }} />
          <span>Recent Expenses</span>
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {expenses.length} total
        </span>
      </div>

      <div className="expense-list">
        {recentList.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem' }}>
            No expenses recorded yet.
          </p>
        ) : (
          recentList.map((exp) => {
            const Icon = CATEGORY_ICONS[exp.category] || ShoppingBag;
            return (
              <div key={exp.id} className="expense-item">
                <div className="expense-left">
                  <div className="expense-cat-icon">
                    <Icon size={20} />
                  </div>
                  <div className="expense-details">
                    <span className="expense-title">{exp.title}</span>
                    <span className="expense-meta">
                      <span>Paid by {exp.paidBy}</span>
                      <span>•</span>
                      <span>{formatShortDate(exp.date)}</span>
                    </span>
                  </div>
                </div>
                <span className="expense-amount">{formatCurrency(exp.amount)}</span>
              </div>
            );
          })
        )}
      </div>

      <Link to={`/trips/${tripId}/expenses`} className="view-all-link">
        <span>View All Expenses</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
