/**
 * Business logic & calculation utilities for TripLedger.
 * Keeps complex calculation math decoupled from React JSX components.
 */

/**
 * Calculate total spent from an array of expense objects
 * @param {Array} expenses
 * @returns {number}
 */
export const calculateTotalExpenses = (expenses = []) => {
  if (!Array.isArray(expenses)) return 0;
  return expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
};

/**
 * Calculate remaining budget
 * @param {number} totalBudget
 * @param {number} spent
 * @returns {number}
 */
export const calculateRemainingBudget = (totalBudget = 0, spent = 0) => {
  return Math.max(0, Number(totalBudget) - Number(spent));
};

/**
 * Calculate percentage of budget used (0 to 100 max cap)
 * @param {number} totalBudget
 * @param {number} spent
 * @returns {number} percentage float with 1 decimal precision
 */
export const calculateBudgetPercentage = (totalBudget = 0, spent = 0) => {
  const budgetNum = Number(totalBudget);
  if (!budgetNum || budgetNum <= 0) return 0;
  const rawPercentage = (Number(spent) / budgetNum) * 100;
  // Cap visual percentage at 100% for progress bar rendering
  return Number(Math.min(100, Math.max(0, rawPercentage)).toFixed(1));
};

/**
 * Calculate daily average expense
 * @param {number} spent
 * @param {number} numberOfDays
 * @returns {number}
 */
export const calculateDailyAverage = (spent = 0, numberOfDays = 1) => {
  const days = Math.max(1, Number(numberOfDays) || 1);
  return Math.round(Number(spent) / days);
};

/**
 * Calculate per-person expense share
 * @param {number} spent
 * @param {number} numberOfTravelers
 * @returns {number}
 */
export const calculatePerPersonExpense = (spent = 0, numberOfTravelers = 1) => {
  const travelers = Math.max(1, Number(numberOfTravelers) || 1);
  return Math.round(Number(spent) / travelers);
};

/**
 * Aggregate expenses by category for Pie/Donut Chart breakdown
 * @param {Array} expenses
 * @returns {Array<{ name: string, value: number, percentage: number, color: string }>}
 */
export const calculateCategoryBreakdown = (expenses = []) => {
  const CATEGORY_COLORS = {
    'Accommodation': '#3B82F6', // Blue
    'Food': '#F59E0B',          // Amber/Gold
    'Transport': '#10B981',     // Emerald Green
    'Activities': '#8B5CF6',    // Purple
    'Others': '#64748B'         // Slate Gray
  };

  const totals = {
    'Accommodation': 0,
    'Food': 0,
    'Transport': 0,
    'Activities': 0,
    'Others': 0
  };

  let grandTotal = 0;

  const categoryNames = {
    accommodation: 'Accommodation',
    food: 'Food',
    transport: 'Transport',
    activities: 'Activities',
    shopping: 'Others',
    other: 'Others',
    others: 'Others'
  };

  if (Array.isArray(expenses)) {
    expenses.forEach((exp) => {
      const rawCategory = String(exp.category || 'other').trim().toLowerCase();
      const cat = categoryNames[rawCategory] || categoryNames[String(exp.category || '').trim().toLowerCase()] || 'Others';
      const amount = Number(exp.amount) || 0;
      if (totals[cat] !== undefined) {
        totals[cat] += amount;
      } else {
        totals['Others'] += amount;
      }
      grandTotal += amount;
    });
  }

  return Object.keys(totals).map((catName) => {
    const value = totals[catName];
    const percentage = grandTotal > 0 ? Number(((value / grandTotal) * 100).toFixed(1)) : 0;
    return {
      name: catName,
      value,
      percentage,
      color: CATEGORY_COLORS[catName] || CATEGORY_COLORS['Others']
    };
  });
};

/**
 * Determine dynamic trip status based on start and end dates relative to today
 * @param {string} startDate
 * @param {string} endDate
 * @returns {{ label: string, statusKey: 'in_progress'|'upcoming'|'completed' }}
 */
export const getTripStatus = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return { label: 'Upcoming trip', statusKey: 'upcoming' };
  }

  const now = new Date();
  // Strip time for exact date comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const start = new Date(startDate);
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  
  const end = new Date(endDate);
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  if (today >= startDay && today <= endDay) {
    return { label: 'Trip in progress', statusKey: 'in_progress' };
  } else if (today < startDay) {
    return { label: 'Upcoming trip', statusKey: 'upcoming' };
  } else {
    return { label: 'Completed trip', statusKey: 'completed' };
  }
};
