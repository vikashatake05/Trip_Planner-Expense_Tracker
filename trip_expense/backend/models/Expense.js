const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  tripId: {
    type: String,
    required: [true, 'Trip ID is required'],
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  amount: {
    type: Number,
    required: [true, 'Expense amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  category: {
    type: String,
    default: 'other'
  },
  paidBy: {
    type: String,
    required: [true, 'Payer is required']
  },
  paidById: {
    type: String
  },
  splitType: {
    type: String,
    default: 'equal'
  },
  splitMethod: {
    type: String,
    default: 'EQUAL'
  },
  participants: [{
    type: String
  }],
  splitBetween: [{
    type: String
  }],
  splits: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  splitShares: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
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

module.exports = mongoose.model('Expense', expenseSchema);
