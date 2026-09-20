const trips = require('../data/tripData');
const expenses = require('../data/expenseData');
const itinerary = require('../data/itineraryData');
const generateId = require('../utils/generateId');

/**
 * @desc    Create a new trip
 * @route   POST /api/trips
 */
const createTrip = (req, res) => {
  const { name, destination, startDate, endDate, days, budget, tripType, members } = req.body;

  // Validation
  if (!name || !destination || !startDate || !endDate || !budget || !days) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, destination, startDate, endDate, days, and budget"
    });
  }

  if (Number(budget) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Budget must be greater than 0"
    });
  }

  if (Number(days) < 1) {
    return res.status(400).json({
      success: false,
      message: "Days must be at least 1"
    });
  }

  const validTypes = ['solo', 'group'];
  const type = tripType ? String(tripType).toLowerCase() : 'group';
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Trip type must be "solo" or "group"'
    });
  }

  const newTrip = {
    id: generateId('trip'),
    name: name.trim(),
    destination: destination.trim(),
    startDate,
    endDate,
    days: Number(days),
    budget: Number(budget),
    tripType: type,
    members: Array.isArray(members) && members.length > 0 ? members : [{ id: "1", name: "Creator" }],
    createdAt: new Date().toISOString()
  };

  trips.push(newTrip);

  res.status(201).json({
    success: true,
    message: "Trip created successfully",
    data: newTrip
  });
};

/**
 * @desc    Get all trips
 * @route   GET /api/trips
 */
const getAllTrips = (req, res) => {
  res.status(200).json({
    success: true,
    count: trips.length,
    data: trips
  });
};

/**
 * @desc    Get single trip by ID
 * @route   GET /api/trips/:id
 */
const getTripById = (req, res) => {
  const trip = trips.find((t) => t.id === req.params.id);

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: "Trip not found"
    });
  }

  res.status(200).json({
    success: true,
    data: trip
  });
};

/**
 * @desc    Update a trip
 * @route   PATCH /api/trips/:id
 */
const updateTrip = (req, res) => {
  const tripIndex = trips.findIndex((t) => t.id === req.params.id);

  if (tripIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Trip not found"
    });
  }

  const { name, destination, startDate, endDate, days, budget, tripType, members } = req.body;
  const currentTrip = trips[tripIndex];

  if (budget !== undefined && Number(budget) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Budget must be greater than 0"
    });
  }

  const updatedTrip = {
    ...currentTrip,
    name: name !== undefined ? name.trim() : currentTrip.name,
    destination: destination !== undefined ? destination.trim() : currentTrip.destination,
    startDate: startDate !== undefined ? startDate : currentTrip.startDate,
    endDate: endDate !== undefined ? endDate : currentTrip.endDate,
    days: days !== undefined ? Number(days) : currentTrip.days,
    budget: budget !== undefined ? Number(budget) : currentTrip.budget,
    tripType: tripType !== undefined ? String(tripType).toLowerCase() : currentTrip.tripType,
    members: members !== undefined ? members : currentTrip.members,
    updatedAt: new Date().toISOString()
  };

  trips[tripIndex] = updatedTrip;

  res.status(200).json({
    success: true,
    message: "Trip updated successfully",
    data: updatedTrip
  });
};

/**
 * @desc    Delete a trip
 * @route   DELETE /api/trips/:id
 */
const deleteTrip = (req, res) => {
  const tripIndex = trips.findIndex((t) => t.id === req.params.id);

  if (tripIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Trip not found"
    });
  }

  const deletedTrip = trips.splice(tripIndex, 1)[0];

  // Remove associated expenses & itinerary
  let expIndex = expenses.length;
  while (expIndex--) {
    if (expenses[expIndex].tripId === req.params.id) {
      expenses.splice(expIndex, 1);
    }
  }

  let itinIndex = itinerary.length;
  while (itinIndex--) {
    if (itinerary[itinIndex].tripId === req.params.id) {
      itinerary.splice(itinIndex, 1);
    }
  }

  res.status(200).json({
    success: true,
    message: `Trip "${deletedTrip.name}" deleted successfully`
  });
};

/**
 * @desc    Get trip budget & spending summary
 * @route   GET /api/trips/:tripId/summary
 */
const getTripSummary = (req, res) => {
  const { tripId } = req.params;
  const trip = trips.find((t) => t.id === tripId);

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: "Trip not found"
    });
  }

  const tripExpenses = expenses.filter((e) => e.tripId === tripId);
  
  let totalSpent = 0;
  const categories = {
    food: 0,
    accommodation: 0,
    transport: 0,
    activities: 0,
    shopping: 0,
    other: 0
  };

  tripExpenses.forEach((exp) => {
    const amt = Number(exp.amount) || 0;
    totalSpent += amt;

    const cat = exp.category ? String(exp.category).toLowerCase() : 'other';
    if (categories[cat] !== undefined) {
      categories[cat] += amt;
    } else {
      categories.other += amt;
    }
  });

  const budget = Number(trip.budget) || 0;
  const remaining = Math.max(0, budget - totalSpent);
  const percentageUsed = budget > 0 ? Number(((totalSpent / budget) * 100).toFixed(1)) : 0;

  res.status(200).json({
    success: true,
    data: {
      budget,
      totalSpent,
      remaining,
      percentageUsed,
      expenseCount: tripExpenses.length,
      categories
    }
  });
};

module.exports = {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getTripSummary
};
