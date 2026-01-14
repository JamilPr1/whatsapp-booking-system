const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');
const Service = require('../models/Service');
const User = require('../models/User');
const mapsService = require('./mapsService');
const moment = require('moment-timezone');

class BookingService {
  async createBooking(bookingData) {
    try {
      // Validate district availability for the date
      const bookingDate = moment(bookingData.bookingDate).startOf('day');
      const existingSchedule = await Schedule.findOne({ date: bookingDate.toDate() });

      if (existingSchedule && existingSchedule.isLocked) {
        if (existingSchedule.district !== bookingData.location.district) {
          // Client requirement: If district doesn't match, find next available day without bookings
          const nextAvailable = await this.findNextAvailableDay();
          if (nextAvailable) {
            throw new Error(
              `This date is locked to ${existingSchedule.district} district. ` +
              `Next available day: ${moment(nextAvailable).format('DD MMM YYYY')}. ` +
              `Please choose another date.`
            );
          } else {
            throw new Error(
              `This date is locked to ${existingSchedule.district} district. ` +
              `No available days found in the booking window. Please contact admin.`
            );
          }
        }
      }

      // Create or update schedule
      let schedule = existingSchedule;
      if (!schedule) {
        schedule = new Schedule({
          date: bookingDate.toDate(),
          district: bookingData.location.district,
          isLocked: true
        });
      } else if (!schedule.isLocked) {
        schedule.district = bookingData.location.district;
        schedule.isLocked = true;
      }

      // Create booking
      const booking = new Booking(bookingData);
      await booking.save();

      // Add booking to schedule
      schedule.bookings.push(booking._id);
      await schedule.save();

      return booking;
    } catch (error) {
      console.error('Booking creation error:', error);
      throw error;
    }
  }

  async getAvailableDates(district) {
    try {
      // Get dates locked to this district
      const lockedDates = await Schedule.find({
        district,
        isLocked: true,
        date: { $gte: new Date() }
      }).select('date');

      // Get dates locked to other districts (unavailable)
      const otherDistrictDates = await Schedule.find({
        district: { $ne: district },
        isLocked: true,
        date: { $gte: new Date() }
      }).select('date');

      const unavailableDates = otherDistrictDates.map(s => s.date.toISOString().split('T')[0]);

      return {
        available: lockedDates.map(s => s.date),
        unavailable: unavailableDates
      };
    } catch (error) {
      console.error('Error getting available dates:', error);
      throw error;
    }
  }

  // Find next available day without any bookings (for unclear/outside districts)
  async findNextAvailableDay(bookingWindowDays = 30) {
    try {
      const today = moment().startOf('day');
      const endDate = moment().add(bookingWindowDays, 'days').endOf('day');

      // Get all locked schedules in the window
      const lockedSchedules = await Schedule.find({
        isLocked: true,
        date: { $gte: today.toDate(), $lte: endDate.toDate() }
      }).select('date');

      const lockedDates = new Set(
        lockedSchedules.map(s => s.date.toISOString().split('T')[0])
      );

      // Find first day without any booking
      let currentDate = today.clone();
      while (currentDate.isBefore(endDate)) {
        const dateStr = currentDate.format('YYYY-MM-DD');
        if (!lockedDates.has(dateStr)) {
          return currentDate.toDate();
        }
        currentDate.add(1, 'day');
      }

      return null; // No available day in window
    } catch (error) {
      console.error('Error finding next available day:', error);
      throw error;
    }
  }

  async getTimeSlots(date, district) {
    try {
      const schedule = await Schedule.findOne({
        date: moment(date).startOf('day').toDate(),
        district
      }).populate('bookings');

      const slots = [];
      const startHour = 9; // 9 AM
      const endHour = 18; // 6 PM
      const slotDuration = 60; // 60 minutes

      for (let hour = startHour; hour < endHour; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        const isBooked = schedule?.bookings.some(booking => {
          const bookingHour = parseInt(booking.bookingTime.split(':')[0]);
          return bookingHour === hour && booking.status !== 'cancelled';
        });

        slots.push({
          time,
          available: !isBooked
        });
      }

      return slots;
    } catch (error) {
      console.error('Error getting time slots:', error);
      throw error;
    }
  }

  async processLocationAndCreateBooking(phoneNumber, location, serviceId) {
    try {
      // Reverse geocode location
      const geocodeResult = await mapsService.reverseGeocode(
        location.latitude,
        location.longitude
      );

      // Get or create user
      let user = await User.findOne({ phoneNumber });
      if (!user) {
        user = new User({
          phoneNumber,
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
            address: geocodeResult.address,
            district: geocodeResult.district
          }
        });
        await user.save();
      } else {
        user.location = {
          latitude: location.latitude,
          longitude: location.longitude,
          address: geocodeResult.address,
          district: geocodeResult.district
        };
        await user.save();
      }

      // Get service
      const service = await Service.findById(serviceId);
      if (!service) {
        throw new Error('Service not found');
      }

      return {
        user,
        service,
        district: geocodeResult.district,
        address: geocodeResult.address
      };
    } catch (error) {
      console.error('Error processing location:', error);
      throw error;
    }
  }
}

const bookingService = new BookingService();

module.exports = bookingService;
