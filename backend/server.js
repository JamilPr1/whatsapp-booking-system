const dotenv = require('dotenv');
const cron = require('node-cron');

dotenv.config();

const createApp = require('./app');
const { connectDB } = require('./db');
const { sendDailyNotifications } = require('./services/notificationService');
const whatsappService = require('./services/whatsappService');

const app = createApp();
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('💡 Make sure MongoDB is running or check your MONGODB_URI in env vars');
  });

// Schedule daily notifications at 23:59 Riyadh time
cron.schedule('59 23 * * *', () => {
  console.log('📅 Running daily notification job...');
  sendDailyNotifications();
}, {
  timezone: process.env.TIMEZONE || 'Asia/Riyadh'
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 WhatsApp booking system ready`);
  
  // Initialize WhatsApp service (optional - can be disabled if using Business API)
  if (process.env.INIT_WHATSAPP !== 'false') {
    try {
      await whatsappService.initialize();
    } catch (error) {
      console.warn('⚠️ WhatsApp service initialization skipped:', error.message);
      console.log('💡 Set INIT_WHATSAPP=false in .env to disable WhatsApp Web.js');
    }
  }
});

module.exports = app;
