const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

async function resetAdminPassword() {
  try {
    console.log('🔐 Resetting admin password...');

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-booking', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to database');

    // Find or create admin
    let admin = await User.findOne({ role: 'admin' });
    const newPassword = 'Admin123!';

    if (admin) {
      // Update existing admin password
      // Set plaintext; the User model pre-save hook will hash it once.
      admin.password = newPassword;
      admin.email = 'admin@example.com';
      admin.name = 'Admin User';
      await admin.save();
      console.log('✅ Admin password reset successfully!');
    } else {
      // Create new admin
      admin = new User({
        email: 'admin@example.com',
        // Set plaintext; the User model pre-save hook will hash it once.
        password: newPassword,
        name: 'Admin User',
        role: 'admin',
        isActive: true
      });
      await admin.save();
      console.log('✅ Admin account created!');
    }

    console.log('\n📋 Admin Credentials:');
    console.log('   Email: admin@example.com');
    console.log('   Password: Admin123!');
    console.log('\n✅ You can now login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    process.exit(1);
  }
}

resetAdminPassword();
