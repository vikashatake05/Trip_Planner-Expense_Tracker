const mongoose = require('mongoose');
const Itinerary = require('../models/Itinerary');
const Trip = require('../models/Trip');

/**
 * @desc    Add an activity to itinerary
 * @route   POST /api/itinerary
 */
const createItineraryItem = async (req, res) => {
  try {
    const { tripId, date, title, startTime, endTime, location, estimatedCost, notes } = req.body;

    if (!tripId || !date || !title) {
      return res.status(400).json({
        success: false,
        message: "Please provide tripId, date, and title"
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

    const payload = {
      tripId: String(tripId),
      date,
      title: title.trim(),
      startTime: startTime || '',
      endTime: endTime || '',
      location: location ? location.trim() : '',
      estimatedCost: Number(estimatedCost) || 0,
      notes: notes ? notes.trim() : ''
    };

    const newItem = await Itinerary.create(payload);

    res.status(201).json({
      success: true,
      message: "Itinerary item created successfully",
      data: newItem
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get itinerary items for a trip
 * @route   GET /api/itinerary/trip/:tripId
 */
const getItineraryByTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const items = await Itinerary.find({ tripId: String(tripId) }).sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get one itinerary item
 * @route   GET /api/itinerary/:id
 */
const getItineraryItemById = async (req, res) => {
  try {
    const { id } = req.params;
    let item = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      item = await Itinerary.findById(id);
    }
    if (!item) {
      item = await Itinerary.findOne({ id });
    }
    if (!item) {
      return res.status(404).json({ success: false, message: "Itinerary item not found" });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update an itinerary item
 * @route   PATCH /api/itinerary/:id
 */
const updateItineraryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, title, startTime, endTime, location, estimatedCost, notes } = req.body;

    const updateData = {};
    if (date !== undefined) updateData.date = date;
    if (title !== undefined) updateData.title = title.trim();
    if (startTime !== undefined) updateData.startTime = startTime;
    if (endTime !== undefined) updateData.endTime = endTime;
    if (location !== undefined) updateData.location = location.trim();
    if (estimatedCost !== undefined) updateData.estimatedCost = Number(estimatedCost);
    if (notes !== undefined) updateData.notes = notes.trim();

    let updated = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await Itinerary.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } else {
      updated = await Itinerary.findOneAndUpdate({ id }, updateData, { new: true, runValidators: true });
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: "Itinerary item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Itinerary item updated successfully",
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete an itinerary item
 * @route   DELETE /api/itinerary/:id
 */
const deleteItineraryItem = async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Itinerary.findByIdAndDelete(id);
    } else {
      deleted = await Itinerary.findOneAndDelete({ id });
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Itinerary item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Itinerary item deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createItineraryItem,
  getItineraryByTrip,
  getItineraryItemById,
  updateItineraryItem,
  deleteItineraryItem
};
