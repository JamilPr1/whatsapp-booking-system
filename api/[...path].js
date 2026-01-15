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
    
    const fs = require('fs');
    const path = require('path');
    
    // In Vercel, __dirname points to /var/task/api, so backend is at /var/task/backend
    // Try multiple possible paths for backend
    const possibleBackendDirs = [
      path.join(__dirname, '../backend'),           // Most common: api/ -> backend/
      path.join(process.cwd(), 'backend'),          // From project root
      path.join(__dirname, '../../backend'),         // Alternative: api/../backend
      path.resolve(__dirname, '../backend')         // Absolute resolution
    ];
    
    let backendDir = null;
    let backendFound = false;
    
    // Find backend directory first
    for (const dirPath of possibleBackendDirs) {
      if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        backendDir = dirPath;
        backendFound = true;
        console.log('Backend directory found at:', backendDir);
        break;
      }
    }
    
    if (!backendFound) {
      // Debug: List all possible paths
      console.error('Backend directory not found. Debug info:');
      console.error('__dirname:', __dirname);
      console.error('process.cwd():', process.cwd());
      console.error('Tried backend dirs:', possibleBackendDirs);
      
      // List files in parent directories for debugging
      try {
        const parentDir = path.dirname(__dirname);
        console.error('Parent dir exists:', fs.existsSync(parentDir));
        if (fs.existsSync(parentDir)) {
          console.error('Files in parent:', fs.readdirSync(parentDir));
        }
      } catch (e) {
        console.error('Could not read parent dir:', e.message);
      }
      
      throw new Error(`Backend directory not found. Tried: ${possibleBackendDirs.join(', ')}`);
    }
    
    // Now require modules using the found backend directory
    try {
      const appPath = path.join(backendDir, 'app');
      const dbPath = path.join(backendDir, 'db');
      const bootstrapPath = path.join(backendDir, 'bootstrapAdmin');
      
      // eslint-disable-next-line global-require
      createApp = require(appPath);
      // eslint-disable-next-line global-require
      const dbModule = require(dbPath);
      connectDB = dbModule.connectDB;
      // eslint-disable-next-line global-require
      const bootstrapModule = require(bootstrapPath);
      ensureBootstrapAdmin = bootstrapModule.ensureBootstrapAdmin;
      
      console.log('Backend modules loaded successfully');
    } catch (requireErr) {
      console.error('Failed to require backend modules:', requireErr.message);
      console.error('Stack:', requireErr.stack);
      throw new Error(`Backend require failed: ${requireErr.message}`);
    }

    // Ensure DB is connected (connection is cached between invocations when possible)
    await connectDB();
    // Ensure an admin exists (if ADMIN_EMAIL/ADMIN_PASSWORD provided)
    await ensureBootstrapAdmin();
    
    // Automatically seed demo data if database is empty
    try {
      // eslint-disable-next-line global-require
      const demoDataModule = require(path.join(backendDir, 'bootstrapDemoData'));
      const { ensureDemoData } = demoDataModule;
      await ensureDemoData();
    } catch (demoErr) {
      // Don't fail if demo data seeding fails
      console.warn('Demo data seeding skipped:', demoErr.message);
    }

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

