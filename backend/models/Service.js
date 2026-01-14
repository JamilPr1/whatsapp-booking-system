const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['main', 'sub'],
    default: 'main'
  },
  parentService: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    default: null
  },
  duration: {
    type: Number, // in minutes
    required: true,
    default: 60
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  depositAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Phase 0: single provider, Phase 1: multiple
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

module.exports = mongoose.model('Service', serviceSchema);
