const mongoose = require('mongoose');
const Trip = require('../models/Trip');

const findOwnedTrip = async (tripId, userId) => {
  const owner = new mongoose.Types.ObjectId(userId);
  if (mongoose.Types.ObjectId.isValid(tripId)) {
    return Trip.findOne({ _id: tripId, user: owner });
  }
  return Trip.findOne({ id: tripId, user: owner });
};

const findOwnedTripById = async (id, userId) => {
  const owner = new mongoose.Types.ObjectId(userId);
  if (mongoose.Types.ObjectId.isValid(id)) {
    return Trip.findOne({ _id: id, user: owner });
  }
  return Trip.findOne({ id, user: owner });
};

module.exports = { findOwnedTrip, findOwnedTripById };
