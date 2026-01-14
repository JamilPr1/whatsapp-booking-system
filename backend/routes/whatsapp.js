const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsappService');
const bookingService = require('../services/bookingService');
const User = require('../models/User');
const Service = require('../models/Service');

// Webhook endpoint for WhatsApp messages (if using WhatsApp Business API)
router.post('/webhook', async (req, res) => {
  try {
    // Handle incoming webhook from WhatsApp Business API
    // This is a placeholder - implement based on your WhatsApp provider
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send test message
router.post('/send', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;
    await whatsappService.sendMessage(phoneNumber, message);
    res.json({ success: true, message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
