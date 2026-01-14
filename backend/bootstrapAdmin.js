const User = require('./models/User');

/**
 * If no admin exists, create one from environment variables:
 * - ADMIN_EMAIL
 * - ADMIN_PASSWORD
 * - ADMIN_NAME (optional)
 *
 * This is useful for serverless deployments (Vercel) where you can't easily run seed scripts.
 */
async function ensureBootstrapAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  const name = process.env.ADMIN_NAME || 'Admin User';

  if (!email || !password) {
    return { created: false, reason: 'ADMIN_EMAIL/ADMIN_PASSWORD not set' };
  }

  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    return { created: false, reason: 'Admin already exists' };
  }

  const admin = new User({
    email,
    password, // plaintext; User.save() hashes it
    name,
    role: 'admin',
    isActive: true
  });

  await admin.save();

  return { created: true, email };
}

module.exports = { ensureBootstrapAdmin };
