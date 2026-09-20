import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getTripById } from '../services/tripService';
import { getExpensesByTripId } from '../services/expenseService';
import { formatCurrency } from '../utils/formatters';
import { PieChart, Users, ArrowRight } from 'lucide-react';

export default function SplitExpense() {
  const { tripId } = useParams();
  const currentId = tripId;

  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!currentId) {
        setLoading(false);
        return;
      }

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

  if (!currentId) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2>Trip not selected</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
            Open a trip from My Trips to view its expenses.
          </p>
          <Link to="/trips" className="btn-primary" style={{ display: 'inline-flex', width: 'auto' }}>
            Open My Trips
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout currentTripId={currentId}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <p style={{ fontWeight: 600 }}>Loading split details...</p>
        </div>
      </DashboardLayout>
    );
  }

  const members = trip?.members || [];

  return (
    <DashboardLayout currentTripId={currentId}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Split Expenses</h1>
          <p className="page-subtitle">View detailed breakdown of shared expenses for {trip?.name}</p>
        </div>

        <Link to={`/trips/${currentId}/settlement`} className="btn-primary" style={{ width: 'auto' }}>
          <span>View Final Settlement</span>
          <ArrowRight size={18} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {expenses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No shared expenses recorded yet.</p>
          </div>
        ) : (
          expenses.map((exp) => {
            const splitCount = exp.splitBetween ? exp.splitBetween.length : members.length;
            const perPerson = Number((exp.amount / Math.max(1, splitCount)).toFixed(2));

            return (
              <div key={exp.id} className="card" style={{ padding: '1.5rem' }}>
                <div className="card-header-flex" style={{ marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>{exp.title}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Paid by <strong style={{ color: 'var(--text-main)' }}>{exp.paidBy}</strong> • Category: {exp.category}
                    </span>
                  </div>

                  <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {formatCurrency(exp.amount)}
                  </span>
                </div>

                <div style={{ backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={14} />
                    <span>Split Shares ({exp.splitMethod || 'EQUAL'})</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    {members.map((m) => {
                      const mId = m.userId || m.id || m.name;
                      const isIncluded = exp.splitBetween ? exp.splitBetween.includes(mId) : true;
                      const shareVal = exp.splitShares && exp.splitShares[mId] !== undefined 
                        ? exp.splitShares[mId] 
                        : isIncluded ? perPerson : 0;

                      return (
                        <div key={mId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.4rem 0.6rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                          <span style={{ fontWeight: 500 }}>{m.name}</span>
                          <span style={{ fontWeight: 700, color: isIncluded ? 'var(--text-main)' : 'var(--text-subtle)' }}>
                            {isIncluded ? formatCurrency(shareVal) : '₹0 (Excluded)'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
