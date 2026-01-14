# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 16+ installed
- MongoDB running (local or Atlas)
- Basic understanding of APIs

### Step 1: Install Dependencies
```bash
npm run install-all
```

### Step 2: Set Up Environment
1. Copy `.env.example` to `.env`
2. At minimum, configure:
   ```env
   MONGODB_URI=mongodb://localhost:27017/whatsapp-booking
   JWT_SECRET=change-this-to-a-random-string
   ```

### Step 3: Start the Server
```bash
npm run server
```

### Step 4: Create Admin Account
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "YourSecurePassword123!",
    "name": "Admin User"
  }'
```

### Step 5: Start Admin Panel
In a new terminal:
```bash
cd admin-panel
npm start
```

Visit `http://localhost:3000` and login with your admin credentials.

## 📱 Testing WhatsApp (Development)

### Option 1: WhatsApp Web.js (Quick Test)
1. Start server: `npm run server`
2. Look for QR code in terminal
3. Scan with your WhatsApp mobile app
4. Send a message to the bot number

### Option 2: WhatsApp Business API (Production)
1. Get API credentials from Meta
2. Configure in `.env`
3. Set webhook URL in Meta dashboard

## 🧪 Test the System

### 1. Create a Service
- Login to admin panel
- Go to Services
- Click "Add Service"
- Fill in details and save

### 2. Test Booking Flow
- Send WhatsApp message to your bot
- Follow the prompts
- Share location
- Complete booking

### 3. View Booking
- Go to Admin Panel → Bookings
- See your test booking

## 🔧 Next Steps

1. **Configure Google Maps API**
   - Get API key from Google Cloud Console
   - Add to `.env`: `GOOGLE_MAPS_API_KEY=your-key`

2. **Set Up Stripe**
   - Create Stripe account
   - Get test keys
   - Add to `.env`
   - Configure webhook

3. **Set Up WhatsApp Business API**
   - For production, use Meta's WhatsApp Business API
   - Configure webhooks
   - Test message flow

4. **Deploy**
   - Choose hosting (AWS, DigitalOcean, etc.)
   - Set environment variables
   - Configure domain and SSL
   - Update webhook URLs

## 📚 Full Documentation

See `REQUIREMENTS.md` for complete setup instructions and all required credentials.
