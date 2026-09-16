import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export default function ExpenseFilters({ 
  selectedCategory, 
  onCategoryChange, 
  searchTerm, 
  onSearchChange,
  sortBy,
  onSortChange 
}) {
  const categories = ['All', 'Accommodation', 'Food', 'Transport', 'Activities', 'Others'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
      {/* Search & Sort Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="header-search" style={{ flex: 1, minWidth: '240px' }}>
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search expenses by title, payer..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowUpDown size={16} style={{ color: 'var(--text-muted)' }} />
          <select 
            className="form-input" 
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value)}
            style={{ width: 'auto', padding: '0.55rem 1rem' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              className={`segment-option ${isActive ? 'active' : ''}`}
              style={{
                flex: 'none',
                padding: '0.45rem 0.9rem',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-surface)',
                color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                border: '1px solid var(--border-light)'
              }}
              onClick={() => onCategoryChange(cat)}
            >
              {cat === 'Accommodation' ? 'Stay' : cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
