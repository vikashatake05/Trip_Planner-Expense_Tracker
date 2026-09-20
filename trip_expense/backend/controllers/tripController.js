const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const Itinerary = require('../models/Itinerary');

/**
 * @desc    Create a new trip
 * @route   POST /api/trips
 */
const createTrip = async (req, res) => {
  try {
    const { name, destination, startDate, endDate, days, numberOfDays, budget, tripType, members, numberOfTravelers, ownerId, createdBy } = req.body;

    const numDays = Number(days || numberOfDays);

    if (!name || !destination || !startDate || !endDate || !budget || !numDays) {
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

    if (numDays < 1) {
      return res.status(400).json({
        success: false,
        message: "Days must be at least 1"
      });
    }

    const type = tripType ? String(tripType).toLowerCase() : 'group';
    if (!['solo', 'group'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Trip type must be "solo" or "group"'
      });
    }

    const memberList = Array.isArray(members) && members.length > 0 
      ? members 
      : [{ id: "usr_101", name: "Creator" }];

    const newTrip = await Trip.create({
      name: name.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      days: numDays,
      numberOfDays: numDays,
      budget: Number(budget),
      numberOfTravelers: Number(numberOfTravelers) || memberList.length,
      tripType: type,
      ownerId: ownerId || (memberList[0] ? memberList[0].id : undefined),
      createdBy: createdBy || (memberList[0] ? memberList[0].name : undefined),
      members: memberList
    });

    res.status(201).json({
      success: true,
      message: "Trip created successfully",
      data: newTrip
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all trips
 * @route   GET /api/trips
 */
const getAllTrips = async (req, res) => {
  try {
    const dbTrips = await Trip.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: dbTrips.length,
      data: dbTrips
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single trip by ID
 * @route   GET /api/trips/:id
 */
const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    let trip = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      trip = await Trip.findById(id);
    }
    if (!trip) {
      trip = await Trip.findOne({ id });
    }

    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update a trip
 * @route   PATCH /api/trips/:id
 */
const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, destination, startDate, endDate, days, numberOfDays, budget, tripType, members } = req.body;

    if (budget !== undefined && Number(budget) <= 0) {
      return res.status(400).json({ success: false, message: "Budget must be greater than 0" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (destination !== undefined) updateData.destination = destination.trim();
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (days !== undefined || numberOfDays !== undefined) {
      updateData.days = Number(days || numberOfDays);
      updateData.numberOfDays = updateData.days;
    }
    if (budget !== undefined) updateData.budget = Number(budget);
    if (tripType !== undefined) updateData.tripType = String(tripType).toLowerCase();
    if (members !== undefined) {
      updateData.members = members;
      updateData.numberOfTravelers = members.length;
    }
    if (req.body.numberOfTravelers !== undefined) {
      updateData.numberOfTravelers = Number(req.body.numberOfTravelers);
    }

    let updated = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await Trip.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } else {
      updated = await Trip.findOneAndUpdate({ id }, updateData, { new: true, runValidators: true });
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    res.status(200).json({
      success: true,
      message: "Trip updated successfully",
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a trip
 * @route   DELETE /api/trips/:id
 */
const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Trip.findByIdAndDelete(id);
    } else {
      deleted = await Trip.findOneAndDelete({ id });
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    // Cleanup associated expenses and itinerary
    await Expense.deleteMany({ tripId: String(id) });
    await Itinerary.deleteMany({ tripId: String(id) });

    res.status(200).json({
      success: true,
      message: `Trip "${deleted.name}" deleted successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get trip budget & spending summary
 * @route   GET /api/trips/:tripId/summary
 */
const getTripSummary = async (req, res) => {
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
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    const tripExpenses = await Expense.find({ tripId: String(targetTrip.id || targetTrip._id || tripId) });

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

    const budget = Number(targetTrip.budget) || 0;
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
        categories,
        categoryBreakdown: categories
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getTripSummary
};
