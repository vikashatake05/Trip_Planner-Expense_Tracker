const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  tripId: {
    type: String,
    required: [true, 'Trip ID is required'],
    index: true
  },
  date: {
    type: String,
    required: [true, 'Activity date is required']
  },
  title: {
    type: String,
    required: [true, 'Activity title is required'],
    trim: true
  },
  startTime: {
    type: String,
    default: ''
  },
  endTime: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: '',
    trim: true
  },
  estimatedCost: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true,
  strict: false,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

module.exports = mongoose.model('Itinerary', itinerarySchema);
