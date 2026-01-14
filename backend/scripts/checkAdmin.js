const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-booking', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const admin = await User.findOne({ role: 'admin' }).select('+password');
    
    if (!admin) {
      console.log('❌ No admin found');
      return;
    }

    console.log('✅ Admin found:');
    console.log('   Email:', admin.email);
    console.log('   Name:', admin.name);
    console.log('   Has password:', !!admin.password);
    console.log('   Password length:', admin.password ? admin.password.length : 0);
    console.log('   Password starts with:', admin.password ? admin.password.substring(0, 10) : 'N/A');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAdmin();
