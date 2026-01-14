const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables for local development (on hosts like Vercel/Railway, env vars are already provided)
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const serviceRoutes = require('./routes/services');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payments');

function buildCorsOptions() {
  const frontendOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // Vercel provides VERCEL_URL as "<project>.vercel.app" (no protocol)
  if (process.env.VERCEL_URL) {
    frontendOrigins.push(`https://${process.env.VERCEL_URL}`);
  }

  // Always allow local dev
  frontendOrigins.push('http://localhost:3000');

  const allowedOrigins = Array.from(new Set(frontendOrigins));

  return {
    origin: (origin, callback) => {
      // Allow same-origin / server-to-server requests (no Origin header)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  };
}

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors(buildCorsOptions()));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/auth', authRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/payments', paymentRoutes);

  // WhatsApp Web.js is not suitable for serverless (Puppeteer/Chrome). Keep it opt-in.
  if (process.env.ENABLE_WHATSAPP_WEB === 'true') {
    // Lazy require so Vercel doesn't crash when WhatsApp is disabled
    // eslint-disable-next-line global-require
    const whatsappRoutes = require('./routes/whatsapp');
    app.use('/api/whatsapp', whatsappRoutes);
  } else {
    app.use('/api/whatsapp', (req, res) => {
      res.status(503).json({ error: 'WhatsApp Web integration is disabled on this deployment' });
    });
  }

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Error handling middleware
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  });

  return app;
}

module.exports = createApp;

