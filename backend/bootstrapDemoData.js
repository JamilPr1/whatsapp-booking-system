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
// Track if seeding has been done in this process (prevent multiple runs)
let hasSeeded = false;

async function ensureDemoData() {
  try {
    // Prevent multiple seeding attempts in the same process
    if (hasSeeded) {
      console.log('ℹ️  Demo data already seeded in this session, skipping');
      return { seeded: false, reason: 'Already seeded in this session' };
    }

    // Check if demo data already exists - check bookings, services, and client count
    const existingBookings = await Booking.countDocuments();
    const existingServices = await Service.countDocuments({ isActive: true });
    const existingClients = await User.countDocuments({ role: 'client' });
    
    // If we have bookings OR (services > 3 AND clients >= 3), consider it seeded
    if (existingBookings > 0 || (existingServices >= 3 && existingClients >= 3)) {
      console.log(`ℹ️  Demo data already exists (${existingBookings} bookings, ${existingServices} services, ${existingClients} clients), skipping seed`);
      hasSeeded = true;
      return { seeded: false, reason: 'Data already exists' };
    }

    console.log('🌱 Database appears empty, seeding demo data...');
    hasSeeded = true; // Mark as seeded to prevent duplicate runs

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

    // Create exactly 10 Demo Clients
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
    for (const clientInfo of clientData) {
      let client = await User.findOne({ phoneNumber: clientInfo.phoneNumber });
      if (!client) {
        client = new User({
          ...clientInfo,
          role: 'client',
          isActive: true
        });
        await client.save();
        clients.push(client);
      } else {
        clients.push(client);
      }
    }

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

    // Create bookings and schedules
    const createdBookings = [];
    const scheduleMap = new Map(); // Track schedules by date string
    
    for (const bookingData of bookingDataArray) {
      try {
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
    
    const createdSchedules = Array.from(scheduleMap.values());

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
