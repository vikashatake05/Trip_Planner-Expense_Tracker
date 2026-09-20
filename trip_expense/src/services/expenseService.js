/**
 * Expense Service for TripLedger.
 * Connects directly to Express REST API on http://localhost:5050/api/expenses
 */

import api from './api';

export const getExpensesByTripId = async (tripId) => {
  try {
    const res = await api.get(`/expenses/trip/${tripId}`);
    if (res.data && res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (err) {
    throw new Error(`Unable to load expenses: ${err.message}`);
  }
};

export const getExpenseById = async (expenseId) => {
  try {
    const res = await api.get(`/expenses/${expenseId}`);
    if (res.data && res.data.success && res.data.data) {
      return res.data.data;
    }
  } catch (err) {
    throw new Error(`Unable to load expense: ${err.message}`);
  }
};

export const addExpense = async (tripId, expenseData) => {
  const payload = { tripId: String(tripId), ...expenseData };
  try {
    const res = await api.post('/expenses', payload);
    if (res.data && res.data.success && res.data.data) {
      const createdExpense = res.data.data;
      return createdExpense;
    }
  } catch (err) {
    throw new Error(`Unable to add expense: ${err.message}`);
  }
};

export const updateExpense = async (expenseId, expenseData) => {
  try {
    const res = await api.patch(`/expenses/${expenseId}`, expenseData);
    if (res.data && res.data.success && res.data.data) {
      return res.data.data;
    }
  } catch (err) {
    throw new Error(`Unable to update expense: ${err.message}`);
  }
};

export const deleteExpense = async (expenseId) => {
  try {
    await api.delete(`/expenses/${expenseId}`);
  } catch (err) {
    throw new Error(`Unable to delete expense: ${err.message}`);
  }
};
