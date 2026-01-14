const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');
const moment = require('moment-timezone');

dotenv.config();

const timezone = process.env.TIMEZONE || 'Asia/Riyadh';

async function seedDemoData() {
  try {
    console.log('🌱 Starting demo data seeding...');

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-booking', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to database');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // await Service.deleteMany({});
    // await Booking.deleteMany({});
    // await Schedule.deleteMany({});
    // console.log('🗑️  Cleared existing data');

    // Create Admin User
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      const admin = new User({
        email: 'admin@example.com',
        // Set plaintext; the User model pre-save hook will hash it once.
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

    // Create Demo Clients
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

    // Create Services
    const serviceData = [
      {
        name: 'Home Cleaning Service',
        description: 'Complete home cleaning including all rooms, kitchen, and bathrooms',
        category: 'main',
        duration: 120, // 2 hours
        price: 250,
        depositAmount: 50,
        isActive: true
      },
      {
        name: 'Deep Cleaning',
        description: 'Intensive deep cleaning service',
        category: 'sub',
        duration: 180, // 3 hours
        price: 400,
        depositAmount: 100,
        isActive: true
      },
      {
        name: 'Office Cleaning',
        description: 'Professional office cleaning service',
        category: 'main',
        duration: 90, // 1.5 hours
        price: 300,
        depositAmount: 75,
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

    // Create Demo Bookings (only 2 bookings)
    const today = moment.tz(timezone);
    const bookingDataArray = [];

    // Booking 1: Tomorrow in Al Olaya
    const tomorrow = today.clone().add(1, 'day');
    bookingDataArray.push({
      clientId: clients[0]._id,
      serviceId: services[0]._id,
      providerId: provider._id,
      driverId: driver._id,
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

    // Booking 2: Day after tomorrow in Al Malaz (different district)
    const dayAfter = today.clone().add(2, 'days');
    bookingDataArray.push({
      clientId: clients[1]._id,
      serviceId: services[1]._id,
      providerId: provider._id,
      driverId: driver._id,
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
          providerId: provider._id,
          driverId: driver._id
        });
      }
      
      schedule.bookings.push(booking._id);
      await schedule.save();
      
      console.log(`✅ Created booking for ${bookingData.location.district} on ${moment(bookingData.bookingDate).format('DD MMM YYYY')}`);
    }

    console.log('\n🎉 Demo data seeding completed!');
    console.log('\n📋 Summary:');
    console.log(`   - Admin: admin@example.com / Admin123!`);
    console.log(`   - Provider: ${provider.name}`);
    console.log(`   - Driver: ${driver.name}`);
    console.log(`   - Clients: ${clients.length}`);
    console.log(`   - Services: ${services.length}`);
    console.log(`   - Bookings: ${createdBookings.length}`);
    console.log(`   - Schedules: Created for booking dates`);
    console.log('\n✅ You can now test the system!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedDemoData();
