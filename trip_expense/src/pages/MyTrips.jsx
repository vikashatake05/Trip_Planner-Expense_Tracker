import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import TripCard from '../components/trips/TripCard';
import Toast from '../components/common/Toast';
import { getCurrentUser } from '../services/authService';
import { getAllTrips, deleteTrip } from '../services/tripService';
import { getExpensesByTripId } from '../services/expenseService';
import { calculateTotalExpenses, getTripStatus } from '../utils/tripCalculations';
import { Map, Plus, Users, Compass } from 'lucide-react';

export default function MyTrips() {
  const [activeTab, setActiveTab] = useState('All');
  const [allTrips, setAllTrips] = useState([]);
  const [tripExpensesMap, setTripExpensesMap] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrips() {
      const user = getCurrentUser();
      setCurrentUser(user);

      const trips = await getAllTrips();
      setAllTrips(trips);

      const expMap = {};
      for (const t of trips) {
        expMap[t.id] = await getExpensesByTripId(t.id);
      }
      setTripExpensesMap(expMap);
      setLoading(false);
    }
    loadTrips();
  }, []);

  const handleDeleteTrip = async (tripId, tripName) => {
    if (window.confirm(`Are you sure you want to delete "${tripName}"? All associated expenses and itinerary items will also be permanently removed.`)) {
      await deleteTrip(tripId);
      setAllTrips(prev => prev.filter(t => t.id !== tripId));
      setToastMessage(`Trip "${tripName}" deleted successfully.`);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <p style={{ fontWeight: 600 }}>Loading trips...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Filter user created vs joined trips
  const createdTrips = allTrips.filter((t) => {
    if (!currentUser) return true;
    const isOwnerIdMatch = t.ownerId && String(t.ownerId) === String(currentUser.id);
    const isCreatedByMatch = t.createdBy && (
      t.createdBy.toLowerCase() === currentUser.name?.toLowerCase() ||
      currentUser.name?.toLowerCase().includes(t.createdBy.toLowerCase()) ||
      t.createdBy.toLowerCase().includes(currentUser.name?.toLowerCase())
    );
    const isMemberOwner = Array.isArray(t.members) && t.members.some(m => 
      (m.userId === currentUser.id || m.id === currentUser.id) && m.role === 'OWNER'
    );
    return isOwnerIdMatch || isCreatedByMatch || isMemberOwner;
  });

  const joinedTrips = allTrips.filter((t) => !createdTrips.some(ct => ct.id === t.id));

  // Tab filtering logic
  const filterByTab = (tripsList) => {
    if (activeTab === 'All') return tripsList;
    return tripsList.filter((t) => {
      const statusKey = getTripStatus(t.startDate, t.endDate).statusKey;
      if (activeTab === 'Upcoming') return statusKey === 'upcoming';
      if (activeTab === 'Active') return statusKey === 'in_progress';
      if (activeTab === 'Completed') return statusKey === 'completed';
      return true;
    });
  };

  const filteredCreated = filterByTab(createdTrips);
  const filteredJoined = filterByTab(joinedTrips);

  return (
    <DashboardLayout>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">My Trips</h1>
          <p className="page-subtitle">Manage all your personal and group travel plans</p>
        </div>

        <Link to="/trips/new" className="btn-primary" style={{ width: 'auto' }}>
          <Plus size={18} />
          <span>New Trip</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="segmented-control" style={{ maxWidth: '500px', marginBottom: '2rem' }}>
        {['All', 'Upcoming', 'Active', 'Completed'].map((tab) => (
          <button
            key={tab}
            className={`segment-option ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Created Trips Section */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Map size={18} style={{ color: 'var(--primary)' }} />
          <span>Trips You Created ({filteredCreated.length})</span>
        </h2>

        {filteredCreated.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <Compass size={36} style={{ color: 'var(--text-subtle)', margin: '0 auto 0.75rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>No trips found in this view.</p>
            <Link to="/trips/new" className="btn-primary" style={{ display: 'inline-flex', width: 'auto', marginTop: '1rem' }}>
              Create a Trip
            </Link>
          </div>
        ) : (
          <div className="grid-cols-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {filteredCreated.map((trip) => (
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

      {/* Trips You've Joined Section */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={18} style={{ color: 'var(--primary)' }} />
          <span>Trips You've Joined ({filteredJoined.length})</span>
        </h2>

        {filteredJoined.length === 0 ? (
          <div className="card" style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            You haven't accepted any group trip invitations yet.
          </div>
        ) : (
          <div className="grid-cols-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {filteredJoined.map((trip) => (
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

      <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />
    </DashboardLayout>
  );
}
