const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Phase 0: single provider
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Phase 0: single driver
  },
  bookingDate: {
    type: Date,
    required: true
  },
  bookingTime: {
    type: String, // HH:mm format
    required: true
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  payment: {
    method: {
      type: String,
      enum: ['online', 'in-person'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'refunded'],
      default: 'pending'
    },
    amount: {
      type: Number,
      required: true
    },
    depositAmount: {
      type: Number,
      default: 0
    },
    transactionId: String,
    stripePaymentIntentId: String
  },
  notes: {
    type: String,
    trim: true
  },
  whatsappConversationId: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
bookingSchema.index({ bookingDate: 1, location: { district: 1 } });
bookingSchema.index({ clientId: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
