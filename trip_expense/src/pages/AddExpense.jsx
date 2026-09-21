import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Toast from '../components/common/Toast';
import { getTripById } from '../services/tripService';
import { addExpense } from '../services/expenseService';
import { calculateEqualSplit, calculatePercentageSplit, validateCustomSplit } from '../utils/expenseCalculations';
import { ArrowLeft, IndianRupee, AlertCircle, CheckCircle2 } from 'lucide-react';

const getTodayString = () => new Date().toISOString().split('T')[0];

export default function AddExpense() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const currentId = tripId;

  const [trip, setTrip] = useState(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [paidById, setPaidById] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [splitBetween, setSplitBetween] = useState([]);
  const [splitMethod, setSplitMethod] = useState('EQUAL'); // EQUAL, CUSTOM, PERCENTAGE
  const [customAmounts, setCustomAmounts] = useState({});

  const [errors, setErrors] = useState({});
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadTrip() {
      try {
        const tData = await getTripById(currentId);
        setTrip(tData);
        if (tData?.startDate && tData?.endDate) {
          const today = getTodayString();
          const firstAllowedDate = tData.startDate > today ? tData.startDate : today;
          setDate(firstAllowedDate <= tData.endDate ? firstAllowedDate : tData.startDate);
        }
        if (tData && tData.members && tData.members.length > 0) {
          setPaidById(tData.members[0].userId || tData.members[0].id || 'usr_101');
          setSplitBetween(tData.members.map(m => m.userId || m.id || m.name));
        }
      } catch (error) {
        setLoadError('Unable to load this trip. Please return to My Trips and try again.');
      }
    }
    loadTrip();
  }, [currentId]);

  const handleMemberToggle = (memberId) => {
    if (splitBetween.includes(memberId)) {
      if (splitBetween.length <= 1) return;
      setSplitBetween(splitBetween.filter(id => id !== memberId));
    } else {
      setSplitBetween([...splitBetween, memberId]);
    }
  };

  const handleCustomAmountChange = (memberId, val) => {
    setCustomAmounts(prev => ({
      ...prev,
      [memberId]: val
    }));
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Expense title is required';
    if (!amount || Number(amount) <= 0) errs.amount = 'Please enter a valid amount greater than ₹0';
    if (!category) errs.category = 'Category is required';
    if (!paidById) errs.paidBy = 'Payer is required';
    if (splitBetween.length === 0) errs.splitBetween = 'Select at least one member to split between';

    if (trip?.startDate && trip?.endDate && (date < trip.startDate || date > trip.endDate)) {
      errs.date = `Date must be between ${trip.startDate} and ${trip.endDate}`;
    }

    if (splitMethod === 'CUSTOM') {
      const check = validateCustomSplit(Number(amount), customAmounts);
      if (!check.isValid) {
        errs.custom = `Custom shares sum to ₹${check.sum}, but total is ₹${amount}`;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const numericAmount = Number(amount);
    const paidMember = trip.members.find(m => (m.userId || m.id || m.name) === paidById) || trip.members[0];
    const payerName = paidMember ? paidMember.name : 'Vikas S';

    let splitShares = {};
    if (splitMethod === 'EQUAL') {
      splitShares = calculateEqualSplit(numericAmount, splitBetween);
    } else if (splitMethod === 'PERCENTAGE') {
      splitShares = calculatePercentageSplit(numericAmount, customAmounts);
    } else {
      splitShares = customAmounts;
    }

    const expensePayload = {
      title: title.trim(),
      amount: numericAmount,
      category,
      description: description.trim(),
      paidBy: payerName,
      paidById,
      splitBetween,
      splitMethod,
      splitShares,
      date
    };

    await addExpense(currentId, expensePayload);

    navigate(`/trips/${currentId}/expenses`);
  };

  if (!trip) {
    return (
      <DashboardLayout currentTripId={currentId}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <p style={{ fontWeight: 600 }}>Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  const members = trip.members || [];

  return (
    <DashboardLayout currentTripId={currentId}>
      <div className="form-container">
        <div className="page-header" style={{ marginBottom: '1.5rem' }}>
          <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginBottom: '0.75rem', padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
            <ArrowLeft size={15} />
            <span>Back</span>
          </button>
          <h1 className="page-title">Add Expense</h1>
          <p className="page-subtitle">Log a new payment for {trip.name}</p>
        </div>

        {errors.custom && (
          <div className="budget-warning-banner" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} />
            <span>{errors.custom}</span>
          </div>
        )}

        <div className="form-card">
          <form onSubmit={handleSubmit} className="form-grid">
            
            <div className="form-group">
              <label className="form-label">Expense Name *</label>
              <input
                type="text"
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="e.g. Resort Booking, Dinner at Beach"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Amount (₹) *</label>
                <div className="input-wrapper">
                  <IndianRupee className="input-icon" size={18} />
                  <input
                    type="number"
                    min="1"
                    className={`form-input has-icon ${errors.amount ? 'error' : ''}`}
                    placeholder="1200"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                {errors.amount && <span className="error-text">{errors.amount}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Accommodation">Accommodation (Stay)</option>
                  <option value="Food">Food & Drinks</option>
                  <option value="Transport">Transport</option>
                  <option value="Activities">Activities</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Paid By *</label>
                <select
                  className="form-input"
                  value={paidById}
                  onChange={(e) => setPaidById(e.target.value)}
                >
                  {members.map((m) => (
                    <option key={m.userId || m.id || m.email} value={m.userId || m.id || m.name}>
                      {m.name} ({m.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  className={`form-input ${errors.date ? 'error' : ''}`}
                  value={date}
                  min={trip?.startDate}
                  max={trip?.endDate}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                {errors.date && <span className="error-text">{errors.date}</span>}
              </div>
            </div>

            {/* Split Between Members */}
            <div className="form-group">
              <label className="form-label">Split Between Members</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                {members.map((m) => {
                  const mId = m.userId || m.id || m.name;
                  const isChecked = splitBetween.includes(mId);

                  return (
                    <div key={mId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 500 }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleMemberToggle(mId)}
                        />
                        <span>{m.name}</span>
                      </label>

                      {splitMethod === 'CUSTOM' && isChecked && (
                        <input
                          type="number"
                          className="form-input"
                          style={{ width: '110px', padding: '0.35rem 0.6rem', fontSize: '0.85rem' }}
                          placeholder="Amount ₹"
                          value={customAmounts[mId] || ''}
                          onChange={(e) => handleCustomAmountChange(mId, e.target.value)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Split Method Selector */}
            <div className="form-group">
              <label className="form-label">Split Method</label>
              <div className="segmented-control">
                <button
                  type="button"
                  className={`segment-option ${splitMethod === 'EQUAL' ? 'active' : ''}`}
                  onClick={() => setSplitMethod('EQUAL')}
                >
                  Equal
                </button>
                <button
                  type="button"
                  className={`segment-option ${splitMethod === 'CUSTOM' ? 'active' : ''}`}
                  onClick={() => setSplitMethod('CUSTOM')}
                >
                  Custom
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="Notes or bill breakdown..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={submitting} style={{ marginTop: '0.5rem' }}>
              {submitting ? 'Adding Expense...' : 'Add Expense'}
            </button>
          </form>
        </div>
      </div>
      <Toast message={loadError} type="error" onClose={() => setLoadError('')} duration={6000} />
    </DashboardLayout>
  );
}
