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
    // eslint-disable-next-line global-require
    const createApp = require('../backend/app');
    // eslint-disable-next-line global-require
    const { connectDB } = require('../backend/db');
    // eslint-disable-next-line global-require
    const { ensureBootstrapAdmin } = require('../backend/bootstrapAdmin');

    // Ensure DB is connected (connection is cached between invocations when possible)
    await connectDB();
    // Ensure an admin exists (if ADMIN_EMAIL/ADMIN_PASSWORD provided)
    await ensureBootstrapAdmin();

    const app = createApp();
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

