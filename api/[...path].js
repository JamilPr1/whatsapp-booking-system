const createApp = require('../backend/app');
const { connectDB } = require('../backend/db');
const { ensureBootstrapAdmin } = require('../backend/bootstrapAdmin');

const app = createApp();

module.exports = async (req, res) => {
  try {
    // Ensure DB is connected (connection is cached between invocations when possible)
    await connectDB();
    // Ensure an admin exists (if ADMIN_EMAIL/ADMIN_PASSWORD provided)
    await ensureBootstrapAdmin();
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: String(err?.message || err) }));
    return;
  }

  // Depending on Vercel routing, req.url might be "/auth/login" instead of "/api/auth/login"
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url}`;
  }

  return app(req, res);
};

