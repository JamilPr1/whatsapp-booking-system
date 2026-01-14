const createApp = require('../backend/app');
const { connectDB } = require('../backend/db');

const app = createApp();

module.exports = async (req, res) => {
  // Ensure DB is connected (connection is cached between invocations when possible)
  await connectDB();

  // Depending on Vercel routing, req.url might be "/auth/login" instead of "/api/auth/login"
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url}`;
  }

  return app(req, res);
};

