const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const calculateSettlement = require('../utils/settlementCalculator');

/**
 * @desc    Get debt settlement calculations for a trip
 * @route   GET /api/settlements/:tripId
 */
const getSettlement = async (req, res) => {
  try {
    const { tripId } = req.params;

    let targetTrip = null;
    if (mongoose.Types.ObjectId.isValid(tripId)) {
      targetTrip = await Trip.findById(tripId);
    }
    if (!targetTrip) {
      targetTrip = await Trip.findOne({ id: tripId });
    }

    if (!targetTrip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }

    const tripExpenses = await Expense.find({ tripId: String(targetTrip.id || targetTrip._id || tripId) });

    const result = calculateSettlement(targetTrip, tripExpenses);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettlement
};
