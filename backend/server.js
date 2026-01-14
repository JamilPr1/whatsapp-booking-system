const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const cron = require('node-cron');
const moment = require('moment-timezone');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const serviceRoutes = require('./routes/services');
const adminRoutes = require('./routes/admin');
const whatsappRoutes = require('./routes/whatsapp');
const paymentRoutes = require('./routes/payments');

// Import services
const { sendDailyNotifications } = require('./services/notificationService');
const whatsappService = require('./services/whatsappService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL 
    ? [process.env.FRONTEND_URL, 'http://localhost:3000']
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-booking';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 10s
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('💡 Make sure MongoDB is running or check your MONGODB_URI in .env');
  console.error('💡 For cloud MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/dbname');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Schedule daily notifications at 23:59 Riyadh time
cron.schedule('59 23 * * *', () => {
  console.log('📅 Running daily notification job...');
  sendDailyNotifications();
}, {
  timezone: process.env.TIMEZONE || 'Asia/Riyadh'
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
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
