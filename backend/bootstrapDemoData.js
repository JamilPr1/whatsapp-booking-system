const { seedDemoData } = require('./seedDemoData');

/**
 * Automatically seed demo data if database is empty
 * This runs on startup to ensure there's data for testing
 * Uses the clean seedDemoData function
 */
async function ensureDemoData() {
  try {
    // Check if we already have 10 bookings and 5 clients
    const Booking = require('./models/Booking');
    const User = require('./models/User');
    
    const existingBookings = await Booking.countDocuments();
    const clientCount = await User.countDocuments({ role: 'client' });
    
    // If we have exactly 10 bookings and 5 or fewer clients, we're good
    if (existingBookings === 10 && clientCount <= 5) {
      console.log(`✅ Demo data already exists (${existingBookings} bookings, ${clientCount} clients)`);
      return { seeded: false, reason: 'Data already exists', existingBookings, clientCount };
    }
    
    // Otherwise, clean up and reseed
    console.log(`⚠️  Data incomplete (${existingBookings} bookings, ${clientCount} clients), reseeding...`);
    const result = await seedDemoData();
    return { seeded: true, ...result };
  } catch (error) {
    console.error('❌ Error in ensureDemoData:', error.message);
    console.error('Stack:', error.stack);
    // Don't throw - allow app to continue
    return { seeded: false, error: error.message };
  }
}

module.exports = { ensureDemoData };
