const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const Service = require('../models/Service');

// All routes require admin authentication
router.use(auth);
router.use((req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
});

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = {
      totalBookings: await Booking.countDocuments(),
      pendingBookings: await Booking.countDocuments({ status: 'pending' }),
      confirmedBookings: await Booking.countDocuments({ status: 'confirmed' }),
      completedBookings: await Booking.countDocuments({ status: 'completed' }),
      totalClients: await User.countDocuments({ role: 'client' }),
      totalServices: await Service.countDocuments({ isActive: true }),
      upcomingBookings: (await Booking.countDocuments({
        bookingDate: { $gte: today },
        status: { $in: ['pending', 'confirmed'] }
      })) || 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ sort: { createdAt: -1 } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.patch('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all schedules
router.get('/schedules', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const schedules = await Schedule.find(query);
    // Note: populate is not needed - bookings are stored as UUID array in Supabase

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unlock schedule (exception handling)
router.patch('/schedules/:id/unlock', async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    schedule.isLocked = false;
    await schedule.save();

    res.json({ message: 'Schedule unlocked', schedule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exception: Override district for a date
router.patch('/schedules/:id/district', async (req, res) => {
  try {
    const { district } = req.body;
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    schedule.district = district;
    await schedule.save();

    res.json({ message: 'District updated', schedule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
