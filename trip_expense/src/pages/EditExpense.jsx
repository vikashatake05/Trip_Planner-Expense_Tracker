import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getTripById } from '../services/tripService';
import { getExpenseById, updateExpense, deleteExpense } from '../services/expenseService';
import { ArrowLeft, IndianRupee, Trash2 } from 'lucide-react';

export default function EditExpense() {
  const { tripId, expenseId } = useParams();
  const navigate = useNavigate();
  const currentId = tripId || 'goa-trip-2026';

  const [trip, setTrip] = useState(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [paidById, setPaidById] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [tData, expData] = await Promise.all([
        getTripById(currentId),
        getExpenseById(expenseId)
      ]);
      setTrip(tData);

      if (expData) {
        setTitle(expData.title || '');
        setAmount(expData.amount || '');
        setCategory(expData.category || 'Food');
        setDescription(expData.description || '');
        setPaidById(expData.paidById || '');
        setDate(expData.date || new Date().toISOString().split('T')[0]);
      }
      setLoading(false);
    }
    loadData();
  }, [currentId, expenseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    setSubmitting(true);

    const paidMember = trip.members.find(m => (m.userId || m.id || m.name) === paidById) || trip.members[0];

    await updateExpense(expenseId, {
      title: title.trim(),
      amount: Number(amount),
      category,
      description: description.trim(),
      paidBy: paidMember ? paidMember.name : 'Vikas S',
      paidById,
      date
    });

    navigate(`/trips/${currentId}/expenses`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      await deleteExpense(expenseId);
      navigate(`/trips/${currentId}/expenses`);
    }
  };

  if (loading) {
    return (
      <DashboardLayout currentTripId={currentId}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <p style={{ fontWeight: 600 }}>Loading expense record...</p>
        </div>
      </DashboardLayout>
    );
  }

  const members = trip?.members || [];

  return (
    <DashboardLayout currentTripId={currentId}>
      <div className="form-container">
        <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginBottom: '0.75rem', padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>
            <h1 className="page-title">Edit Expense</h1>
            <p className="page-subtitle">Update transaction details</p>
          </div>

          <button className="btn-icon-danger" style={{ width: '42px', height: '42px', marginTop: '1.5rem' }} onClick={handleDelete} title="Delete Expense">
            <Trash2 size={18} />
          </button>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label className="form-label">Expense Name *</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Amount (₹) *</label>
                <div className="input-wrapper">
                  <IndianRupee className="input-icon" size={18} />
                  <input
                    type="number"
                    min="1"
                    className="form-input has-icon"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
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
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: 1 }}>
                {submitting ? 'Updating...' : 'Update Expense'}
              </button>
              <button type="button" className="btn-secondary" onClick={handleDelete} style={{ color: 'var(--accent-danger)' }}>
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
