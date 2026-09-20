const trips = require('../data/tripData');
const expenses = require('../data/expenseData');
const calculateSettlement = require('../utils/settlementCalculator');

/**
 * @desc    Get debt settlement calculations for a trip
 * @route   GET /api/settlements/:tripId
 */
const getSettlement = (req, res) => {
  const { tripId } = req.params;
  const trip = trips.find((t) => t.id === String(tripId));

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: "Trip not found"
    });
  }

  const tripExpenses = expenses.filter((e) => e.tripId === String(tripId));
  const result = calculateSettlement(trip, tripExpenses);

  res.status(200).json({
    success: true,
    data: result
  });
};

module.exports = {
  getSettlement
};
