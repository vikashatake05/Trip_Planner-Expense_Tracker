const itinerary = require('../data/itineraryData');
const trips = require('../data/tripData');
const generateId = require('../utils/generateId');

/**
 * @desc    Add an activity to itinerary
 * @route   POST /api/itinerary
 */
const createItineraryItem = (req, res) => {
  const { tripId, date, title, startTime, endTime, location, notes } = req.body;

  if (!tripId || !date || !title) {
    return res.status(400).json({
      success: false,
      message: "Please provide tripId, date, and title"
    });
  }

  const targetTrip = trips.find((t) => t.id === String(tripId));
  if (!targetTrip) {
    return res.status(404).json({
      success: false,
      message: "Trip not found"
    });
  }

  const newItem = {
    id: generateId('act'),
    tripId: String(tripId),
    date,
    title: title.trim(),
    startTime: startTime || '',
    endTime: endTime || '',
    location: location ? location.trim() : '',
    notes: notes ? notes.trim() : '',
    createdAt: new Date().toISOString()
  };

  itinerary.push(newItem);

  res.status(201).json({
    success: true,
    message: "Itinerary item created successfully",
    data: newItem
  });
};

/**
 * @desc    Get itinerary items for a trip
 * @route   GET /api/itinerary/trip/:tripId
 */
const getItineraryByTrip = (req, res) => {
  const { tripId } = req.params;
  const items = itinerary.filter((item) => item.tripId === String(tripId));

  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
};

/**
 * @desc    Update an itinerary item
 * @route   PATCH /api/itinerary/:id
 */
const updateItineraryItem = (req, res) => {
  const itemIndex = itinerary.findIndex((item) => item.id === req.params.id);

  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Itinerary item not found"
    });
  }

  const current = itinerary[itemIndex];
  const { date, title, startTime, endTime, location, notes } = req.body;

  const updatedItem = {
    ...current,
    date: date !== undefined ? date : current.date,
    title: title !== undefined ? title.trim() : current.title,
    startTime: startTime !== undefined ? startTime : current.startTime,
    endTime: endTime !== undefined ? endTime : current.endTime,
    location: location !== undefined ? location.trim() : current.location,
    notes: notes !== undefined ? notes.trim() : current.notes,
    updatedAt: new Date().toISOString()
  };

  itinerary[itemIndex] = updatedItem;

  res.status(200).json({
    success: true,
    message: "Itinerary item updated successfully",
    data: updatedItem
  });
};

/**
 * @desc    Delete an itinerary item
 * @route   DELETE /api/itinerary/:id
 */
const deleteItineraryItem = (req, res) => {
  const itemIndex = itinerary.findIndex((item) => item.id === req.params.id);

  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Itinerary item not found"
    });
  }

  itinerary.splice(itemIndex, 1);

  res.status(200).json({
    success: true,
    message: "Itinerary item deleted successfully"
  });
};

module.exports = {
  createItineraryItem,
  getItineraryByTrip,
  updateItineraryItem,
  deleteItineraryItem
};
