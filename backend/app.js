const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables for local development (on hosts like Vercel/Railway, env vars are already provided)
dotenv.config();

// Import routes
// Auth routes are safe to load immediately (only uses Supabase User model)
const authRoutes = require('./routes/auth');

// Other routes use Mongoose models - lazy load them to avoid startup errors
// These will only be loaded when the routes are actually accessed
let bookingRoutes, serviceRoutes, adminRoutes, paymentRoutes;

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
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) return callback(null, true);
      
      // Allow all Vercel deployment URLs (*.vercel.app)
      if (origin && typeof origin === 'string' && origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      
      // Log blocked origin for debugging
      console.warn(`CORS blocked for origin: ${origin}. Allowed origins:`, allowedOrigins);
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
  
  // Seed route (for demo data - can be protected later)
  app.use('/api/seed', require('./routes/seed'));
  
  // Lazy-load routes that depend on Mongoose models
  // This allows the app to start even if Mongoose models aren't migrated yet
  app.use('/api/bookings', (req, res, next) => {
    if (!bookingRoutes) {
      try {
        bookingRoutes = require('./routes/bookings');
      } catch (err) {
        console.error('Failed to load bookings routes:', err.message);
        return res.status(503).json({ 
          error: 'Bookings feature not available - models not migrated to Supabase yet' 
        });
      }
    }
    return bookingRoutes(req, res, next);
  });
  
  app.use('/api/services', (req, res, next) => {
    if (!serviceRoutes) {
      try {
        serviceRoutes = require('./routes/services');
      } catch (err) {
        console.error('Failed to load services routes:', err.message);
        return res.status(503).json({ 
          error: 'Services feature not available - models not migrated to Supabase yet' 
        });
      }
    }
    return serviceRoutes(req, res, next);
  });
  
  app.use('/api/admin', (req, res, next) => {
    if (!adminRoutes) {
      try {
        adminRoutes = require('./routes/admin');
      } catch (err) {
        console.error('Failed to load admin routes:', err.message);
        return res.status(503).json({ 
          error: 'Admin features not available - models not migrated to Supabase yet' 
        });
      }
    }
    return adminRoutes(req, res, next);
  });
  
  app.use('/api/payments', (req, res, next) => {
    if (!paymentRoutes) {
      try {
        paymentRoutes = require('./routes/payments');
      } catch (err) {
        console.error('Failed to load payments routes:', err.message);
        return res.status(503).json({ 
          error: 'Payments feature not available' 
        });
      }
    }
    return paymentRoutes(req, res, next);
  });

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
    res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'whatsapp-booking-system', environment: process.env.NODE_ENV || 'production' });
  });

  // 404 handler for unmatched routes (must be after all routes)
  app.use((req, res) => {
    console.error('404 - Route not found:', req.method, req.url, req.originalUrl);
    res.status(404).json({ error: 'Route not found', method: req.method, path: req.url, originalUrl: req.originalUrl });
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

