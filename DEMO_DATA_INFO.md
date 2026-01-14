# Demo Data Information

## ✅ Demo Data Created

### Users
- **Admin**: admin@example.com / Admin123!
- **Provider**: Service Provider (+966501234567)
- **Driver**: Driver Ali (+966507654321)
- **Clients**: 3 clients with different districts

### Services
1. **Home Cleaning Service** - 250 SAR (2 hours)
2. **Deep Cleaning** - 400 SAR (3 hours)
3. **Office Cleaning** - 300 SAR (1.5 hours)

### Bookings (2 only)
1. **Tomorrow** - Al Olaya district
   - Client: Ahmed Al-Saud
   - Service: Home Cleaning Service
   - Time: 10:00
   - Status: Confirmed, Paid

2. **Day After Tomorrow** - Al Malaz district
   - Client: Fatima Al-Rashid
   - Service: Deep Cleaning
   - Time: 14:00
   - Status: Pending

### Test Scenarios

1. **View Bookings**: Login to admin panel and see 2 bookings
2. **District Locking**: Try to book Al Olaya tomorrow (should fail - already locked)
3. **Next Available Day**: System should suggest next available day
4. **Cancellation**: Try canceling a booking <48 hours (should fail)
5. **Schedules**: View schedules for tomorrow and day after

## 🌐 Access

- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000
- **Login**: admin@example.com / Admin123!
