import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import TripTypeSelector from '../components/trips/TripTypeSelector';
import MemberInput from '../components/trips/MemberInput';
import { saveTrip } from '../services/tripService';
import { getCurrentUser } from '../services/authService';
import { MapPin, Calendar, IndianRupee, ArrowRight, Minus, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

const getTodayString = () => new Date().toISOString().split('T')[0];

export default function CreateTrip() {
  const navigate = useNavigate();

  const user = getCurrentUser();

  // Form State
  const [destination, setDestination] = useState('Goa');
  const [numberOfDays, setNumberOfDays] = useState(5);
  const [startDate, setStartDate] = useState(() => getTodayString());
  const [endDate, setEndDate] = useState(() => {
    const end = new Date();
    end.setDate(end.getDate() + 4);
    return end.toISOString().split('T')[0];
  });
  const [tripType, setTripType] = useState('Group');
  const [budget, setBudget] = useState('20000');
  const [numberOfTravelers, setNumberOfTravelers] = useState(3);
  const [members, setMembers] = useState([
    { id: user?.id || 'usr_101', name: user?.name || 'Vikas S', email: user?.email || 'vikas@example.com' },
    { id: '2', name: 'Rahul', email: 'rahul@example.com' },
    { id: '3', name: 'Arjun', email: 'arjun@example.com' }
  ]);

  // Validation & UI State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Sync Start/End Dates with Number of Days
  useEffect(() => {
    if (startDate && numberOfDays > 0) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) {
        const calculatedEnd = new Date(start);
        calculatedEnd.setDate(calculatedEnd.getDate() + (numberOfDays - 1));
        const endStr = calculatedEnd.toISOString().split('T')[0];
        setEndDate(endStr);
      }
    }
  }, [startDate, numberOfDays]);

  // When dates are manually picked, recalculate Number of Days
  const handleStartDateChange = (val) => {
    setStartDate(val);
    if (val && endDate) {
      const start = new Date(val);
      const end = new Date(endDate);
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setNumberOfDays(diffDays);
      }
    }
  };

  const handleEndDateChange = (val) => {
    setEndDate(val);
    if (startDate && val) {
      const start = new Date(startDate);
      const end = new Date(val);
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setNumberOfDays(diffDays);
      }
    }
  };

  // Stepper handlers
  const handleDaysChange = (delta) => {
    const newDays = Math.max(1, numberOfDays + delta);
    setNumberOfDays(newDays);
  };

  const handleTravelersChange = (delta) => {
    if (tripType === 'Solo') return;
    const newCount = Math.max(1, numberOfTravelers + delta);
    setNumberOfTravelers(newCount);
    
    // Adjust members list length to match travelers count if needed
    if (newCount > members.length) {
      const diff = newCount - members.length;
      const added = Array.from({ length: diff }, (_, i) => ({
        id: String(Date.now() + i),
        name: '',
        email: ''
      }));
      setMembers(prev => [...prev, ...added]);
    } else if (newCount < members.length && newCount >= 1) {
      setMembers(prev => prev.slice(0, newCount));
    }
  };

  // Trip Type Selector change handler
  const handleTripTypeChange = (type) => {
    setTripType(type);
    if (type === 'Solo') {
      setNumberOfTravelers(1);
      setMembers([{ id: user?.id || 'usr_101', name: user?.name || 'Traveler', email: user?.email || '' }]);
    } else {
      setNumberOfTravelers(3);
      setMembers([
        { id: user?.id || 'usr_101', name: user?.name || 'Traveler', email: user?.email || '' },
        { id: '2', name: 'Rahul', email: 'rahul@example.com' },
        { id: '3', name: 'Arjun', email: 'arjun@example.com' }
      ]);
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!destination || !destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (!numberOfDays || numberOfDays < 1) {
      newErrors.numberOfDays = 'Number of days must be at least 1';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    } else if (startDate < getTodayString()) {
      newErrors.startDate = 'Trip start date cannot be in the past';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        newErrors.dateRange = 'Start date cannot be after end date';
      }
      if (endDate < getTodayString()) {
        newErrors.endDate = 'Trip end date cannot be in the past';
      }
    }

    const budgetNum = Number(budget);
    if (!budget || isNaN(budgetNum) || budgetNum <= 0) {
      newErrors.budget = 'Please enter a valid budget greater than ₹0';
    }

    if (tripType === 'Group') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailSet = new Set();

      members.forEach((m, idx) => {
        if (!m.name || !m.name.trim()) {
          newErrors[`member_${idx}_name`] = 'Name required';
        }
        if (!m.email || !emailRegex.test(m.email.trim())) {
          newErrors[`member_${idx}_email`] = 'Valid email required';
        } else if (emailSet.has(m.email.trim().toLowerCase())) {
          newErrors[`member_${idx}_email`] = 'Duplicate email';
          newErrors.members = 'Member emails must be unique';
        } else {
          emailSet.add(m.email.trim().toLowerCase());
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const currentUser = getCurrentUser();
      const currentUserName = currentUser?.name || members[0]?.name || 'Vikas S';
      const currentUserId = currentUser?.id || 'usr_101';
      const currentUserEmail = currentUser?.email || 'vikas@example.com';

      const tripMembers = tripType === 'Solo'
        ? [{ id: currentUserId, name: currentUserName, email: currentUserEmail, role: 'OWNER', status: 'ACCEPTED' }]
        : members.map((m, idx) => idx === 0
            ? { ...m, id: m.id && m.id !== '1' ? m.id : currentUserId, name: m.name || currentUserName, email: m.email || currentUserEmail, role: 'OWNER', status: 'ACCEPTED' }
            : { ...m, role: 'MEMBER', status: 'ACCEPTED' }
          );

      const tripData = {
        name: `${destination.trim()} Trip`,
        destination: destination.trim(),
        numberOfDays: Number(numberOfDays),
        days: Number(numberOfDays),
        startDate,
        endDate,
        tripType,
        budget: Number(budget),
        numberOfTravelers: tripType === 'Solo' ? 1 : Number(numberOfTravelers),
        ownerId: currentUserId,
        createdBy: currentUserName,
        members: tripMembers
      };

      const createdTrip = await saveTrip(tripData);

      setSuccessToast(true);

      // Smooth transition to Trip Dashboard
      setTimeout(() => {
        navigate(`/trips/${createdTrip.id}/dashboard`);
      }, 600);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to create trip. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="form-container">
        <div className="page-header" style={{ marginBottom: '1.5rem' }}>
          <h1 className="page-title">Create a New Trip</h1>
          <p className="page-subtitle">Tell us about your trip details</p>
        </div>

        {successToast && (
          <div className="budget-warning-banner" style={{ backgroundColor: 'var(--accent-success-bg)', color: 'var(--accent-success)', borderColor: '#A7F3D0', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={18} />
            <span>Trip created successfully! Redirecting to Dashboard...</span>
          </div>
        )}

        {errors.submit && (
          <div className="budget-warning-banner" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            <span>{errors.submit}</span>
          </div>
        )}

        <div className="form-card">
          <form onSubmit={handleSubmit} className="form-grid">
            
            {/* 1. Destination */}
            <div className="form-group">
              <label className="form-label" htmlFor="destination-input">
                Destination
              </label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={18} />
                <input
                  id="destination-input"
                  type="text"
                  className={`form-input has-icon ${errors.destination ? 'error' : ''}`}
                  placeholder="e.g. Goa, Manali, Bali"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              {errors.destination && <span className="error-text">{errors.destination}</span>}
            </div>

            {/* 2. Number of Days Stepper */}
            <div className="form-group">
              <label className="form-label">Number of Days</label>
              <div className="stepper">
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => handleDaysChange(-1)}
                  disabled={numberOfDays <= 1}
                  aria-label="Decrease days"
                >
                  <Minus size={16} />
                </button>
                <span className="stepper-val">{numberOfDays}</span>
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => handleDaysChange(1)}
                  aria-label="Increase days"
                >
                  <Plus size={16} />
                </button>
              </div>
              {errors.numberOfDays && <span className="error-text">{errors.numberOfDays}</span>}
            </div>

            {/* 3. Start Date & End Date */}
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label" htmlFor="start-date-input">Start Date</label>
                <div className="input-wrapper">
                  <Calendar className="input-icon" size={18} />
                  <input
                    id="start-date-input"
                    type="date"
                    className={`form-input has-icon ${errors.startDate || errors.dateRange ? 'error' : ''}`}
                    value={startDate}
                    min={getTodayString()}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                  />
                </div>
                {errors.startDate && <span className="error-text">{errors.startDate}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="end-date-input">End Date</label>
                <div className="input-wrapper">
                  <Calendar className="input-icon" size={18} />
                  <input
                    id="end-date-input"
                    type="date"
                    className={`form-input has-icon ${errors.endDate || errors.dateRange ? 'error' : ''}`}
                    value={endDate}
                    min={startDate || getTodayString()}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                  />
                </div>
                {errors.endDate && <span className="error-text">{errors.endDate}</span>}
              </div>
            </div>
            {errors.dateRange && (
              <span className="error-text" style={{ marginTop: '-1rem' }}>
                {errors.dateRange}
              </span>
            )}

            {/* 4. Trip Type Segmented Control */}
            <div className="form-group">
              <label className="form-label">Trip Type</label>
              <TripTypeSelector tripType={tripType} onChange={handleTripTypeChange} />
            </div>

            {/* 5. Total Budget Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="budget-input">Total Budget</label>
              <div className="input-wrapper">
                <IndianRupee className="input-icon" size={18} />
                <input
                  id="budget-input"
                  type="number"
                  min="1"
                  step="500"
                  className={`form-input has-icon ${errors.budget ? 'error' : ''}`}
                  placeholder="20000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Formatted Display: ₹{Number(budget || 0).toLocaleString('en-IN')}
              </span>
              {errors.budget && <span className="error-text">{errors.budget}</span>}
            </div>

            {/* 6. Number of Travelers (Group mode) */}
            {tripType === 'Group' && (
              <div className="form-group">
                <label className="form-label">Number of Travelers</label>
                <div className="stepper">
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => handleTravelersChange(-1)}
                    disabled={numberOfTravelers <= 1}
                    aria-label="Decrease travelers"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="stepper-val">{numberOfTravelers}</span>
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => handleTravelersChange(1)}
                    aria-label="Increase travelers"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* 7. Group Member Details */}
            {tripType === 'Group' && (
              <MemberInput
                members={members}
                onMembersChange={setMembers}
                errors={errors}
              />
            )}

            {/* 8. Create / Next Button */}
            <div style={{ marginTop: '1rem' }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Creating Trip...</span>
                ) : (
                  <>
                    <span>Create Trip</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
