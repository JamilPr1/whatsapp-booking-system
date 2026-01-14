const dotenv = require('dotenv');
const cron = require('node-cron');

dotenv.config();

const createApp = require('./app');
const { connectDB } = require('./db');
const { sendDailyNotifications } = require('./services/notificationService');
const whatsappService = require('./services/whatsappService');
const { ensureBootstrapAdmin } = require('./bootstrapAdmin');

const app = createApp();
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => console.log('✅ Supabase connected'))
  .catch((err) => {
    console.error('❌ Supabase connection error:', err.message);
    console.error('💡 Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in env vars');
  });

// Optional: auto-create first admin if ADMIN_EMAIL/ADMIN_PASSWORD are set
ensureBootstrapAdmin().catch((err) => {
  console.warn('⚠️ Admin bootstrap skipped/failed:', err.message);
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
