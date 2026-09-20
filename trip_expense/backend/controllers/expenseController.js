const expenses = require('../data/expenseData');
const trips = require('../data/tripData');
const generateId = require('../utils/generateId');

/**
 * Helper to process and validate expense split allocations
 */
const processSplits = (amount, splitType, participants, splitsInput) => {
  const splits = {};

  if (splitType === 'equal') {
    const count = participants.length;
    if (count === 0) return { isValid: false, message: "Participants list cannot be empty" };
    
    const perPerson = Number((amount / count).toFixed(2));
    let allocated = 0;
    
    participants.forEach((userId, idx) => {
      if (idx === participants.length - 1) {
        splits[userId] = Number((amount - allocated).toFixed(2));
      } else {
        splits[userId] = perPerson;
        allocated += perPerson;
      }
    });

    return { isValid: true, splits };
  }

  if (splitType === 'custom') {
    if (!Array.isArray(splitsInput) && typeof splitsInput !== 'object') {
      return { isValid: false, message: "Custom splits must be provided" };
    }

    let customSum = 0;
    if (Array.isArray(splitsInput)) {
      splitsInput.forEach((s) => {
        const amt = Number(s.amount) || 0;
        splits[s.userId] = amt;
        customSum += amt;
      });
    } else {
      Object.keys(splitsInput).forEach((userId) => {
        const amt = Number(splitsInput[userId]) || 0;
        splits[userId] = amt;
        customSum += amt;
      });
    }

    if (Math.abs(amount - customSum) > 0.05) {
      return { 
        isValid: false, 
        message: `Sum of custom split amounts (${customSum}) does not equal total expense amount (${amount})` 
      };
    }

    return { isValid: true, splits };
  }

  if (splitType === 'percentage') {
    let totalPct = 0;
    
    if (Array.isArray(splitsInput)) {
      splitsInput.forEach((s) => {
        const pct = Number(s.percentage) || 0;
        totalPct += pct;
        splits[s.userId] = Number(((amount * pct) / 100).toFixed(2));
      });
    } else {
      Object.keys(splitsInput).forEach((userId) => {
        const pct = Number(splitsInput[userId]) || 0;
        totalPct += pct;
        splits[userId] = Number(((amount * pct) / 100).toFixed(2));
      });
    }

    if (Math.abs(100 - totalPct) > 0.01) {
      return {
        isValid: false,
        message: `Total percentage (${totalPct}%) must equal 100%`
      };
    }

    return { isValid: true, splits };
  }

  return { isValid: false, message: 'Invalid splitType. Allowed: "equal", "custom", "percentage"' };
};

/**
 * @desc    Create a new expense
 * @route   POST /api/expenses
 */
const createExpense = (req, res) => {
  const { tripId, description, amount, category, paidBy, splitType, participants, splits: splitsInput, date } = req.body;

  // Validation
  if (!tripId || !description || !amount || !paidBy) {
    return res.status(400).json({
      success: false,
      message: "Please provide tripId, description, amount, and paidBy"
    });
  }

  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Amount must be greater than 0"
    });
  }

  // Check trip existence
  const targetTrip = trips.find((t) => t.id === String(tripId));
  if (!targetTrip) {
    return res.status(404).json({
      success: false,
      message: "Trip not found"
    });
  }

  const parts = Array.isArray(participants) && participants.length > 0
    ? participants
    : targetTrip.members.map(m => m.id);

  const type = splitType ? String(splitType).toLowerCase() : 'equal';
  const splitResult = processSplits(numericAmount, type, parts, splitsInput);

  if (!splitResult.isValid) {
    return res.status(400).json({
      success: false,
      message: splitResult.message
    });
  }

  const newExpense = {
    id: generateId('exp'),
    tripId: String(tripId),
    description: description.trim(),
    amount: numericAmount,
    category: category ? String(category).toLowerCase() : 'other',
    paidBy: String(paidBy),
    splitType: type,
    participants: parts,
    splits: splitResult.splits,
    date: date || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };

  expenses.push(newExpense);

  res.status(201).json({
    success: true,
    message: "Expense created successfully",
    data: newExpense
  });
};

/**
 * @desc    Get expenses for a trip
 * @route   GET /api/expenses/trip/:tripId
 */
const getExpensesByTrip = (req, res) => {
  const { tripId } = req.params;
  const tripExpenses = expenses.filter((e) => e.tripId === String(tripId));

  res.status(200).json({
    success: true,
    count: tripExpenses.length,
    data: tripExpenses
  });
};

/**
 * @desc    Get single expense by ID
 * @route   GET /api/expenses/:id
 */
const getExpenseById = (req, res) => {
  const expense = expenses.find((e) => e.id === req.params.id);

  if (!expense) {
    return res.status(404).json({
      success: false,
      message: "Expense not found"
    });
  }

  res.status(200).json({
    success: true,
    data: expense
  });
};

/**
 * @desc    Update an expense
 * @route   PATCH /api/expenses/:id
 */
const updateExpense = (req, res) => {
  const expenseIndex = expenses.findIndex((e) => e.id === req.params.id);

  if (expenseIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Expense not found"
    });
  }

  const current = expenses[expenseIndex];
  const { description, amount, category, paidBy, splitType, participants, splits: splitsInput, date } = req.body;

  const newAmount = amount !== undefined ? Number(amount) : current.amount;
  if (isNaN(newAmount) || newAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Amount must be greater than 0"
    });
  }

  const newParts = participants !== undefined ? participants : current.participants;
  const newType = splitType !== undefined ? String(splitType).toLowerCase() : current.splitType;

  let splitResult = { isValid: true, splits: current.splits };
  if (amount !== undefined || splitType !== undefined || participants !== undefined || splitsInput !== undefined) {
    splitResult = processSplits(newAmount, newType, newParts, splitsInput || current.splits);
    if (!splitResult.isValid) {
      return res.status(400).json({
        success: false,
        message: splitResult.message
      });
    }
  }

  const updatedExpense = {
    ...current,
    description: description !== undefined ? description.trim() : current.description,
    amount: newAmount,
    category: category !== undefined ? String(category).toLowerCase() : current.category,
    paidBy: paidBy !== undefined ? String(paidBy) : current.paidBy,
    splitType: newType,
    participants: newParts,
    splits: splitResult.splits,
    date: date !== undefined ? date : current.date,
    updatedAt: new Date().toISOString()
  };

  expenses[expenseIndex] = updatedExpense;

  res.status(200).json({
    success: true,
    message: "Expense updated successfully",
    data: updatedExpense
  });
};

/**
 * @desc    Delete an expense
 * @route   DELETE /api/expenses/:id
 */
const deleteExpense = (req, res) => {
  const expenseIndex = expenses.findIndex((e) => e.id === req.params.id);

  if (expenseIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Expense not found"
    });
  }

  expenses.splice(expenseIndex, 1);

  res.status(200).json({
    success: true,
    message: "Expense deleted successfully"
  });
};

module.exports = {
  createExpense,
  getExpensesByTrip,
  getExpenseById,
  updateExpense,
  deleteExpense
};
