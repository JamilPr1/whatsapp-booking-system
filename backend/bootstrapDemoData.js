const { connectDB } = require('./db');
const User = require('./models/User');
const Service = require('./models/Service');
const Booking = require('./models/Booking');
const Schedule = require('./models/Schedule');
const moment = require('moment-timezone');

const timezone = process.env.TIMEZONE || 'Asia/Riyadh';

/**
 * Automatically seed demo data if database is empty
 * This runs on startup to ensure there's data for testing
 */
async function ensureDemoData() {
  try {
    const { getSupabaseClient } = require('./db');
    const supabase = getSupabaseClient();
    
    // Step 1: Always ensure exactly 5 clients
    const existingClients = await User.countDocuments({ role: 'client' });
    if (existingClients !== 5) {
      if (existingClients > 5) {
        console.log(`⚠️  Found ${existingClients} clients, cleaning up excess (keeping only 5)...`);
        const allClients = await User.find({ role: 'client' });
        const clientsToDelete = allClients.slice(5);
        for (const client of clientsToDelete) {
          await supabase.from('users').delete().eq('id', client.id);
        }
        console.log(`✅ Removed ${clientsToDelete.length} excess clients`);
      }
    } else {
      console.log(`✅ Have exactly ${existingClients} clients`);
    }
    
    // Step 2: Always ensure exactly 10 bookings
    const existingBookings = await Booking.countDocuments();
    const existingServices = await Service.countDocuments({ isActive: true });
    
    // If we have exactly 10 bookings and 4+ services and 5 clients, we're done
    if (existingBookings === 10 && existingServices >= 4) {
      console.log(`✅ Demo data is complete (${existingBookings} bookings, ${existingServices} services)`);
      return { seeded: false, reason: 'Data already complete', existingBookings, existingServices, existingClients };
    }
    
    // If bookings count is wrong, clean up and recreate
    if (existingBookings !== 10) {
      if (existingBookings > 0) {
        console.log(`⚠️  Found ${existingBookings} bookings (need 10), cleaning up...`);
        const bookingsToDelete = await Booking.find({});
        for (const booking of bookingsToDelete) {
          await supabase.from('bookings').delete().eq('id', booking.id);
        }
        console.log(`✅ Deleted ${bookingsToDelete.length} existing bookings`);
      }
      
      // Delete all schedules too
      const existingSchedules = await Schedule.find({});
      for (const schedule of existingSchedules) {
        await supabase.from('schedules').delete().eq('id', schedule.id);
      }
      if (existingSchedules.length > 0) {
        console.log(`✅ Deleted ${existingSchedules.length} existing schedules`);
      }
    }

    console.log('🌱 Seeding demo data...');

    // Create Provider User
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
      console.log('✅ Created provider user');
    }

    // Create Driver User
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
      console.log('✅ Created driver user');
    }

    // Create exactly 5 Demo Clients (reduced from 10 for cleaner demo)
    const clientData = [
      {
        name: 'Ahmed Al-Saud',
        phoneNumber: '+966501111111',
        location: {
          latitude: 24.7136,
          longitude: 46.6753,
          address: 'King Fahd Road, Al Olaya, Riyadh',
          district: 'Al Olaya'
        }
      },
      {
        name: 'Fatima Al-Rashid',
        phoneNumber: '+966502222222',
        location: {
          latitude: 24.6508,
          longitude: 46.7144,
          address: 'Prince Sultan Road, Al Malaz, Riyadh',
          district: 'Al Malaz'
        }
      },
      {
        name: 'Mohammed Al-Zahrani',
        phoneNumber: '+966503333333',
        location: {
          latitude: 24.6877,
          longitude: 46.7219,
          address: 'King Abdulaziz Road, Al Wurud, Riyadh',
          district: 'Al Wurud'
        }
      },
      {
        name: 'Sara Al-Mutairi',
        phoneNumber: '+966504444444',
        location: {
          latitude: 24.7000,
          longitude: 46.6800,
          address: 'Olaya Street, Riyadh',
          district: 'Al Olaya'
        }
      },
      {
        name: 'Khalid Al-Otaibi',
        phoneNumber: '+966505555555',
        location: {
          latitude: 24.6400,
          longitude: 46.7200,
          address: 'Malaz District, Riyadh',
          district: 'Al Malaz'
        }
      },
      {
        name: 'Noura Al-Ghamdi',
        phoneNumber: '+966506666666',
        location: {
          latitude: 24.6900,
          longitude: 46.7300,
          address: 'Wurud Area, Riyadh',
          district: 'Al Wurud'
        }
      },
      {
        name: 'Faisal Al-Shammari',
        phoneNumber: '+966507777777',
        location: {
          latitude: 24.7200,
          longitude: 46.6700,
          address: 'King Fahd Road, Riyadh',
          district: 'Al Olaya'
        }
      },
      {
        name: 'Layla Al-Harbi',
        phoneNumber: '+966508888888',
        location: {
          latitude: 24.6600,
          longitude: 46.7100,
          address: 'Sultan Road, Riyadh',
          district: 'Al Malaz'
        }
      },
      {
        name: 'Omar Al-Qahtani',
        phoneNumber: '+966509999999',
        location: {
          latitude: 24.6800,
          longitude: 46.7400,
          address: 'Abdulaziz Road, Riyadh',
          district: 'Al Wurud'
        }
      },
      {
        name: 'Hanan Al-Dosari',
        phoneNumber: '+966500000000',
        location: {
          latitude: 24.7100,
          longitude: 46.6600,
          address: 'Fahd Street, Riyadh',
          district: 'Al Olaya'
        }
      }
    ];

    const clients = [];
    // Get current client count
    const currentClientCount = await User.countDocuments({ role: 'client' });
    const targetClientCount = 5;
    
    // Create clients to reach exactly 5
    if (currentClientCount < targetClientCount) {
      const clientsToCreate = targetClientCount - currentClientCount;
      console.log(`Creating ${clientsToCreate} clients (already have ${currentClientCount})...`);
      
      // Use first 5 clients from the data
      for (let i = 0; i < Math.min(clientsToCreate, 5); i++) {
        const clientInfo = clientData[i];
        let client = await User.findOne({ phoneNumber: clientInfo.phoneNumber });
        if (!client) {
          client = new User({
            ...clientInfo,
            role: 'client',
            isActive: true
          });
          await client.save();
          clients.push(client);
          console.log(`✅ Created client: ${clientInfo.name}`);
        } else {
          clients.push(client);
          console.log(`ℹ️  Client already exists: ${clientInfo.name}`);
        }
      }
    }
    
    // Get all clients (should be exactly 5 now)
    const allClients = await User.find({ role: 'client' });
    clients.push(...allClients.slice(0, targetClientCount));
    
    if (clients.length < 3) {
      throw new Error(`Not enough clients (${clients.length}), need at least 3 for bookings`);
    }
    
    console.log(`✅ Using ${clients.length} clients for bookings`);

    // Create 4 Services
    const serviceData = [
      {
        name: 'Home Cleaning Service',
        description: 'Complete home cleaning including all rooms, kitchen, and bathrooms',
        category: 'main',
        duration: 120,
        price: 250,
        depositAmount: 50,
        isActive: true
      },
      {
        name: 'Deep Cleaning',
        description: 'Intensive deep cleaning service',
        category: 'sub',
        duration: 180,
        price: 400,
        depositAmount: 100,
        isActive: true
      },
      {
        name: 'Office Cleaning',
        description: 'Professional office cleaning service',
        category: 'main',
        duration: 90,
        price: 300,
        depositAmount: 75,
        isActive: true
      },
      {
        name: 'Window Cleaning',
        description: 'Professional window and glass cleaning',
        category: 'sub',
        duration: 60,
        price: 150,
        depositAmount: 30,
        isActive: true
      }
    ];

    const services = [];
    for (const serviceInfo of serviceData) {
      let service = await Service.findOne({ name: serviceInfo.name });
      if (!service) {
        service = new Service(serviceInfo);
        await service.save();
        services.push(service);
      } else {
        services.push(service);
      }
    }

    // Create 10 Demo Bookings for comprehensive testing
    const today = moment.tz(timezone);
    const bookingDataArray = [];

    // Booking 1: Tomorrow - Confirmed
    const tomorrow = today.clone().add(1, 'day');
    bookingDataArray.push({
      clientId: clients[0].id,
      serviceId: services[0].id,
      providerId: provider.id,
      driverId: driver.id,
      bookingDate: tomorrow.toDate(),
      bookingTime: '10:00',
      location: {
        latitude: 24.7136,
        longitude: 46.6753,
        address: 'King Fahd Road, Al Olaya, Riyadh',
        district: 'Al Olaya'
      },
      status: 'confirmed',
      payment: {
        method: 'online',
        status: 'paid',
        amount: 250,
        depositAmount: 0,
        transactionId: 'demo_txn_001'
      }
    });

    // Booking 2: Day after tomorrow - Pending
    const dayAfter = today.clone().add(2, 'days');
    bookingDataArray.push({
      clientId: clients[1].id,
      serviceId: services[1].id,
      providerId: provider.id,
      driverId: driver.id,
      bookingDate: dayAfter.toDate(),
      bookingTime: '14:00',
      location: {
        latitude: 24.6508,
        longitude: 46.7144,
        address: 'Prince Sultan Road, Al Malaz, Riyadh',
        district: 'Al Malaz'
      },
      status: 'pending',
      payment: {
        method: 'in-person',
        status: 'pending',
        amount: 400,
        depositAmount: 0
      }
    });

    // Booking 3: 3 days from now - Confirmed
    const day3 = today.clone().add(3, 'days');
    bookingDataArray.push({
      clientId: clients[2].id,
      serviceId: services[2].id,
      providerId: provider.id,
      driverId: driver.id,
      bookingDate: day3.toDate(),
      bookingTime: '09:00',
      location: {
        latitude: 24.6877,
        longitude: 46.7219,
        address: 'King Abdulaziz Road, Al Wurud, Riyadh',
        district: 'Al Wurud'
      },
      status: 'confirmed',
      payment: {
        method: 'online',
        status: 'paid',
        amount: 300,
        depositAmount: 75,
        transactionId: 'demo_txn_002'
      }
    });

    // Booking 4: 4 days from now - Pending
    const day4 = today.clone().add(4, 'days');
    bookingDataArray.push({
      clientId: clients[0].id,
      serviceId: services[3].id,
      providerId: provider.id,
      driverId: driver.id,
      bookingDate: day4.toDate(),
      bookingTime: '11:30',
      location: {
        latitude: 24.7136,
        longitude: 46.6753,
        address: 'King Fahd Road, Al Olaya, Riyadh',
        district: 'Al Olaya'
      },
      status: 'pending',
      payment: {
        method: 'in-person',
        status: 'pending',
        amount: 150,
        depositAmount: 0
      }
    });

    // Booking 5: 5 days from now - In Progress
    const day5 = today.clone().add(5, 'days');
    bookingDataArray.push({
      clientId: clients[1].id,
      serviceId: services[0].id,
      providerId: provider.id,
      driverId: driver.id,
      bookingDate: day5.toDate(),
      bookingTime: '15:00',
      location: {
        latitude: 24.6508,
        longitude: 46.7144,
        address: 'Prince Sultan Road, Al Malaz, Riyadh',
        district: 'Al Malaz'
      },
      status: 'in-progress',
      payment: {
        method: 'online',
        status: 'partial',
        amount: 250,
        depositAmount: 50,
        transactionId: 'demo_txn_003'
      }
    });

    // Booking 6: 6 days from now - Completed
    const day6 = today.clone().add(6, 'days');
    bookingDataArray.push({
      clientId: clients[2].id,
      serviceId: services[1].id,
      providerId: provider.id,
      driverId: driver.id,
      bookingDate: day6.toDate(),
      bookingTime: '13:00',
      location: {
        latitude: 24.6877,
        longitude: 46.7219,
        address: 'King Abdulaziz Road, Al Wurud, Riyadh',
        district: 'Al Wurud'
      },
      status: 'completed',
      payment: {
        method: 'online',
        status: 'paid',
        amount: 400,
        depositAmount: 0,
        transactionId: 'demo_txn_004'
      }
    });

    // Booking 7: 7 days from now - Confirmed
    const day7 = today.clone().add(7, 'days');
    bookingDataArray.push({
      clientId: clients[0].id,
      serviceId: services[2].id,
      providerId: provider.id,
      driverId: driver.id,
      bookingDate: day7.toDate(),
      bookingTime: '08:00',
      location: {
        latitude: 24.7136,
        longitude: 46.6753,
        address: 'King Fahd Road, Al Olaya, Riyadh',
        district: 'Al Olaya'
      },
      status: 'confirmed',
      payment: {
        method: 'online',
        status: 'paid',
        amount: 300,
        depositAmount: 75,
        transactionId: 'demo_txn_005'
      }
    });

    // Booking 8: 8 days from now - Pending
    const day8 = today.clone().add(8, 'days');
    bookingDataArray.push({
      clientId: clients[1].id,
      serviceId: services[3].id,
      providerId: provider.id,
      driverId: driver.id,
      bookingDate: day8.toDate(),
      bookingTime: '16:00',
      location: {
        latitude: 24.6508,
        longitude: 46.7144,
        address: 'Prince Sultan Road, Al Malaz, Riyadh',
        district: 'Al Malaz'
      },
      status: 'pending',
      payment: {
        method: 'in-person',
        status: 'pending',
        amount: 150,
        depositAmount: 0
      }
    });

    // Booking 9: Today - In Progress (if today is a valid date)
    bookingDataArray.push({
      clientId: clients[2].id,
      serviceId: services[0].id,
      providerId: provider.id,
      driverId: driver.id,
      bookingDate: today.toDate(),
      bookingTime: '12:00',
      location: {
        latitude: 24.6877,
        longitude: 46.7219,
        address: 'King Abdulaziz Road, Al Wurud, Riyadh',
        district: 'Al Wurud'
      },
      status: 'in-progress',
      payment: {
        method: 'online',
        status: 'partial',
        amount: 250,
        depositAmount: 50,
        transactionId: 'demo_txn_006'
      }
    });

    // Booking 10: Yesterday - Completed (past booking)
    const yesterday = today.clone().subtract(1, 'day');
    bookingDataArray.push({
      clientId: clients[0].id,
      serviceId: services[1].id,
      providerId: provider.id,
      driverId: driver.id,
      bookingDate: yesterday.toDate(),
      bookingTime: '14:30',
      location: {
        latitude: 24.7136,
        longitude: 46.6753,
        address: 'King Fahd Road, Al Olaya, Riyadh',
        district: 'Al Olaya'
      },
      status: 'completed',
      payment: {
        method: 'online',
        status: 'paid',
        amount: 400,
        depositAmount: 0,
        transactionId: 'demo_txn_007'
      }
    });

    // Always ensure we have 10 bookings - create them if missing
    const existingBookingsCount = await Booking.countDocuments();
    let createdBookings = [];
    let createdSchedules = [];
    
    if (existingBookingsCount >= 10) {
      console.log(`✅ Already have ${existingBookingsCount} bookings`);
      // Fetch existing bookings to return count
      const existingBookings = await Booking.find({});
      createdBookings = existingBookings.slice(0, 10);
    } else {
      // Delete existing bookings if we have less than 10 (to start fresh)
      if (existingBookingsCount > 0) {
        console.log(`⚠️  Found ${existingBookingsCount} bookings (need 10), cleaning up...`);
        const bookingsToDelete = await Booking.find({});
        const { getSupabaseClient } = require('./db');
        const supabase = getSupabaseClient();
        for (const booking of bookingsToDelete) {
          await supabase.from('bookings').delete().eq('id', booking.id);
        }
        console.log(`✅ Deleted ${bookingsToDelete.length} existing bookings`);
      }
      // Create bookings and schedules
      const scheduleMap = new Map(); // Track schedules by date string
      
      console.log(`Creating ${bookingDataArray.length} bookings...`);
      
      for (const bookingData of bookingDataArray) {
        try {
          // Ensure we have valid client/service IDs
          if (!bookingData.clientId || !bookingData.serviceId) {
            console.error(`❌ Missing clientId or serviceId for booking`);
            continue;
          }
          
          // Ensure bookingDate is a Date object
          const bookingDateObj = bookingData.bookingDate instanceof Date 
            ? bookingData.bookingDate 
            : new Date(bookingData.bookingDate);
          
          // Format date for schedule lookup
          const dateStr = moment(bookingDateObj).format('YYYY-MM-DD');
          
          console.log(`Creating booking for ${dateStr} - ${bookingData.location.district}...`);
          
          const booking = new Booking({
            ...bookingData,
            bookingDate: bookingDateObj
          });
          
          const savedBooking = await booking.save();
          if (!savedBooking || !savedBooking.id) {
            throw new Error('Booking save returned no ID');
          }
          
          createdBookings.push(savedBooking);
          console.log(`✅ Created booking: ${savedBooking.id} - ${bookingData.location.district} - ${bookingData.status}`);

          // Create or update schedule
          const bookingDate = moment(bookingDateObj).startOf('day');
          let schedule = scheduleMap.get(dateStr);
          
          if (!schedule) {
            // Check if schedule exists in database
            schedule = await Schedule.findOne({ date: bookingDate.toDate() });
            
            if (!schedule) {
              schedule = new Schedule({
                date: bookingDate.toDate(),
                district: bookingData.location.district,
                isLocked: true,
                providerId: provider.id,
                driverId: driver.id,
                bookings: []
              });
              await schedule.save();
              if (!schedule.id) {
                throw new Error('Schedule save returned no ID');
              }
              console.log(`✅ Created schedule for ${dateStr} - ${bookingData.location.district}`);
            } else {
              console.log(`✅ Found existing schedule for ${dateStr}`);
            }
            
            scheduleMap.set(dateStr, schedule);
          }
          
          // Add booking ID to schedule bookings array
          if (!schedule.bookings) {
            schedule.bookings = [];
          }
          
          if (!schedule.bookings.includes(savedBooking.id)) {
            schedule.bookings.push(savedBooking.id);
            await schedule.save();
            console.log(`✅ Added booking ${savedBooking.id} to schedule ${dateStr}`);
          }
        } catch (error) {
          console.error(`❌ Error creating booking for ${bookingData.location.district}:`, error.message);
          console.error('Error stack:', error.stack);
          console.error('Booking data:', {
            clientId: bookingData.clientId,
            serviceId: bookingData.serviceId,
            bookingDate: bookingData.bookingDate,
            status: bookingData.status
          });
          // Continue with next booking even if one fails
        }
      }
      
      createdSchedules = Array.from(scheduleMap.values());
    }

    console.log('✅ Demo data seeded successfully!');
    console.log(`   - Clients: ${clients.length}`);
    console.log(`   - Services: ${services.length}`);
    console.log(`   - Bookings: ${createdBookings.length}`);
    console.log(`   - Schedules: ${createdSchedules.length}`);

    return { 
      seeded: true, 
      clients: clients.length,
      services: services.length,
      bookings: createdBookings.length,
      schedules: createdSchedules.length
    };
  } catch (error) {
    console.error('❌ Error seeding demo data:', error.message);
    // Don't throw - allow app to continue even if seeding fails
    return { seeded: false, error: error.message };
  }
}

module.exports = { ensureDemoData };
