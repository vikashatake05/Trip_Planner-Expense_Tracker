import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import BudgetOverview from '../components/trips/BudgetOverview';
import SummaryCard from '../components/trips/SummaryCard';
import CategoryBreakdown from '../components/trips/CategoryBreakdown';
import RecentExpenses from '../components/trips/RecentExpenses';
import QuickActions from '../components/trips/QuickActions';

import { getTripById, deleteTrip } from '../services/tripService';
import { getExpensesByTripId as getTripExpenses } from '../services/expenseService';
import { formatDateRange, formatCurrency } from '../utils/formatters';
import { 
  calculateTotalExpenses, 
  calculateDailyAverage, 
  calculatePerPersonExpense, 
  getTripStatus 
} from '../utils/tripCalculations';

import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  UserCheck, 
  Settings, 
  Calendar, 
  IndianRupee,
  Plus,
  Trash2
} from 'lucide-react';

export default function TripDashboard() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const currentId = tripId;

  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [tripData, expData] = await Promise.all([
          getTripById(currentId),
          getTripExpenses(currentId)
        ]);

        if (isMounted) {
          setTrip(tripData);
          setExpenses(expData);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [currentId]);

  const handleDeleteTrip = async () => {
    const tripName = trip?.name || `${trip?.destination} Trip`;
    if (window.confirm(`Are you sure you want to delete "${tripName}"? All associated expenses and itinerary items will also be permanently deleted.`)) {
      await deleteTrip(trip.id);
      navigate('/trips');
    }
  };

  if (loading) {
    return (
      <DashboardLayout currentTripId={currentId}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <p style={{ fontWeight: 600 }}>Loading trip dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!trip) {
    return (
      <DashboardLayout currentTripId={currentId}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2>Trip Not Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
            We couldn't locate the requested trip details.
          </p>
          <Link to="/trips/new" className="btn-primary" style={{ display: 'inline-flex', width: 'auto' }}>
            Create New Trip
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate dynamic stats
  const totalSpent = calculateTotalExpenses(expenses);
  const dailyAverage = calculateDailyAverage(totalSpent, trip.numberOfDays);
  const perPerson = calculatePerPersonExpense(totalSpent, trip.numberOfTravelers);
  const statusInfo = getTripStatus(trip.startDate, trip.endDate);

  return (
    <DashboardLayout currentTripId={trip.id}>
      
      {/* Top Header Card */}
      <div className="dashboard-header-card">
        <div className="trip-meta-group">
          <div className="trip-title-row">
            <h1 className="trip-main-title">{trip.name || `${trip.destination} Trip`}</h1>
            <span className={`status-badge ${statusInfo.statusKey}`}>
              <span className="status-dot" />
              {statusInfo.label}
            </span>
          </div>

          <div className="trip-details-sub">
            <span>
              <Calendar size={15} />
              {formatDateRange(trip.startDate, trip.endDate)}
            </span>
            <span className="meta-dot">•</span>
            <span>
              <Users size={15} />
              {trip.numberOfTravelers} {trip.numberOfTravelers === 1 ? 'person' : 'people'}
            </span>
            <span className="meta-dot">•</span>
            <span>
              <IndianRupee size={15} />
              {formatCurrency(trip.budget)} budget
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            className="icon-btn" 
            title="Trip Settings"
            aria-label="Trip Settings"
          >
            <Settings size={18} />
          </button>
          
          <button 
            className="btn-icon-danger"
            style={{ width: '40px', height: '40px' }}
            onClick={handleDeleteTrip}
            title="Delete Trip"
            aria-label="Delete Trip"
          >
            <Trash2 size={18} />
          </button>

          <Link to="/trips/new" className="btn-secondary">
            <Plus size={16} />
            <span>New Trip</span>
          </Link>
        </div>
      </div>

      {/* 4 Summary Cards Grid */}
      <div className="grid-cols-4" style={{ marginBottom: '1.5rem' }}>
        <SummaryCard 
          title="People"
          value={trip.numberOfTravelers}
          icon={Users}
          color="#2563EB"
          bg="#EFF6FF"
        />
        <SummaryCard 
          title="Total Spent"
          value={formatCurrency(totalSpent)}
          icon={CreditCard}
          color="#10B981"
          bg="#ECFDF5"
        />
        <SummaryCard 
          title="Daily Average"
          value={formatCurrency(dailyAverage)}
          icon={TrendingUp}
          color="#F59E0B"
          bg="#FEF3C7"
        />
        <SummaryCard 
          title="Per Person"
          value={formatCurrency(perPerson)}
          icon={UserCheck}
          color="#8B5CF6"
          bg="#F3E8FF"
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-main-grid">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <BudgetOverview 
            budget={trip.budget}
            spent={totalSpent}
          />

          <RecentExpenses 
            expenses={expenses}
            tripId={trip.id}
          />
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <CategoryBreakdown 
            expenses={expenses}
          />

          <QuickActions 
            tripId={trip.id}
          />
        </div>
      </div>

    </DashboardLayout>
  );
}
