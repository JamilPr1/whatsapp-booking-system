const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');

class PaymentService {
  async createPaymentIntent(bookingId, amount, currency = 'sar') {
    try {
      const booking = await Booking.findById(bookingId).populate('serviceId');
      if (!booking) {
        throw new Error('Booking not found');
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          bookingId: bookingId.toString(),
          clientId: booking.clientId.toString()
        },
        automatic_payment_methods: {
          enabled: true
        }
      });

      // Update booking with payment intent ID
      booking.payment.stripePaymentIntentId = paymentIntent.id;
      await booking.save();

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Payment intent creation error:', error);
      throw error;
    }
  }

  async confirmPayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        const booking = await Booking.findOne({
          'payment.stripePaymentIntentId': paymentIntentId
        });

        if (booking) {
          booking.payment.status = 'paid';
          booking.payment.transactionId = paymentIntent.id;
          booking.status = 'confirmed';
          await booking.save();
        }

        return { success: true, booking };
      }

      return { success: false, status: paymentIntent.status };
    } catch (error) {
      console.error('Payment confirmation error:', error);
      throw error;
    }
  }

  async handleWebhook(event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.confirmPayment(event.data.object.id);
          break;
        case 'payment_intent.payment_failed':
          // Handle failed payment
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Webhook handling error:', error);
      throw error;
    }
  }

  async processDeposit(bookingId, depositAmount) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      booking.payment.status = 'partial';
      booking.payment.depositAmount = depositAmount;
      await booking.save();

      return booking;
    } catch (error) {
      console.error('Deposit processing error:', error);
      throw error;
    }
  }
}

const paymentService = new PaymentService();

module.exports = paymentService;
