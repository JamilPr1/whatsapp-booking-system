module.exports = async (req, res) => {
  try {
    // Depending on Vercel routing, req.url might be "/auth/login" instead of "/api/auth/login"
    if (req.url && !req.url.startsWith('/api')) {
      req.url = `/api${req.url}`;
    }

    // Health check should never depend on DB availability
    if (req.method === 'GET' && (req.url === '/api/health' || req.url === '/api/health/')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(
        JSON.stringify({
          ok: true,
          ts: new Date().toISOString(),
          hasMongoUri: Boolean(process.env.MONGODB_URI),
          hasJwtSecret: Boolean(process.env.JWT_SECRET)
        })
      );
      return;
    }

    // Lazy-load backend dependencies so /api/health can't crash on import
    let createApp, connectDB, ensureBootstrapAdmin;
    
    try {
      // eslint-disable-next-line global-require
      createApp = require('../backend/app');
      // eslint-disable-next-line global-require
      const dbModule = require('../backend/db');
      connectDB = dbModule.connectDB;
      // eslint-disable-next-line global-require
      const bootstrapModule = require('../backend/bootstrapAdmin');
      ensureBootstrapAdmin = bootstrapModule.ensureBootstrapAdmin;
    } catch (requireErr) {
      console.error('Failed to require backend modules:', requireErr.message);
      console.error('__dirname:', __dirname);
      console.error('process.cwd():', process.cwd());
      const fs = require('fs');
      const path = require('path');
      const backendPath = path.join(__dirname, '../backend');
      console.error('Backend path:', backendPath);
      console.error('Backend exists:', fs.existsSync(backendPath));
      if (fs.existsSync(backendPath)) {
        console.error('Backend files:', fs.readdirSync(backendPath));
      }
      throw new Error(`Backend not found: ${requireErr.message}. Path: ${backendPath}`);
    }

    // Ensure DB is connected (connection is cached between invocations when possible)
    await connectDB();
    // Ensure an admin exists (if ADMIN_EMAIL/ADMIN_PASSWORD provided)
    await ensureBootstrapAdmin();

    const app = createApp();
    
    // Set Express routing properties
    if (!req.originalUrl) {
      req.originalUrl = req.url;
    }
    if (!req.baseUrl) {
      req.baseUrl = '';
    }
    
    return app(req, res);
  } catch (err) {
    // Never crash the function — always return a JSON error
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(
      JSON.stringify({
        error: String(err?.message || err),
        path: req?.url,
        method: req?.method
      })
    );
  }
};

