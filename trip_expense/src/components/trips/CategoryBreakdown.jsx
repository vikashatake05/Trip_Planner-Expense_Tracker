import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { calculateCategoryBreakdown } from '../../utils/tripCalculations';
import { PieChart as PieChartIcon } from 'lucide-react';

export default function CategoryBreakdown({ expenses = [] }) {
  const breakdownData = calculateCategoryBreakdown(expenses);

  // Custom tooltip formatter for Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '0.5rem 0.85rem',
          borderRadius: '8px',
          fontSize: '0.85rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <p style={{ fontWeight: 600, margin: 0 }}>{data.name}</p>
          <p style={{ margin: 0, color: '#94A3B8' }}>
            {formatCurrency(data.value)} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="card-header-flex" style={{ marginBottom: '0.5rem' }}>
        <h2 className="card-title">
          <PieChartIcon size={20} style={{ color: 'var(--primary)' }} />
          <span>Category Breakdown</span>
        </h2>
      </div>

      <div className="chart-container">
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdownData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
              >
                {breakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="category-list">
          {breakdownData.map((item) => (
            <div key={item.name} className="category-item">
              <div className="cat-left">
                <span className="cat-color-dot" style={{ backgroundColor: item.color }} />
                <span className="cat-name">{item.name}</span>
              </div>
              <div className="cat-right">
                <span className="cat-amount">{formatCurrency(item.value)}</span>
                <span className="cat-percent">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
