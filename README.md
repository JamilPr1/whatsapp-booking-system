# WhatsApp Appointment Booking System

A WhatsApp-first appointment booking system for on-site services with district-based scheduling, payment processing, and admin management.

## 🎯 Features

- **WhatsApp Integration**: Interactive booking flow via WhatsApp with structured prompts
- **Location Services**: Google Maps reverse geocoding for district mapping
- **Smart Scheduling**: District-based day locking (one district per day)
- **Payment Processing**: Online full payment (Stripe) and in-person deposit options
- **Admin Panel**: Secure React-based control panel for managing services, bookings, and settings
- **Automated Notifications**: Daily WhatsApp notifications to providers and drivers at 23:59 (Riyadh time)
- **Exception Handling**: Admin can unlock schedules and override district assignments

## 📁 Project Structure

```
├── backend/              # Express.js API server
│   ├── models/          # MongoDB models (User, Booking, Service, Schedule)
│   ├── routes/          # API routes
│   ├── services/        # Business logic (WhatsApp, Maps, Payment, Booking)
│   ├── middleware/      # Auth middleware
│   └── server.js        # Main server file
├── admin-panel/         # React admin dashboard
│   ├── src/
│   │   ├── components/  # React components
│   │   └── App.js       # Main app component
│   └── public/
└── REQUIREMENTS.md      # Complete setup requirements
```

## 🚀 Quick Start

See [QUICK_START.md](./QUICK_START.md) for a 5-minute setup guide.

## 📋 Setup Instructions

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in all required values. See [REQUIREMENTS.md](./REQUIREMENTS.md) for detailed information.

### 3. Start Development Servers
```bash
npm run dev
```

This starts:
- Backend API on `http://localhost:5000`
- Admin Panel on `http://localhost:3000`

## 📚 Documentation

- **[REQUIREMENTS.md](./REQUIREMENTS.md)** - Complete list of required credentials and setup steps
- **[QUICK_START.md](./QUICK_START.md)** - Quick 5-minute setup guide

## 🔑 Required Credentials

You'll need to provide:

1. **WhatsApp Business API** (or use WhatsApp Web.js for development)
2. **Google Maps API Key** (for reverse geocoding)
3. **Stripe Account** (for payment processing)
4. **MongoDB** (local or Atlas)
5. **Server/Hosting** (for production deployment)

See [REQUIREMENTS.md](./REQUIREMENTS.md) for detailed setup instructions.

## 🏗️ Architecture

### Phase 0 (MVP) - Current Implementation
- ✅ 1 provider, 1 driver, 1 main service (with optional sub-services)
- ✅ Core booking flow via WhatsApp
- ✅ Payment processing (online + deposit)
- ✅ Admin control panel
- ✅ Daily notifications
- ✅ District-based scheduling

### Phase 1 (Future)
- Multiple providers/drivers/services
- Provider selection in booking flow
- Advanced routing and dispatch
- Enhanced role-based permissions

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- WhatsApp Web.js / WhatsApp Business API
- Google Maps API
- Stripe
- JWT Authentication

**Frontend:**
- React
- React Router
- Axios
- CSS3

## 📱 WhatsApp Flow

1. Client sends message → Welcome menu
2. Client selects service
3. Client shares location → District mapping
4. System shows available dates (district-based)
5. Client selects date and time
6. Client chooses payment method
7. Payment processing (if online)
8. Booking confirmation

## 🔔 Notifications

- **Provider**: Daily schedule at 23:59 (Riyadh time)
- **Driver**: Two messages:
  1. Schedule list with client details
  2. Route link (Google Maps)

## 🔐 Security

- JWT-based authentication
- Password hashing (bcrypt)
- Environment variable protection
- HTTPS required for production
- Webhook signature verification

## 📝 License

ISC

## 🤝 Support

For setup assistance, refer to [REQUIREMENTS.md](./REQUIREMENTS.md) for detailed instructions on obtaining and configuring all required credentials.
