const { connectDB, getSupabaseClient } = require('./db');
const User = require('./models/User');
const Service = require('./models/Service');
const Booking = require('./models/Booking');
const Schedule = require('./models/Schedule');
const moment = require('moment-timezone');

const timezone = process.env.TIMEZONE || 'Asia/Riyadh';

/**
 * Clean and simple demo data seeding
 * This function ensures we have exactly:
 * - 5 clients
 * - 4 services  
 * - 10 bookings
 * - Schedules for booking dates
 */
async function seedDemoData() {
  try {
    await connectDB();
    const supabase = getSupabaseClient();
    
    console.log('🧹 Starting clean demo data seeding...');
    
    // Step 1: Clean up excess clients (keep only 5)
    const allClients = await User.find({ role: 'client' });
    if (allClients.length > 5) {
      console.log(`Cleaning up ${allClients.length - 5} excess clients...`);
      for (const client of allClients.slice(5)) {
        await supabase.from('users').delete().eq('id', client.id);
      }
    }
    
    // Step 2: Delete all existing bookings and schedules
    const existingBookings = await Booking.find({});
    for (const booking of existingBookings) {
      await supabase.from('bookings').delete().eq('id', booking.id);
    }
    console.log(`Deleted ${existingBookings.length} existing bookings`);
    
    const existingSchedules = await Schedule.find({});
    for (const schedule of existingSchedules) {
      await supabase.from('schedules').delete().eq('id', schedule.id);
    }
    console.log(`Deleted ${existingSchedules.length} existing schedules`);
    
    // Step 3: Ensure we have provider and driver
    let provider = await User.findOne({ role: 'provider' });
    if (!provider) {
      provider = new User({
        name: 'Service Provider',
        phoneNumber: '+966501234567',
        email: 'provider@example.com',
        role: 'provider',
        isActive: true
      });
      await provider.save();
    }
    
    let driver = await User.findOne({ role: 'driver' });
    if (!driver) {
      driver = new User({
        name: 'Driver Ali',
        phoneNumber: '+966507654321',
        email: 'driver@example.com',
        role: 'driver',
        isActive: true
      });
      await driver.save();
    }
    
    // Step 4: Ensure we have exactly 5 clients
    const currentClients = await User.find({ role: 'client' });
    const clientData = [
      { name: 'Ahmed Al-Saud', phoneNumber: '+966501111111', location: { latitude: 24.7136, longitude: 46.6753, address: 'King Fahd Road, Al Olaya, Riyadh', district: 'Al Olaya' } },
      { name: 'Fatima Al-Rashid', phoneNumber: '+966502222222', location: { latitude: 24.6508, longitude: 46.7144, address: 'Prince Sultan Road, Al Malaz, Riyadh', district: 'Al Malaz' } },
      { name: 'Mohammed Al-Zahrani', phoneNumber: '+966503333333', location: { latitude: 24.6877, longitude: 46.7219, address: 'King Abdulaziz Road, Al Wurud, Riyadh', district: 'Al Wurud' } },
      { name: 'Sara Al-Mutairi', phoneNumber: '+966504444444', location: { latitude: 24.7000, longitude: 46.6800, address: 'Olaya Street, Riyadh', district: 'Al Olaya' } },
      { name: 'Khalid Al-Otaibi', phoneNumber: '+966505555555', location: { latitude: 24.6400, longitude: 46.7200, address: 'Malaz District, Riyadh', district: 'Al Malaz' } }
    ];
    
    const clients = [];
    for (let i = 0; i < 5; i++) {
      let client = currentClients.find(c => c.phoneNumber === clientData[i].phoneNumber);
      if (!client) {
        client = new User({
          ...clientData[i],
          role: 'client',
          isActive: true
        });
        await client.save();
      }
      clients.push(client);
    }
    
    // Step 5: Ensure we have 4 services
    const currentServices = await Service.find({ isActive: true });
    const serviceData = [
      { name: 'Home Cleaning Service', description: 'Complete home cleaning', category: 'main', duration: 120, price: 250, depositAmount: 50, isActive: true },
      { name: 'Deep Cleaning', description: 'Intensive deep cleaning', category: 'sub', duration: 180, price: 400, depositAmount: 100, isActive: true },
      { name: 'Office Cleaning', description: 'Professional office cleaning', category: 'main', duration: 90, price: 300, depositAmount: 75, isActive: true },
      { name: 'Window Cleaning', description: 'Professional window cleaning', category: 'sub', duration: 60, price: 150, depositAmount: 30, isActive: true }
    ];
    
    const services = [];
    for (const serviceInfo of serviceData) {
      let service = currentServices.find(s => s.name === serviceInfo.name);
      if (!service) {
        service = new Service(serviceInfo);
        await service.save();
      }
      services.push(service);
    }
    
    // Step 6: Create 10 bookings
    const today = moment.tz(timezone);
    const bookings = [];
    const scheduleMap = new Map();
    
    const bookingConfigs = [
      { days: 1, time: '10:00', clientIdx: 0, serviceIdx: 0, district: 'Al Olaya', status: 'confirmed', payment: { method: 'online', status: 'paid', amount: 250, depositAmount: 0, transactionId: 'demo_001' } },
      { days: 2, time: '14:00', clientIdx: 1, serviceIdx: 1, district: 'Al Malaz', status: 'pending', payment: { method: 'in-person', status: 'pending', amount: 400, depositAmount: 0 } },
      { days: 3, time: '09:00', clientIdx: 2, serviceIdx: 2, district: 'Al Wurud', status: 'confirmed', payment: { method: 'online', status: 'paid', amount: 300, depositAmount: 75, transactionId: 'demo_002' } },
      { days: 4, time: '11:30', clientIdx: 0, serviceIdx: 3, district: 'Al Olaya', status: 'pending', payment: { method: 'in-person', status: 'pending', amount: 150, depositAmount: 0 } },
      { days: 5, time: '15:00', clientIdx: 1, serviceIdx: 0, district: 'Al Malaz', status: 'in-progress', payment: { method: 'online', status: 'partial', amount: 250, depositAmount: 50, transactionId: 'demo_003' } },
      { days: 6, time: '13:00', clientIdx: 2, serviceIdx: 1, district: 'Al Wurud', status: 'completed', payment: { method: 'online', status: 'paid', amount: 400, depositAmount: 0, transactionId: 'demo_004' } },
      { days: 7, time: '08:00', clientIdx: 3, serviceIdx: 2, district: 'Al Olaya', status: 'confirmed', payment: { method: 'online', status: 'paid', amount: 300, depositAmount: 75, transactionId: 'demo_005' } },
      { days: 8, time: '16:00', clientIdx: 4, serviceIdx: 3, district: 'Al Malaz', status: 'pending', payment: { method: 'in-person', status: 'pending', amount: 150, depositAmount: 0 } },
      { days: 0, time: '12:00', clientIdx: 2, serviceIdx: 0, district: 'Al Wurud', status: 'in-progress', payment: { method: 'online', status: 'partial', amount: 250, depositAmount: 50, transactionId: 'demo_006' } },
      { days: -1, time: '14:30', clientIdx: 0, serviceIdx: 1, district: 'Al Olaya', status: 'completed', payment: { method: 'online', status: 'paid', amount: 400, depositAmount: 0, transactionId: 'demo_007' } }
    ];
    
    for (const config of bookingConfigs) {
      try {
        const bookingDate = today.clone().add(config.days, 'days');
        const client = clients[config.clientIdx];
        const service = services[config.serviceIdx];
        
        if (!client || !client.id || !service || !service.id) {
          console.error(`Missing client or service for booking ${config.days} days`);
          continue;
        }
        
        const location = clientData[config.clientIdx].location;
        
        const booking = new Booking({
          clientId: client.id,
          serviceId: service.id,
          providerId: provider.id,
          driverId: driver.id,
          bookingDate: bookingDate.toDate(),
          bookingTime: config.time,
          location: location,
          status: config.status,
          payment: config.payment
        });
        
        const savedBooking = await booking.save();
        
        if (!savedBooking || !savedBooking.id) {
          throw new Error('Booking save failed - no ID returned');
        }
        
        // Verify booking was actually saved
        const verifyBooking = await Booking.findById(savedBooking.id);
        if (!verifyBooking) {
          throw new Error('Booking was not saved to database');
        }
        
        bookings.push(savedBooking);
        console.log(`✅ Created booking: ${savedBooking.id} - ${config.status} - ${config.district} - ${dateStr}`);
        
        // Create or update schedule
        let schedule = scheduleMap.get(dateStr);
        
        if (!schedule) {
          schedule = await Schedule.findOne({ date: bookingDate.toDate() });
          if (!schedule) {
            schedule = new Schedule({
              date: bookingDate.toDate(),
              district: config.district,
              isLocked: true,
              providerId: provider.id,
              driverId: driver.id,
              bookings: []
            });
            await schedule.save();
          }
          scheduleMap.set(dateStr, schedule);
        }
        
        if (!schedule.bookings.includes(savedBooking.id)) {
          schedule.bookings.push(savedBooking.id);
          await schedule.save();
        }
      } catch (error) {
        console.error(`Error creating booking for day ${config.days}:`, error.message);
        console.error('Stack:', error.stack);
      }
    }
    
    console.log(`\n✅ Demo data seeded successfully!`);
    console.log(`   - Clients: ${clients.length}`);
    console.log(`   - Services: ${services.length}`);
    console.log(`   - Bookings: ${bookings.length}`);
    console.log(`   - Schedules: ${scheduleMap.size}`);
    
    return {
      success: true,
      clients: clients.length,
      services: services.length,
      bookings: bookings.length,
      schedules: scheduleMap.size
    };
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    console.error('Stack:', error.stack);
    throw error;
  }
}

module.exports = { seedDemoData };
