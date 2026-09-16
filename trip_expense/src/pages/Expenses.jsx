import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import ExpenseCard from '../components/expenses/ExpenseCard';
import ExpenseFilters from '../components/expenses/ExpenseFilters';
import { getTripById } from '../services/tripService';
import { getExpensesByTripId, deleteExpense } from '../services/expenseService';
import { formatCurrency } from '../utils/formatters';
import { calculateTotalExpenses } from '../utils/tripCalculations';
import { Plus, CreditCard } from 'lucide-react';

export default function Expenses() {
  const { tripId } = useParams();
  const currentId = tripId || 'goa-trip-2026';

  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [tData, expData] = await Promise.all([
        getTripById(currentId),
        getExpensesByTripId(currentId)
      ]);
      setTrip(tData);
      setExpenses(expData);
      setLoading(false);
    }
    loadData();
  }, [currentId]);

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(expenseId);
      setExpenses(prev => prev.filter(e => e.id !== expenseId));
    }
  };

  if (loading) {
    return (
      <DashboardLayout currentTripId={currentId}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <p style={{ fontWeight: 600 }}>Loading trip expenses...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Filter & sort logic
  let filtered = expenses.filter((e) => {
    if (categoryFilter !== 'All' && e.category !== categoryFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = (e.title || '').toLowerCase().includes(q);
      const matchPayer = (e.paidBy || '').toLowerCase().includes(q);
      return matchTitle || matchPayer;
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'highest') return b.amount - a.amount;
    if (sortBy === 'lowest') return a.amount - b.amount;
    return 0;
  });

  const totalSpent = calculateTotalExpenses(expenses);

  return (
    <DashboardLayout currentTripId={currentId}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Trip Expenses</h1>
          <p className="page-subtitle">
            {trip?.name || 'Trip'} • Total Spent: <strong style={{ color: 'var(--primary)' }}>{formatCurrency(totalSpent)}</strong>
          </p>
        </div>

        <Link to={`/trips/${currentId}/expenses/new`} className="btn-primary" style={{ width: 'auto' }}>
          <Plus size={18} />
          <span>Add Expense</span>
        </Link>
      </div>

      <ExpenseFilters
        selectedCategory={categoryFilter}
        onCategoryChange={setCategoryFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className="card">
        <div className="expense-list">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
              <CreditCard size={36} style={{ color: 'var(--text-subtle)', margin: '0 auto 0.75rem' }} />
              <p>No expenses found matching your criteria.</p>
              <Link to={`/trips/${currentId}/expenses/new`} className="btn-primary" style={{ display: 'inline-flex', width: 'auto', marginTop: '1rem' }}>
                Add First Expense
              </Link>
            </div>
          ) : (
            filtered.map((exp) => (
              <ExpenseCard 
                key={exp.id} 
                expense={exp} 
                tripId={currentId} 
                onDelete={handleDeleteExpense} 
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
