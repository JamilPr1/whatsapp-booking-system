const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Stripe webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await paymentService.handleWebhook(event);
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handling error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment
router.post('/confirm', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const result = await paymentService.confirmPayment(paymentIntentId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
