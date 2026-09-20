const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  id: { type: String, default: () => `usr_${Date.now()}` },
  name: { type: String, required: true },
  email: { type: String }
}, { _id: false });

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Trip name is required'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  startDate: {
    type: String,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: String,
    required: [true, 'End date is required']
  },
  days: {
    type: Number,
    required: [true, 'Number of days is required'],
    min: [1, 'Days must be at least 1']
  },
  numberOfDays: {
    type: Number,
    min: [1, 'Number of days must be at least 1']
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: [1, 'Budget must be greater than 0']
  },
  numberOfTravelers: {
    type: Number,
    min: [1, 'Number of travelers must be at least 1']
  },
  tripType: {
    type: String,
    enum: ['solo', 'group'],
    default: 'group'
  },
  ownerId: {
    type: String
  },
  createdBy: {
    type: String
  },
  members: [memberSchema]
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

module.exports = mongoose.model('Trip', tripSchema);
