const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const whatsappService = require('./whatsappService');
const mapsService = require('./mapsService');
const moment = require('moment-timezone');

async function sendDailyNotifications() {
  try {
    const timezone = process.env.TIMEZONE || 'Asia/Riyadh';
    const tomorrow = moment.tz(timezone).add(1, 'day').startOf('day');
    
    // Get tomorrow's schedule
    const schedule = await Schedule.findOne({
      date: tomorrow.toDate()
    }).populate({
      path: 'bookings',
      populate: [
        { path: 'clientId', select: 'name phoneNumber' },
        { path: 'serviceId', select: 'name duration price' }
      ]
    });

    if (!schedule || schedule.bookings.length === 0) {
      console.log('No bookings for tomorrow');
      return;
    }

    // Get provider and driver
    const provider = await User.findOne({ role: 'provider', isActive: true });
    const driver = await User.findOne({ role: 'driver', isActive: true });

    // Send provider notification
    if (provider && provider.phoneNumber) {
      await sendProviderNotification(provider.phoneNumber, schedule, tomorrow);
    }

    // Send driver notifications
    if (driver && driver.phoneNumber) {
      await sendDriverNotifications(driver.phoneNumber, schedule, tomorrow);
    }
  } catch (error) {
    console.error('Error sending daily notifications:', error);
  }
}

async function sendProviderNotification(phoneNumber, schedule, date) {
  try {
    let message = `📅 *Daily Schedule - ${date.format('DD MMM YYYY')}*\n\n`;
    message += `📍 District: ${schedule.district}\n\n`;
    message += `*Bookings:*\n\n`;

    schedule.bookings.forEach((booking, index) => {
      message += `${index + 1}. ${booking.bookingTime} - ${booking.clientId.name}\n`;
      message += `   Service: ${booking.serviceId.name}\n`;
      message += `   Location: ${booking.location.address}\n`;
      message += `   Status: ${booking.status}\n\n`;
    });

    message += `Total: ${schedule.bookings.length} booking(s)`;

    await whatsappService.sendMessage(phoneNumber, message);
    console.log('✅ Provider notification sent');
  } catch (error) {
    console.error('Error sending provider notification:', error);
  }
}

async function sendDriverNotifications(phoneNumber, schedule, date) {
  try {
    // Message 1: Schedule list
    let scheduleMessage = `🚗 *Driver Schedule - ${date.format('DD MMM YYYY')}*\n\n`;
    scheduleMessage += `📍 District: ${schedule.district}\n\n`;
    scheduleMessage += `*Route:*\n\n`;

    const sortedBookings = [...schedule.bookings].sort((a, b) => {
      return a.bookingTime.localeCompare(b.bookingTime);
    });

    sortedBookings.forEach((booking, index) => {
      scheduleMessage += `${index + 1}. ${booking.bookingTime} - ${booking.clientId.name}\n`;
      scheduleMessage += `   ${booking.location.address}\n`;
      scheduleMessage += `   📞 ${booking.clientId.phoneNumber}\n\n`;
    });

    await whatsappService.sendMessage(phoneNumber, scheduleMessage);

    // Message 2: Route link
    if (sortedBookings.length > 0) {
      const waypoints = sortedBookings.map(booking => ({
        lat: booking.location.latitude,
        lng: booking.location.longitude
      }));

      const routeLink = mapsService.generateRouteLink(waypoints);
      const routeMessage = `🗺️ *Route Map:*\n${routeLink}`;

      await whatsappService.sendMessage(phoneNumber, routeMessage);
    }

    console.log('✅ Driver notifications sent');
  } catch (error) {
    console.error('Error sending driver notifications:', error);
  }
}

module.exports = {
  sendDailyNotifications,
  sendProviderNotification,
  sendDriverNotifications
};
