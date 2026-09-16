import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { 
  calculateRemainingBudget, 
  calculateBudgetPercentage 
} from '../../utils/tripCalculations';
import { Wallet, AlertTriangle } from 'lucide-react';

export default function BudgetOverview({ budget = 0, spent = 0 }) {
  const remaining = calculateRemainingBudget(budget, spent);
  const percentage = calculateBudgetPercentage(budget, spent);
  const isOverBudget = spent > budget;

  return (
    <div className="budget-overview-card">
      <div className="card-header-flex">
        <h2 className="card-title">
          <Wallet size={20} className="icon" style={{ color: 'var(--primary)' }} />
          <span>Budget Overview</span>
        </h2>
        <span className="stat-label" style={{ fontWeight: 600 }}>
          {percentage}% Used
        </span>
      </div>

      <div className="budget-stats-grid">
        <div className="budget-stat-item">
          <span className="stat-label">Total Budget</span>
          <span className="stat-val-huge">{formatCurrency(budget)}</span>
        </div>

        <div className="budget-stat-item">
          <span className="stat-label">Spent</span>
          <span className="stat-val-huge spent">{formatCurrency(spent)}</span>
        </div>

        <div className="budget-stat-item">
          <span className="stat-label">Remaining</span>
          <span className={`stat-val-huge ${isOverBudget ? 'overbudget' : 'remaining'}`}>
            {formatCurrency(remaining)}
          </span>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-header">
          <span>Budget Utilization</span>
          <span>{percentage}%</span>
        </div>
        <div className="progress-track">
          <div 
            className={`progress-fill ${isOverBudget ? 'warning' : ''}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {isOverBudget && (
        <div className="budget-warning-banner">
          <AlertTriangle size={18} />
          <span>
            You have exceeded your total budget by {formatCurrency(spent - budget)}!
          </span>
        </div>
      )}
    </div>
  );
}
