const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const Trip = require('../models/Trip');

/**
 * Helper to process and validate expense split allocations
 */
const processSplits = (amount, splitType, participants, splitsInput) => {
  const splits = {};
  const count = (Array.isArray(participants) && participants.length > 0) ? participants.length : 1;
  const parts = count > 0 ? participants : ["1"];

  if (splitsInput && typeof splitsInput === 'object' && Object.keys(splitsInput).length > 0) {
    if (Array.isArray(splitsInput)) {
      splitsInput.forEach((s) => {
        if (s && (s.userId || s.id)) {
          splits[s.userId || s.id] = Number(s.amount || s.percentage || 0);
        }
      });
    } else {
      Object.keys(splitsInput).forEach((key) => {
        splits[key] = Number(splitsInput[key]) || 0;
      });
    }
    const inputTotal = Object.values(splits).reduce((sum, value) => sum + value, 0);
    if (splitType === 'percentage' && Math.abs(inputTotal - 100) <= 0.01) {
      Object.keys(splits).forEach((key) => {
        splits[key] = Number(((amount * splits[key]) / 100).toFixed(2));
      });
    }

    const splitTotal = Object.values(splits).reduce((sum, value) => sum + value, 0);
    if (Math.abs(splitTotal - amount) > 0.05) {
      return {
        isValid: false,
        message: splitType === 'percentage'
          ? 'Percentage splits must total 100% or their calculated amounts must equal the expense amount'
          : 'Split amounts must equal the expense amount'
      };
    }

    return { isValid: true, splits };
  }

  // Default equal allocation
  const perPerson = Number((amount / count).toFixed(2));
  let allocated = 0;
  parts.forEach((userId, idx) => {
    if (idx === parts.length - 1) {
      splits[userId] = Number((amount - allocated).toFixed(2));
    } else {
      splits[userId] = perPerson;
      allocated += perPerson;
    }
  });

  return { isValid: true, splits };
};

/**
 * @desc    Create a new expense
 * @route   POST /api/expenses
 */
const createExpense = async (req, res) => {
  try {
    const { 
      tripId, 
      description, 
      title, 
      amount, 
      category, 
      paidBy, 
      paidById, 
      splitType, 
      splitMethod, 
      participants, 
      splitBetween, 
      splits: splitsInput, 
      splitShares, 
      date 
    } = req.body;

    const expDesc = (title || description || 'Expense').trim();
    const payer = String(paidBy || paidById || 'Traveler');

    if (!tripId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Please provide tripId and amount"
      });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0"
      });
    }

    let targetTrip = null;
    if (mongoose.Types.ObjectId.isValid(tripId)) {
      targetTrip = await Trip.findById(tripId);
    }
    if (!targetTrip) {
      targetTrip = await Trip.findOne({ id: tripId });
    }

    if (!targetTrip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    const expenseDate = date || new Date().toISOString().split('T')[0];
    if (targetTrip.startDate && targetTrip.endDate && (expenseDate < targetTrip.startDate || expenseDate > targetTrip.endDate)) {
      return res.status(400).json({
        success: false,
        message: `Expense date must be between ${targetTrip.startDate} and ${targetTrip.endDate}`
      });
    }

    const memberIds = (targetTrip.members || []).map(m => m.id || m.userId || m.name);
    const rawParts = (Array.isArray(participants) && participants.length > 0)
      ? participants
      : ((Array.isArray(splitBetween) && splitBetween.length > 0) ? splitBetween : memberIds);

    const parts = rawParts.length > 0 ? rawParts : ["1"];

    const rawType = (splitType || splitMethod || 'equal').toLowerCase();
    const type = ['equal', 'custom', 'percentage'].includes(rawType) ? rawType : 'equal';

    const inputSplits = splitsInput || splitShares;
    const splitResult = processSplits(numericAmount, type, parts, inputSplits);

    if (!splitResult.isValid) {
      return res.status(400).json({
        success: false,
        message: splitResult.message
      });
    }

    const cat = category ? String(category).trim().toLowerCase() : 'other';
    const categoryAliases = {
      food: 'food',
      accommodation: 'accommodation',
      stay: 'accommodation',
      transport: 'transport',
      activities: 'activities',
      activity: 'activities',
      shopping: 'shopping',
      other: 'other',
      others: 'other'
    };
    const validCat = categoryAliases[cat] || 'other';

    const expensePayload = {
      tripId: String(targetTrip.id || targetTrip._id || tripId),
      description: expDesc,
      title: expDesc,
      amount: numericAmount,
      category: validCat,
      paidBy: payer,
      paidById: String(paidById || payer),
      splitType: type,
      splitMethod: type.toUpperCase(),
      participants: parts,
      splitBetween: parts,
      splits: splitResult.splits,
      splitShares: splitResult.splits,
      date: expenseDate
    };

    const newExpense = await Expense.create(expensePayload);
    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: newExpense
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get expenses for a trip
 * @route   GET /api/expenses/trip/:tripId
 */
const getExpensesByTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const dbExpenses = await Expense.find({ tripId: String(tripId) }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: dbExpenses.length,
      data: dbExpenses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all expenses
 * @route   GET /api/expenses
 */
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single expense by ID
 * @route   GET /api/expenses/:id
 */
const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    let expense = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      expense = await Expense.findById(id);
    }
    if (!expense) {
      expense = await Expense.findOne({ id });
    }

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update an expense
 * @route   PATCH /api/expenses/:id
 */
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, title, amount, category, paidBy, paidById, splitType, splitMethod, participants, splitBetween, splits: splitsInput, splitShares, date } = req.body;

    let current = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      current = await Expense.findById(id);
    }
    if (!current) {
      current = await Expense.findOne({ id });
    }

    if (!current) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    const newAmount = amount !== undefined ? Number(amount) : current.amount;
    if (isNaN(newAmount) || newAmount <= 0) {
      return res.status(400).json({ success: false, message: "Amount must be greater than 0" });
    }

    const newParts = participants || splitBetween || current.participants;
    const newType = (splitType || splitMethod || current.splitType).toLowerCase();

    let splitResult = { isValid: true, splits: current.splits };
    if (amount !== undefined || splitType !== undefined || splitMethod !== undefined || participants !== undefined || splitBetween !== undefined || splitsInput !== undefined || splitShares !== undefined) {
      splitResult = processSplits(newAmount, newType, newParts, splitsInput || splitShares || current.splits);
      if (!splitResult.isValid) {
        return res.status(400).json({ success: false, message: splitResult.message });
      }
    }

    const expDesc = (title || description || current.description).trim();
    const payer = String(paidBy || paidById || current.paidBy);

    const updateData = {
      description: expDesc,
      title: expDesc,
      amount: newAmount,
      category: category !== undefined
        ? ({
            food: 'food',
            accommodation: 'accommodation',
            stay: 'accommodation',
            transport: 'transport',
            activities: 'activities',
            activity: 'activities',
            shopping: 'shopping',
            other: 'other',
            others: 'other'
          }[String(category).trim().toLowerCase()] || 'other')
        : current.category,
      paidBy: payer,
      paidById: String(paidById || payer),
      splitType: newType,
      splitMethod: newType.toUpperCase(),
      participants: newParts,
      splitBetween: newParts,
      splits: splitResult.splits,
      splitShares: splitResult.splits,
      date: date !== undefined ? date : current.date
    };

    let updated = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await Expense.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } else {
      updated = await Expense.findOneAndUpdate({ id }, updateData, { new: true, runValidators: true });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete an expense
 * @route   DELETE /api/expenses/:id
 */
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Expense.findByIdAndDelete(id);
    } else {
      deleted = await Expense.findOneAndDelete({ id });
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createExpense,
  getAllExpenses,
  getExpensesByTrip,
  getExpenseById,
  updateExpense,
  deleteExpense
};
