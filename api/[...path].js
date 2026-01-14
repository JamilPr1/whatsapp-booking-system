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
    
    // Try multiple possible paths for backend
    const possiblePaths = [
      path.join(__dirname, '../backend/app'),      // Root Directory = blank (repo root)
      path.join(process.cwd(), 'backend/app'),     // From project root
      path.join(__dirname, '../../backend/app'),    // Alternative path
      'backend/app'                                 // Relative to cwd
    ];
    
    let backendAppPath = null;
    let backendFound = false;
    
    for (const tryPath of possiblePaths) {
      try {
        const resolvedPath = require.resolve(tryPath, { paths: [__dirname, process.cwd()] });
        if (fs.existsSync(resolvedPath)) {
          backendAppPath = tryPath;
          backendFound = true;
          console.log('Backend found at:', resolvedPath);
          break;
        }
      } catch (e) {
        // Try next path
        continue;
      }
    }
    
    if (!backendFound) {
      // Debug: List all possible paths
      console.error('Backend not found. Debug info:');
      console.error('__dirname:', __dirname);
      console.error('process.cwd():', process.cwd());
      console.error('Tried paths:', possiblePaths);
      
      // Check if backend folder exists at all
      const backendDirPaths = [
        path.join(__dirname, '../backend'),
        path.join(process.cwd(), 'backend'),
        path.join(__dirname, '../../backend')
      ];
      
      for (const dirPath of backendDirPaths) {
        if (fs.existsSync(dirPath)) {
          console.error(`Backend directory exists at: ${dirPath}`);
          console.error('Files in backend:', fs.readdirSync(dirPath));
        }
      }
      
      throw new Error(`Backend module not found. Tried: ${possiblePaths.join(', ')}`);
    }
    
    try {
      // eslint-disable-next-line global-require
      createApp = require(backendAppPath);
      // eslint-disable-next-line global-require
      const dbModule = require(backendAppPath.replace('/app', '/db'));
      connectDB = dbModule.connectDB;
      // eslint-disable-next-line global-require
      const bootstrapModule = require(backendAppPath.replace('/app', '/bootstrapAdmin'));
      ensureBootstrapAdmin = bootstrapModule.ensureBootstrapAdmin;
    } catch (requireErr) {
      console.error('Failed to require backend modules:', requireErr.message);
      throw new Error(`Backend require failed: ${requireErr.message}`);
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

