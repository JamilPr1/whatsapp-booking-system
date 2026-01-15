const dotenv = require('dotenv');
const { connectDB } = require('../db');
const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');
const moment = require('moment-timezone');

dotenv.config();

const timezone = process.env.TIMEZONE || 'Asia/Riyadh';

async function seedDemoData() {
  try {
    console.log('🌱 Starting demo data seeding (Supabase)...');

    // Connect to database
    await connectDB();
    console.log('✅ Connected to Supabase');

    // Create Admin User (if doesn't exist)
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = new User({
        email: 'admin@example.com',
        password: 'Admin123!',
        name: 'Admin User',
        role: 'admin',
        isActive: true
      });
      await admin.save();
      console.log('✅ Created admin user: admin@example.com / Admin123!');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

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
    } else {
      console.log('ℹ️  Provider user already exists');
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
    } else {
      console.log('ℹ️  Driver user already exists');
    }

    // Create 3 Demo Clients
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
        console.log(`✅ Created client: ${clientInfo.name}`);
      } else {
        clients.push(client);
        console.log(`ℹ️  Client already exists: ${clientInfo.name}`);
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
        console.log(`✅ Created service: ${serviceInfo.name}`);
      } else {
        services.push(service);
        console.log(`ℹ️  Service already exists: ${serviceInfo.name}`);
      }
    }

    // Create 6 Demo Bookings
    const today = moment.tz(timezone);
    const bookingDataArray = [];

    // Booking 1: Tomorrow in Al Olaya - Confirmed
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

    // Booking 2: Day after tomorrow in Al Malaz - Pending
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

    // Create bookings and schedules
    const createdBookings = [];
    for (const bookingData of bookingDataArray) {
      const booking = new Booking(bookingData);
      await booking.save();
      createdBookings.push(booking);

      // Create or update schedule
      const bookingDate = moment(bookingData.bookingDate).startOf('day');
      let schedule = await Schedule.findOne({ date: bookingDate.toDate() });
      
      if (!schedule) {
        schedule = new Schedule({
          date: bookingDate.toDate(),
          district: bookingData.location.district,
          isLocked: true,
          providerId: provider.id,
          driverId: driver.id,
          bookings: []
        });
      }
      
      // Add booking ID to schedule bookings array
      if (!schedule.bookings.includes(booking.id)) {
        schedule.bookings.push(booking.id);
      }
      await schedule.save();
      
      console.log(`✅ Created booking for ${bookingData.location.district} on ${moment(bookingData.bookingDate).format('DD MMM YYYY')} - Status: ${bookingData.status}`);
    }

    console.log('\n🎉 Demo data seeding completed!');
    console.log('\n📋 Summary:');
    console.log(`   - Admin: admin@example.com / Admin123!`);
    console.log(`   - Provider: ${provider.name}`);
    console.log(`   - Driver: ${driver.name}`);
    console.log(`   - Clients: ${clients.length}`);
    console.log(`   - Services: ${services.length}`);
    console.log(`   - Bookings: ${createdBookings.length}`);
    console.log(`   - Total entries: ${1 + 1 + 1 + clients.length + services.length + createdBookings.length}`);
    console.log('\n✅ You can now test the system!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

seedDemoData();
