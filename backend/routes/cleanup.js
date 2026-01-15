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
    
    // Keep only 5-7 clients for demo
    const targetClientCount = 5;
    
    if (allClients.length <= targetClientCount) {
      return res.json({
        success: true,
        message: `Only ${allClients.length} clients found, no cleanup needed`,
        clientsRemaining: allClients.length
      });
    }
    
    // Keep first 5, delete the rest
    const clientsToKeep = allClients.slice(0, targetClientCount);
    const clientsToDelete = allClients.slice(targetClientCount);
    
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
    
    // Use the clean seedDemoData function
    const { seedDemoData } = require('../seedDemoData');
    const result = await seedDemoData();
    
    res.json({
      success: true,
      message: 'Bookings reseeded',
      result
    });
  } catch (error) {
    console.error('Reseed error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Force create demo data - cleanup and reseed everything
router.post('/force-demo-data', async (req, res) => {
  try {
    await connectDB();
    const supabase = getSupabaseClient();
    
    console.log('🧹 Starting force demo data creation...');
    
    // Step 1: Clean up excess clients (keep only 5)
    const allClients = await User.find({ role: 'client' });
    let clientsDeleted = 0;
    if (allClients.length > 5) {
      const clientsToDelete = allClients.slice(5);
      for (const client of clientsToDelete) {
        await supabase.from('users').delete().eq('id', client.id);
        clientsDeleted++;
      }
      console.log(`✅ Cleaned up ${clientsDeleted} excess clients`);
    }
    
    // Step 2: Delete all existing bookings to start fresh
    const existingBookings = await Booking.find({});
    let bookingsDeleted = 0;
    for (const booking of existingBookings) {
      await supabase.from('bookings').delete().eq('id', booking.id);
      bookingsDeleted++;
    }
    console.log(`✅ Deleted ${bookingsDeleted} existing bookings`);
    
    // Step 3: Delete all schedules
    const Schedule = require('../models/Schedule');
    const existingSchedules = await Schedule.find({});
    let schedulesDeleted = 0;
    for (const schedule of existingSchedules) {
      await supabase.from('schedules').delete().eq('id', schedule.id);
      schedulesDeleted++;
    }
    console.log(`✅ Deleted ${schedulesDeleted} existing schedules`);
    
    // Step 4: Force seed using clean function
    const { seedDemoData } = require('../seedDemoData');
    const result = await seedDemoData();
    
    res.json({
      success: true,
      message: 'Demo data force created successfully!',
      result,
      cleanup: {
        clientsDeleted,
        bookingsDeleted,
        schedulesDeleted
      }
    });
  } catch (error) {
    console.error('Force demo data error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
