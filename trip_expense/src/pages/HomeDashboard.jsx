import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import TripCard from '../components/trips/TripCard';
import SummaryCard from '../components/trips/SummaryCard';
import Toast from '../components/common/Toast';
import { getCurrentUser } from '../services/authService';
import { getUserTrips, deleteTrip } from '../services/tripService';
import { getExpensesByTripId } from '../services/expenseService';
import { formatCurrency, formatShortDate } from '../utils/formatters';
import { calculateTotalExpenses, getTripStatus } from '../utils/tripCalculations';
import { getItem, STORAGE_KEYS } from '../services/storage';
import { 
  Map, 
  Calendar, 
  CreditCard, 
  Plus, 
  Activity, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function HomeDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [tripExpensesMap, setTripExpensesMap] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const user = getCurrentUser();
      setCurrentUser(user);

      if (user) {
        const trips = await getUserTrips(user.id, user.email);
        setUserTrips(trips);

        const expMap = {};
        for (const t of trips) {
          expMap[t.id] = await getExpensesByTripId(t.id);
        }
        setTripExpensesMap(expMap);

        const notifs = getItem(STORAGE_KEYS.NOTIFICATIONS, []);
        setNotifications(notifs);
      }
      setLoading(false);
    }

    loadData();
  }, []);

  const handleDeleteTrip = async (tripId, tripName) => {
    if (window.confirm(`Are you sure you want to delete "${tripName}"? All associated expenses and itinerary items will also be permanently removed.`)) {
      await deleteTrip(tripId);
      setUserTrips(prev => prev.filter(t => t.id !== tripId));
      setToastMessage(`Trip "${tripName}" deleted successfully.`);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <p style={{ fontWeight: 600 }}>Loading dashboard summary...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate metrics
  let totalSpentSum = 0;
  let activeCount = 0;
  let upcomingCount = 0;

  userTrips.forEach((t) => {
    const exps = tripExpensesMap[t.id] || [];
    totalSpentSum += calculateTotalExpenses(exps);

    const status = getTripStatus(t.startDate, t.endDate).statusKey;
    if (status === 'in_progress') activeCount++;
    if (status === 'upcoming') upcomingCount++;
  });

  return (
    <DashboardLayout>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Good morning, {currentUser?.name || 'Traveler'}</h1>
          <p className="page-subtitle">Here's what's happening with your trips.</p>
        </div>

        <Link to="/trips/new" className="btn-primary" style={{ width: 'auto' }}>
          <Plus size={18} />
          <span>Create New Trip</span>
        </Link>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <SummaryCard
          title="Active Trips"
          value={activeCount}
          icon={Sparkles}
          color="#10B981"
          bg="#ECFDF5"
        />
        <SummaryCard
          title="Upcoming Trips"
          value={upcomingCount}
          icon={Calendar}
          color="#2563EB"
          bg="#EFF6FF"
        />
        <SummaryCard
          title="Total Trips"
          value={userTrips.length}
          icon={Map}
          color="#8B5CF6"
          bg="#F3E8FF"
        />
        <SummaryCard
          title="Total Spent"
          value={formatCurrency(totalSpentSum)}
          icon={CreditCard}
          color="#F59E0B"
          bg="#FEF3C7"
        />
      </div>

      {/* Main Grid Section */}
      <div className="dashboard-main-grid">
        {/* Left Column - Active & Upcoming Trips */}
        <div>
          <div className="card-header-flex" style={{ marginBottom: '1rem' }}>
            <h2 className="card-title">
              <Map size={20} style={{ color: 'var(--primary)' }} />
              <span>Your Active & Upcoming Trips</span>
            </h2>
            <Link to="/trips" className="view-all-link" style={{ marginTop: 0 }}>
              View All ({userTrips.length})
            </Link>
          </div>

          {userTrips.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>You don't have any active trips yet.</p>
              <Link to="/trips/new" className="btn-primary" style={{ display: 'inline-flex', width: 'auto' }}>
                Create Your First Trip
              </Link>
            </div>
          ) : (
            <div className="grid-cols-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {userTrips.slice(0, 2).map((trip) => (
                <TripCard 
                  key={trip.id} 
                  trip={trip} 
                  spent={calculateTotalExpenses(tripExpensesMap[trip.id] || [])}
                  onDelete={handleDeleteTrip}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Recent Activity Stream */}
        <div>
          <div className="card">
            <div className="card-header-flex" style={{ marginBottom: '1rem' }}>
              <h2 className="card-title">
                <Activity size={20} style={{ color: 'var(--primary)' }} />
                <span>Recent Activity</span>
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {notifications.slice(0, 4).map((notif) => (
                <div key={notif.id} className="expense-item" style={{ padding: '0.75rem 0.85rem' }}>
                  <div className="expense-details">
                    <span className="expense-title" style={{ fontSize: '0.9rem' }}>{notif.title}</span>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.15rem 0' }}>
                      {notif.description}
                    </p>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                      {formatShortDate(notif.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/notifications" className="view-all-link">
              <span>View All Activity</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />
    </DashboardLayout>
  );
}
