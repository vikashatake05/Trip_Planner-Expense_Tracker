import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';

export default function ActivityFormModal({ isOpen, onClose, onSave, tripDates = {}, activity = null }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(tripDates.startDate || '');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [location, setLocation] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setTitle(activity?.title || '');
    setDate(activity?.date || tripDates.initialDate || tripDates.startDate || '');
    setStartTime(activity?.startTime || '');
    setEndTime(activity?.endTime || '');
    setLocation(activity?.location || '');
    setEstimatedCost(activity?.estimatedCost ? String(activity.estimatedCost) : '');
    setNotes(activity?.notes || '');
  }, [activity, isOpen, tripDates.startDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    onSave({
      ...(activity?.id ? { id: activity.id } : {}),
      title: title.trim(),
      date,
      startTime,
      endTime,
      location: location.trim(),
      estimatedCost: Number(estimatedCost) || 0,
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={activity ? 'Edit Activity' : 'Add Activity to Itinerary'}>
      <form onSubmit={handleSubmit} className="form-grid" style={{ gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Activity Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Beach Water Sports"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid-cols-2">
          <div className="form-group">
            <label className="form-label">Date *</label>
            <input
              type="date"
              className="form-input"
              value={date}
              min={tripDates.startDate}
              max={tripDates.endDate}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estimated Cost (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 1500"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
            />
          </div>
        </div>

        <div className="grid-cols-2">
          <div className="form-group">
            <label className="form-label">Start Time</label>
            <input
              type="time"
              className="form-input"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">End Time</label>
            <input
              type="time"
              className="form-input"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Baga Beach"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="form-input"
            rows={2}
            placeholder="Important details or reminders..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" style={{ flex: 1 }}>
            {activity ? 'Save Changes' : 'Save Activity'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
