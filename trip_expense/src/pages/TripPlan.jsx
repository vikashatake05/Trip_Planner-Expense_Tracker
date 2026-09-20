import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import ActivityCard from '../components/itinerary/ActivityCard';
import ActivityFormModal from '../components/itinerary/ActivityFormModal';
import { getTripById } from '../services/tripService';
import { getItineraryByTripId, addActivity, updateActivity, deleteActivity } from '../services/itineraryService';
import { formatShortDate, formatCurrency } from '../utils/formatters';
import { Calendar, Plus, MapPin, Clock } from 'lucide-react';

export default function TripPlan() {
  const { tripId } = useParams();
  const currentId = tripId;

  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlanData() {
      const [tData, planData] = await Promise.all([
        getTripById(currentId),
        getItineraryByTripId(currentId)
      ]);
      setTrip(tData);
      setItinerary(planData);
      setLoading(false);
    }
    loadPlanData();
  }, [currentId]);

  const handleAddActivity = async (activityPayload) => {
    const saved = activityPayload.id
      ? await updateActivity(activityPayload.id, activityPayload)
      : await addActivity(currentId, activityPayload);
    setItinerary(prev => activityPayload.id
      ? prev.map(item => item.id === saved.id ? saved : item)
      : [...prev, saved]
    );
    setEditingActivity(null);
  };

  const openAddActivity = (date = null) => {
    setEditingActivity(null);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const openEditActivity = (activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleDeleteActivity = async (actId) => {
    if (window.confirm('Delete this activity from trip plan?')) {
      await deleteActivity(actId);
      setItinerary(prev => prev.filter(a => a.id !== actId));
    }
  };

  if (loading) {
    return (
      <DashboardLayout currentTripId={currentId}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <p style={{ fontWeight: 600 }}>Loading itinerary...</p>
        </div>
      </DashboardLayout>
    );
  }

  const tripDates = [];
  const start = new Date(`${trip?.startDate}T00:00:00`);
  const end = new Date(`${trip?.endDate}T00:00:00`);
  if (trip?.startDate && trip?.endDate && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start <= end) {
    for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      tripDates.push(date.toISOString().split('T')[0]);
    }
  }

  // Group activities by every date in the trip, including empty days.
  const groupedByDate = {};
  tripDates.forEach(date => { groupedByDate[date] = []; });
  itinerary.forEach((act) => {
    const d = act.date;
    if (!groupedByDate[d]) groupedByDate[d] = [];
    groupedByDate[d].push(act);
  });

  const datesList = Object.keys(groupedByDate).sort();

  return (
    <DashboardLayout currentTripId={currentId}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Trip Plan & Itinerary</h1>
          <p className="page-subtitle">Schedule activities and daily plans for {trip?.name}</p>
        </div>

        <button className="btn-primary" style={{ width: 'auto' }} onClick={openAddActivity}>
          <Plus size={18} />
          <span>Add Activity</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {!trip?.startDate || !trip?.endDate || tripDates.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
            <Calendar size={40} style={{ color: 'var(--text-subtle)', margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Trip dates are required</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Add a start date and end date to this trip before creating an itinerary.
            </p>
          </div>
        ) : (
          datesList.map((dStr, idx) => {
            const dayActivities = groupedByDate[dStr];
            const dayTotalCost = dayActivities.reduce((acc, a) => acc + (Number(a.estimatedCost) || 0), 0);

            return (
              <div key={dStr} className="card">
                <div className="card-header-flex" style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 800, 
                      backgroundColor: 'var(--primary)', 
                      color: '#FFFFFF', 
                      padding: '0.3rem 0.8rem', 
                      borderRadius: 'var(--radius-sm)' 
                    }}>
                      DAY {idx + 1}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                      {formatShortDate(dStr)}
                    </h3>
                    <button className="btn-secondary" style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8rem' }} onClick={() => openAddActivity(dStr)}>
                      <Plus size={14} />
                      <span>Add Activity</span>
                    </button>
                  </div>

                  {dayTotalCost > 0 && (
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      Est. Spending: <strong style={{ color: 'var(--text-main)' }}>{formatCurrency(dayTotalCost)}</strong>
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {dayActivities.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No activities planned for this day.</p>
                  ) : [...dayActivities].sort((a, b) => (a.startTime || '99:99').localeCompare(b.startTime || '99:99')).map((act) => (
                    <ActivityCard 
                      key={act.id} 
                      activity={act} 
                      onEdit={openEditActivity}
                      onDelete={handleDeleteActivity} 
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      <ActivityFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddActivity}
        tripDates={{ startDate: trip?.startDate, endDate: trip?.endDate, initialDate: selectedDate }}
        activity={editingActivity}
      />
    </DashboardLayout>
  );
}
