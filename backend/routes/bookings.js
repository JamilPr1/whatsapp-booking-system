const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const bookingService = require('../services/bookingService');
const paymentService = require('../services/paymentService');
const auth = require('../middleware/auth');
const moment = require('moment-timezone');

// Get all bookings (admin/provider)
router.get('/', auth, async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'client') {
      query.clientId = req.user._id;
    } else if (req.user.role === 'provider') {
      query.providerId = req.user._id;
    }

    // Remove sort from query and apply it separately
    const { sort, ...bookingQuery } = query;
    const bookings = await Booking.find({ ...bookingQuery, sort: { bookingDate: -1 } });
    
    // Populate related data manually (Supabase doesn't have populate)
    const populatedBookings = await Promise.all(bookings.map(async (booking) => {
      const bookingObj = booking.toJSON();
      
      // Fetch related user/service data if needed
      if (booking.clientId) {
        try {
          const User = require('../models/User');
          const client = await User.findById(booking.clientId);
          if (client) {
            bookingObj.clientId = { _id: client.id, name: client.name, phoneNumber: client.phoneNumber };
          }
        } catch (e) {
          // Ignore populate errors
        }
      }
      
      return bookingObj;
    }));

    res.json(populatedBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('clientId')
      .populate('serviceId')
      .populate('providerId')
      .populate('driverId');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create booking
router.post('/', [
  body('serviceId').notEmpty().withMessage('Service ID is required'),
  body('bookingDate').isISO8601().withMessage('Valid booking date is required'),
  body('bookingTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required (HH:mm)'),
  body('location.latitude').isFloat().withMessage('Valid latitude required'),
  body('location.longitude').isFloat().withMessage('Valid longitude required'),
  body('payment.method').isIn(['online', 'in-person']).withMessage('Valid payment method required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await bookingService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get available dates for a district
router.get('/availability/dates/:district', async (req, res) => {
  try {
    const availability = await bookingService.getAvailableDates(req.params.district);
    res.json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get time slots for a date
router.get('/availability/slots', async (req, res) => {
  try {
    const { date, district } = req.query;
    if (!date || !district) {
      return res.status(400).json({ error: 'Date and district are required' });
    }

    const slots = await bookingService.getTimeSlots(date, district);
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Client requirement: Cancellation must be 48 hours ahead
    if (status === 'cancelled' && booking.status !== 'cancelled') {
      const timezone = process.env.TIMEZONE || 'Asia/Riyadh';
      const now = moment.tz(timezone);
      const bookingDateTime = moment.tz(
        `${moment(booking.bookingDate).format('YYYY-MM-DD')} ${booking.bookingTime}`,
        'YYYY-MM-DD HH:mm',
        timezone
      );
      const hoursUntilBooking = bookingDateTime.diff(now, 'hours', true);

      if (hoursUntilBooking < 48) {
        return res.status(400).json({
          error: `Cancellation must be at least 48 hours before the booking time. ` +
                 `Booking is in ${Math.round(hoursUntilBooking)} hours.`
        });
      }
    }

    booking.status = status;
    booking.updatedAt = new Date();
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create payment intent
router.post('/:id/payment-intent', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('serviceId');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const amount = booking.serviceId.price;
    const result = await paymentService.createPaymentIntent(req.params.id, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel booking (with 48-hour check)
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (req.user.role !== 'admin' && booking.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    // 48-hour cancellation rule
    const timezone = process.env.TIMEZONE || 'Asia/Riyadh';
    const now = moment.tz(timezone);
    const bookingDateTime = moment.tz(
      `${moment(booking.bookingDate).format('YYYY-MM-DD')} ${booking.bookingTime}`,
      'YYYY-MM-DD HH:mm',
      timezone
    );
    const hoursUntilBooking = bookingDateTime.diff(now, 'hours', true);

    if (hoursUntilBooking < 48) {
      return res.status(400).json({
        error: `Cancellation must be at least 48 hours before the booking time. ` +
               `Booking is in ${Math.round(hoursUntilBooking)} hours.`
      });
    }

    booking.status = 'cancelled';
    booking.updatedAt = new Date();
    await booking.save();

    // Note: Refund is admin responsibility (client requirement)
    // Admin can process refund separately via payment service

    res.json({ 
      message: 'Booking cancelled successfully',
      booking,
      note: 'Refund processing is admin responsibility'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
