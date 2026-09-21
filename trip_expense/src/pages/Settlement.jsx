import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import BalanceCard from '../components/split/BalanceCard';
import SettlementList from '../components/split/SettlementList';
import Toast from '../components/common/Toast';
import { getTripById } from '../services/tripService';
import { getExpensesByTripId } from '../services/expenseService';
import { getSettlement } from '../services/settlementService';
import { getCurrentUser } from '../services/authService';
import { formatCurrency } from '../utils/formatters';
import { calculateTotalExpenses } from '../utils/tripCalculations';
import { PieChart, ShieldCheck } from 'lucide-react';

export default function Settlement() {
  const { tripId } = useParams();
  const currentId = tripId;

  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [settlementData, setSettlementData] = useState({ balances: [], settlements: [] });
  const [currentUser, setCurrentUser] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const user = getCurrentUser();
        setCurrentUser(user);

        const [tData, expData, settlementResult] = await Promise.all([
          getTripById(currentId),
          getExpensesByTripId(currentId),
          getSettlement(currentId)
        ]);
        setTrip(tData);
        setExpenses(expData);
        setSettlementData(settlementResult);
      } catch (error) {
        setLoadError('Unable to calculate settlements right now. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentId]);

  if (loading) {
    return (
      <DashboardLayout currentTripId={currentId}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <p style={{ fontWeight: 600 }}>Calculating settlements...</p>
        </div>
      </DashboardLayout>
    );
  }

  const members = trip?.members || [];
  const { balances, settlements } = settlementData;
  const grandTotal = calculateTotalExpenses(expenses);

  // Current logged in user balance item
  const myBalance = balances.find(b => b.memberId === currentUser?.id || b.name === currentUser?.name) || balances[0] || { paid: 0, share: 0, netBalance: 0 };

  return (
    <DashboardLayout currentTripId={currentId}>
      <div className="page-header">
        <h1 className="page-title">Trip Settlement</h1>
        <p className="page-subtitle">Debt minimization analysis for {trip?.name}</p>
      </div>

      {/* Your Financial Overview Summary Card */}
      <div className="budget-overview-card" style={{ marginBottom: '2rem' }}>
        <div className="card-header-flex">
          <h2 className="card-title">
            <PieChart size={20} style={{ color: 'var(--primary)' }} />
            <span>Your Personal Balance Overview</span>
          </h2>
          <span className="status-badge in_progress">
            <ShieldCheck size={14} />
            Calculated
          </span>
        </div>

        <div className="budget-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="budget-stat-item">
            <span className="stat-label">Total Trip Expense</span>
            <span className="stat-val-huge">{formatCurrency(grandTotal)}</span>
          </div>

          <div className="budget-stat-item">
            <span className="stat-label">You Paid</span>
            <span className="stat-val-huge spent">{formatCurrency(myBalance.paid)}</span>
          </div>

          <div className="budget-stat-item">
            <span className="stat-label">Your Share Owed</span>
            <span className="stat-val-huge">{formatCurrency(myBalance.share)}</span>
          </div>

          <div className="budget-stat-item">
            <span className="stat-label">Your Net Balance</span>
            <span className={`stat-val-huge ${myBalance.netBalance >= 0 ? 'remaining' : 'overbudget'}`}>
              {myBalance.netBalance >= 0 ? `+${formatCurrency(myBalance.netBalance)}` : `-${formatCurrency(Math.abs(myBalance.netBalance))}`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Member Balances vs Who Owes Whom */}
      <div className="dashboard-main-grid">
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
            All Member Net Balances ({balances.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {balances.map((bal) => (
              <BalanceCard key={bal.memberId} balance={bal} />
            ))}
          </div>
        </div>

        <div>
          <SettlementList settlements={settlements} />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
            All balances will be settled once everyone has completed their payments.
          </p>
        </div>
      </div>
      <Toast message={loadError} type="error" onClose={() => setLoadError('')} duration={6000} />
    </DashboardLayout>
  );
}
