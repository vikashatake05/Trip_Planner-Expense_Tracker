/**
 * Expense Service for TripLedger.
 * Manages expense CRUD operations, split allocations, and filters.
 * 
 * FUTURE API ENDPOINTS:
 * GET /api/trips/:tripId/expenses
 * POST /api/trips/:tripId/expenses
 * PUT /api/expenses/:expenseId
 * DELETE /api/expenses/:expenseId
 */

import { getItem, setItem, STORAGE_KEYS } from './storage';
import { INITIAL_MOCK_EXPENSES } from '../data/mockExpenses';

export const getExpensesByTripId = async (tripId) => {
  const expenses = getItem(STORAGE_KEYS.EXPENSES, INITIAL_MOCK_EXPENSES);
  return expenses.filter((e) => e.tripId === tripId);
};

export const getExpenseById = async (expenseId) => {
  const expenses = getItem(STORAGE_KEYS.EXPENSES, INITIAL_MOCK_EXPENSES);
  return expenses.find((e) => e.id === expenseId) || null;
};

export const addExpense = async (tripId, expenseData) => {
  const expenses = getItem(STORAGE_KEYS.EXPENSES, INITIAL_MOCK_EXPENSES);
  
  const newExpense = {
    id: `exp_${Date.now()}`,
    tripId,
    ...expenseData,
    createdAt: new Date().toISOString()
  };

  const updated = [newExpense, ...expenses];
  setItem(STORAGE_KEYS.EXPENSES, updated);
  return newExpense;
};

export const updateExpense = async (expenseId, expenseData) => {
  const expenses = getItem(STORAGE_KEYS.EXPENSES, INITIAL_MOCK_EXPENSES);
  
  const updated = expenses.map((e) => {
    if (e.id === expenseId) {
      return { ...e, ...expenseData, updatedAt: new Date().toISOString() };
    }
    return e;
  });

  setItem(STORAGE_KEYS.EXPENSES, updated);
  return updated.find((e) => e.id === expenseId);
};

export const deleteExpense = async (expenseId) => {
  const expenses = getItem(STORAGE_KEYS.EXPENSES, INITIAL_MOCK_EXPENSES);
  const filtered = expenses.filter((e) => e.id !== expenseId);
  setItem(STORAGE_KEYS.EXPENSES, filtered);
  return true;
};
