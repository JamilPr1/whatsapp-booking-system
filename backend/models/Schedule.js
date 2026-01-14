const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  district: {
    type: String,
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  isLocked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient date queries
scheduleSchema.index({ date: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema);
