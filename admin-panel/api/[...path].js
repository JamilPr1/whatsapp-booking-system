// Vercel Serverless Function - tries to use backend if available, otherwise proxies to BACKEND_URL
//
// This function works in 2 modes:
// 1) Root Directory = repo root -> backend is available via ../../backend
// 2) Root Directory = admin-panel -> requires BACKEND_URL env var

module.exports = async (req, res) => {
  try {
    // Log incoming request for debugging
    console.log('API Request:', { method: req.method, url: req.url, originalUrl: req.originalUrl });
    
    // Normalize URL
    if (req.url && !req.url.startsWith('/api')) {
      req.url = `/api${req.url}`;
    }

    // Health check - always works
    if (req.method === 'GET' && (req.url === '/api/health' || req.url === '/api/health/')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(
        JSON.stringify({
          ok: true,
          ts: new Date().toISOString(),
          hasMongoUri: Boolean(process.env.MONGODB_URI),
          hasJwtSecret: Boolean(process.env.JWT_SECRET),
          hasBackendUrl: Boolean(process.env.BACKEND_URL)
        })
      );
      return;
    }

    // Try to use local backend first (when Root Directory = repo root)
    try {
      // eslint-disable-next-line global-require
      const createApp = require('../../backend/app');
      // eslint-disable-next-line global-require
      const { connectDB } = require('../../backend/db');
      // eslint-disable-next-line global-require
      const { ensureBootstrapAdmin } = require('../../backend/bootstrapAdmin');

      await connectDB();
      await ensureBootstrapAdmin();

      const app = createApp();
      
      // Express app handles Vercel req/res directly
      // Set originalUrl if not set (Express needs this for routing)
      if (!req.originalUrl) {
        req.originalUrl = req.url;
      }
      
      // Ensure baseUrl is set for Express routing
      if (!req.baseUrl) {
        req.baseUrl = '';
      }
      
      return app(req, res);
    } catch (localErr) {
      // Log error for debugging
      console.error('Local backend load failed:', localErr.message, localErr.stack);
      // Backend not available locally, will try proxy
    }

    // Fallback to proxy mode (when Root Directory = admin-panel)
    const backend = process.env.BACKEND_URL;
    if (!backend) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(
        JSON.stringify({
          error:
            'Backend not available. Ya to Vercel Root Directory ko repo root pe set karein, ya BACKEND_URL environment variable set karein.'
        })
      );
      return;
    }

    // Proxy to external backend
    const backendBase = backend.endsWith('/') ? backend.slice(0, -1) : backend;
    const path = req.url && req.url.startsWith('/api') ? req.url : `/api${req.url || ''}`;
    const targetUrl = `${backendBase}${path}`;

    const headers = { ...req.headers };
    delete headers.connection;
    delete headers.host;
    delete headers['content-length'];

    let body;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const chunks = [];
      // eslint-disable-next-line no-restricted-syntax
      for await (const chunk of req) chunks.push(chunk);
      body = chunks.length > 0 ? Buffer.concat(chunks) : undefined;
    }

    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers,
      body
    });

    res.statusCode = upstream.status;
    const contentType = upstream.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);

    const text = await upstream.text();
    res.end(text);
  } catch (err) {
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

