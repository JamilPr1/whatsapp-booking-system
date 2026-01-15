const express = require('express');
const router = express.Router();
const { connectDB } = require('../db');
const User = require('../models/User');
const Booking = require('../models/Booking');
const { getSupabaseClient } = require('../db');

// Cleanup endpoint - removes excess clients and ensures exactly 10 demo clients
router.post('/cleanup', async (req, res) => {
  try {
    await connectDB();
    const supabase = getSupabaseClient();
    
    // Get all clients
    const allClients = await User.find({ role: 'client' });
    console.log(`Found ${allClients.length} clients`);
    
    if (allClients.length <= 10) {
      return res.json({
        success: true,
        message: `Only ${allClients.length} clients found, no cleanup needed`,
        clientsRemaining: allClients.length
      });
    }
    
    // Keep first 10, delete the rest
    const clientsToKeep = allClients.slice(0, 10);
    const clientsToDelete = allClients.slice(10);
    
    let deletedCount = 0;
    for (const client of clientsToDelete) {
      try {
        await supabase.from('users').delete().eq('id', client.id);
        deletedCount++;
        console.log(`Deleted client: ${client.name} (${client.id})`);
      } catch (error) {
        console.error(`Error deleting client ${client.id}:`, error.message);
      }
    }
    
    res.json({
      success: true,
      message: `Cleanup completed`,
      clientsBefore: allClients.length,
      clientsDeleted: deletedCount,
      clientsRemaining: clientsToKeep.length
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Force reseed bookings (if they're missing)
router.post('/reseed-bookings', async (req, res) => {
  try {
    await connectDB();
    
    const existingBookings = await Booking.countDocuments();
    if (existingBookings >= 10) {
      return res.json({
        success: true,
        message: `Already have ${existingBookings} bookings, no reseed needed`,
        bookingsCount: existingBookings
      });
    }
    
    // Import and run demo data seeding for bookings only
    const { ensureDemoData } = require('../bootstrapDemoData');
    const result = await ensureDemoData();
    
    res.json({
      success: true,
      message: 'Bookings reseeded',
      result
    });
  } catch (error) {
    console.error('Reseed error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
