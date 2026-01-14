# WhatsApp Booking System - Requirements & Setup Guide

## 📋 What You Need to Provide

### 1. **WhatsApp Business API Access**
   - **Option A: WhatsApp Business API (Recommended for Production)**
     - WhatsApp Business API account from Meta/Facebook
     - API credentials (API Key, API Secret)
     - WhatsApp Business Phone Number
     - Webhook URL for receiving messages
   
   - **Option B: WhatsApp Web.js (Development/Testing)**
     - Personal WhatsApp number for testing
     - QR code scanning capability
     - Note: This is for development only, not recommended for production
   
   - **Option C: Twilio WhatsApp API**
     - Twilio account
     - Twilio Account SID and Auth Token
     - Twilio WhatsApp-enabled phone number

### 2. **Google Maps API Key**
   - Google Cloud Platform account
   - Enable "Geocoding API" and "Maps JavaScript API"
   - Create API key with appropriate restrictions
   - Required for reverse geocoding (location → district mapping)

### 3. **Payment Gateway (Stripe)**
   - Stripe account (https://stripe.com)
   - Stripe Secret Key (for server-side)
   - Stripe Publishable Key (for client-side)
   - Webhook secret (for payment confirmations)
   - Note: Use test keys during development

### 4. **Database (MongoDB)**
   - **Option A: MongoDB Atlas (Cloud - Recommended)**
     - MongoDB Atlas account
     - Create a cluster
     - Get connection string
   
   - **Option B: Local MongoDB**
     - Install MongoDB locally
     - Default connection: `mongodb://localhost:27017/whatsapp-booking`

### 5. **Server/Hosting**
   - Node.js 16+ installed
   - Server with:
     - Public IP address (for webhooks)
     - SSL certificate (HTTPS required for webhooks)
     - Port 5000 (or configure custom port)
   - Recommended: AWS, DigitalOcean, Heroku, or similar

### 6. **Domain (Optional but Recommended)**
   - Domain name for production
   - SSL certificate
   - DNS configuration

## 🔧 Setup Steps

### Step 1: Install Dependencies
```bash
npm run install-all
```

### Step 2: Configure Environment Variables
1. Copy `.env.example` to `.env`
2. Fill in all required values:
   ```env
   # Database
   MONGODB_URI=your-mongodb-connection-string
   
   # WhatsApp
   WHATSAPP_API_KEY=your-whatsapp-api-key
   WHATSAPP_API_SECRET=your-whatsapp-api-secret
   WHATSAPP_PHONE_NUMBER=your-whatsapp-number
   
   # Google Maps
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   
   # Stripe
   STRIPE_SECRET_KEY=sk_test_your-key
   STRIPE_PUBLISHABLE_KEY=pk_test_your-key
   STRIPE_WEBHOOK_SECRET=whsec_your-secret
   
   # JWT Secret (generate a strong random string)
   JWT_SECRET=your-super-secret-jwt-key
   
   # Timezone
   TIMEZONE=Asia/Riyadh
   ```

### Step 3: Initialize Database
1. Start MongoDB (if using local)
2. Run the server - it will automatically create collections
3. Create admin account via `/api/auth/register` endpoint

### Step 4: Set Up WhatsApp Integration

**For WhatsApp Web.js (Development):**
1. Start the server
2. Scan QR code displayed in terminal
3. WhatsApp session will be saved

**For WhatsApp Business API (Production):**
1. Set up webhook endpoint: `https://yourdomain.com/api/whatsapp/webhook`
2. Configure webhook in WhatsApp Business API dashboard
3. Verify webhook signature

**For Twilio:**
1. Configure Twilio credentials in `.env`
2. Use `sendMessageViaTwilio()` method in whatsappService

### Step 5: Configure Payment Webhook
1. In Stripe Dashboard, go to Webhooks
2. Add endpoint: `https://yourdomain.com/api/payments/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret to `.env`

### Step 6: Set Up Admin Panel
1. Navigate to `http://localhost:3000` (development)
2. Register first admin account
3. Login and configure services

### Step 7: Create Initial Data
1. Create Provider user (role: 'provider')
2. Create Driver user (role: 'driver')
3. Create at least one Service
4. Test booking flow via WhatsApp

## 📱 WhatsApp Flow Implementation

The current implementation includes basic structure. You need to complete:

1. **Interactive Menu System**
   - Implement menu handlers in `whatsappService.js`
   - Create conversation state management
   - Add button/menu responses

2. **Booking Flow**
   - Step 1: Welcome message → Service selection
   - Step 2: Location request → Process location pin
   - Step 3: Date selection → Check district availability
   - Step 4: Time slot selection
   - Step 5: Payment method selection
   - Step 6: Payment processing (if online)
   - Step 7: Confirmation

3. **State Management**
   - Track user conversation state
   - Store temporary booking data
   - Handle interruptions and resumptions

## 🔐 Security Considerations

1. **Change Default Admin Password**
   - Immediately after first login
   - Use strong password

2. **JWT Secret**
   - Generate strong random string
   - Never commit to version control

3. **API Keys**
   - Never expose in frontend code
   - Use environment variables
   - Rotate keys regularly

4. **HTTPS**
   - Required for production
   - Required for webhooks

5. **Rate Limiting**
   - Consider adding rate limiting middleware
   - Protect against abuse

## 📊 Monitoring & Maintenance

1. **Logs**
   - Monitor server logs
   - Check WhatsApp connection status
   - Monitor payment webhooks

2. **Database**
   - Regular backups
   - Monitor size and performance

3. **Notifications**
   - Verify daily notifications are sent
   - Check provider/driver phone numbers

## 🚀 Deployment Checklist

- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] WhatsApp integration working
- [ ] Google Maps API working
- [ ] Stripe webhook configured
- [ ] Admin panel accessible
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Daily notifications tested
- [ ] Backup strategy in place

## 📞 Support & Testing

### Test WhatsApp Flow
1. Send message to WhatsApp number
2. Follow booking prompts
3. Share location
4. Complete booking

### Test Admin Panel
1. Login as admin
2. Create service
3. View bookings
4. Update booking status

### Test Payments
1. Create booking with online payment
2. Complete Stripe payment
3. Verify webhook received
4. Check booking status updated

## 🔄 Phase 1 Enhancements

When ready for Phase 1, you'll need to:
1. Update models to support multiple providers/drivers
2. Add provider selection in booking flow
3. Implement routing/dispatch logic
4. Add role-based permissions
5. Expand admin panel features

## 📝 Notes

- The system uses Riyadh timezone by default (configurable)
- Daily notifications sent at 23:59 local time
- One district per day rule is enforced
- Admin can override district locks for exceptions
- WhatsApp Web.js is for development only - use Business API for production
