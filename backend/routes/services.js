const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// Get all active services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate('parentService', 'name')
      .sort({ category: 1, name: 1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create service (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update service (admin only)
router.patch('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete service (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Service deactivated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
