const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

class WhatsAppService {
  constructor() {
    this.client = null;
    this.isReady = false;
    this.messageHandlers = new Map();
  }

  async initialize() {
    try {
      this.client = new Client({
        authStrategy: new LocalAuth({
          dataPath: process.env.WHATSAPP_SESSION_PATH || './.whatsapp-session'
        }),
        puppeteer: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      });

      this.client.on('qr', (qr) => {
        console.log('📱 WhatsApp QR Code:');
        qrcode.generate(qr, { small: true });
      });

      this.client.on('ready', () => {
        console.log('✅ WhatsApp client is ready!');
        this.isReady = true;
      });

      this.client.on('authenticated', () => {
        console.log('✅ WhatsApp authenticated');
      });

      this.client.on('auth_failure', (msg) => {
        console.error('❌ WhatsApp authentication failure:', msg);
        this.isReady = false;
      });

      this.client.on('disconnected', (reason) => {
        console.log('⚠️ WhatsApp disconnected:', reason);
        this.isReady = false;
      });

      // Handle incoming messages
      this.client.on('message', async (message) => {
        await this.handleIncomingMessage(message);
      });

      await this.client.initialize();
    } catch (error) {
      console.error('❌ WhatsApp initialization error:', error);
      throw error;
    }
  }

  async handleIncomingMessage(message) {
    try {
      const from = message.from;
      const body = message.body.toLowerCase().trim();
      const hasMedia = message.hasMedia;

      // Handle location sharing
      if (message.type === 'location') {
        const location = message.location;
        await this.handleLocationMessage(from, location);
        return;
      }

      // Handle text messages with interactive menu
      await this.processMenuResponse(from, body, message);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  async processMenuResponse(phoneNumber, messageBody, message) {
    // This will be implemented based on booking flow
    // For now, basic structure
    const handler = this.messageHandlers.get(phoneNumber);
    if (handler) {
      await handler(messageBody, message);
    } else {
      // Start new booking flow
      await this.startBookingFlow(phoneNumber, message);
    }
  }

  async startBookingFlow(phoneNumber, message) {
    const welcomeMessage = `👋 Welcome! I'm here to help you book an on-site service.

Please choose an option:
1️⃣ *Book Service* - Start a new booking
2️⃣ *My Bookings* - View your existing bookings
3️⃣ *Help* - Get assistance

Reply with the number or option name.`;

    await this.sendMessage(phoneNumber, welcomeMessage);
  }

  async handleLocationMessage(phoneNumber, location) {
    // This will trigger district mapping and continue booking flow
    console.log('Location received:', location);
    // Implementation will be in booking service
  }

  async sendMessage(phoneNumber, message, options = {}) {
    try {
      if (!this.isReady) {
        throw new Error('WhatsApp client is not ready');
      }

      const chatId = phoneNumber.includes('@c.us') 
        ? phoneNumber 
        : `${phoneNumber}@c.us`;

      await this.client.sendMessage(chatId, message, options);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  async sendMessageWithButtons(phoneNumber, message, buttons) {
    // WhatsApp Web.js doesn't support native buttons, but we can use structured messages
    // For production, consider using WhatsApp Business API
    await this.sendMessage(phoneNumber, message);
  }

  async sendLocation(phoneNumber, latitude, longitude) {
    try {
      const chatId = phoneNumber.includes('@c.us') 
        ? phoneNumber 
        : `${phoneNumber}@c.us`;

      await this.client.sendMessage(chatId, new MessageMedia('image/png', ''), {
        location: { latitude, longitude }
      });
    } catch (error) {
      console.error('Error sending location:', error);
      throw error;
    }
  }

  // Alternative: Use Twilio WhatsApp API for production
  async sendMessageViaTwilio(phoneNumber, message) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_WHATSAPP_NUMBER;

    try {
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        new URLSearchParams({
          From: from,
          To: `whatsapp:${phoneNumber}`,
          Body: message
        }),
        {
          auth: {
            username: accountSid,
            password: authToken
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Twilio WhatsApp error:', error);
      throw error;
    }
  }
}

// Singleton instance
const whatsappService = new WhatsAppService();

module.exports = whatsappService;
