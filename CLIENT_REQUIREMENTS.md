# 📋 Client Requirements Checklist

This document lists everything **YOU** need to provide to complete the setup of the WhatsApp Booking System.

## ✅ Required Items

### 1. WhatsApp Business API Access ⭐ **CRITICAL**

**Choose ONE of the following options:**

#### Option A: WhatsApp Business API (Recommended for Production)
- [ ] Meta/Facebook Business Account
- [ ] WhatsApp Business API access approved
- [ ] API Key
- [ ] API Secret
- [ ] WhatsApp Business Phone Number
- [ ] Webhook verification token

**Where to get it:**
- Apply at: https://www.facebook.com/business/help/180505538626519
- Or use a WhatsApp Business API provider (Twilio, MessageBird, etc.)

#### Option B: WhatsApp Web.js (Development Only)
- [ ] Personal WhatsApp number for testing
- [ ] Ability to scan QR codes
- ⚠️ **Note:** This is for development/testing only, not production

#### Option C: Twilio WhatsApp API
- [ ] Twilio account (https://www.twilio.com)
- [ ] Twilio Account SID
- [ ] Twilio Auth Token
- [ ] Twilio WhatsApp-enabled phone number

---

### 2. Google Maps API Key ⭐ **REQUIRED**

- [ ] Google Cloud Platform account (https://cloud.google.com)
- [ ] Billing enabled (free tier available)
- [ ] API Key created
- [ ] **Geocoding API** enabled
- [ ] **Maps JavaScript API** enabled (optional, for route links)
- [ ] API restrictions configured (recommended)

**Steps:**
1. Go to Google Cloud Console
2. Create a project
3. Enable Geocoding API
4. Create API key
5. Set restrictions (optional but recommended)

---

### 3. Payment Gateway - Stripe ⭐ **REQUIRED**

- [ ] Stripe account (https://stripe.com)
- [ ] Stripe Secret Key (starts with `sk_test_` for testing)
- [ ] Stripe Publishable Key (starts with `pk_test_` for testing)
- [ ] Webhook endpoint configured
- [ ] Webhook secret (starts with `whsec_`)

**Steps:**
1. Create Stripe account
2. Get test keys from Dashboard → Developers → API keys
3. Set up webhook: Dashboard → Developers → Webhooks
4. Add endpoint: `https://yourdomain.com/api/payments/webhook`
5. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
6. Copy webhook signing secret

---

### 4. Database - MongoDB ⭐ **REQUIRED**

**Choose ONE:**

#### Option A: MongoDB Atlas (Cloud - Recommended)
- [ ] MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- [ ] Cluster created
- [ ] Database user created
- [ ] Connection string (URI)
- [ ] IP whitelist configured

#### Option B: Local MongoDB
- [ ] MongoDB installed locally
- [ ] MongoDB service running
- [ ] Default connection: `mongodb://localhost:27017/whatsapp-booking`

---

### 5. Server/Hosting ⭐ **REQUIRED FOR PRODUCTION**

- [ ] Server with Node.js 16+ installed
- [ ] Public IP address
- [ ] Domain name (optional but recommended)
- [ ] SSL certificate (HTTPS - required for webhooks)
- [ ] Port 5000 available (or configure custom port)

**Recommended Providers:**
- AWS (EC2, Elastic Beanstalk)
- DigitalOcean
- Heroku
- Railway
- Render

---

### 6. Domain & SSL (Production) ⭐ **REQUIRED FOR PRODUCTION**

- [ ] Domain name registered
- [ ] DNS configured
- [ ] SSL certificate (Let's Encrypt is free)
- [ ] HTTPS enabled

**Note:** Webhooks require HTTPS in production.

---

## 🔧 Configuration Steps

Once you have all credentials:

### Step 1: Create `.env` File
Copy `.env.example` to `.env` and fill in:

```env
# Database
MONGODB_URI=your-mongodb-connection-string

# WhatsApp
WHATSAPP_API_KEY=your-api-key
WHATSAPP_API_SECRET=your-api-secret
WHATSAPP_PHONE_NUMBER=your-whatsapp-number

# Google Maps
GOOGLE_MAPS_API_KEY=your-google-maps-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-secret

# Security
JWT_SECRET=generate-a-strong-random-string-here

# Timezone
TIMEZONE=Asia/Riyadh
```

### Step 2: Generate JWT Secret
Run this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 3: Test Each Integration
1. ✅ Test MongoDB connection
2. ✅ Test WhatsApp (send/receive message)
3. ✅ Test Google Maps (reverse geocode a location)
4. ✅ Test Stripe (create test payment)
5. ✅ Test Admin Panel login

---

## 📊 Cost Estimates

### Free Tier Available:
- ✅ MongoDB Atlas (512MB free)
- ✅ Google Maps API ($200 free credit/month)
- ✅ Stripe (test mode is free)

### Paid Services:
- 💰 WhatsApp Business API: Varies by provider
- 💰 Server hosting: $5-20/month (basic)
- 💰 Domain: $10-15/year
- 💰 SSL: Free (Let's Encrypt)

**Estimated Monthly Cost (Production):**
- Small scale: $20-50/month
- Medium scale: $50-150/month

---

## 🚨 Important Notes

1. **WhatsApp Business API Approval**
   - Can take 1-2 weeks for approval
   - Start with WhatsApp Web.js for development
   - Switch to Business API for production

2. **Google Maps API**
   - Free tier: $200 credit/month
   - Reverse geocoding: ~$5 per 1000 requests
   - Monitor usage in Google Cloud Console

3. **Stripe**
   - Use test keys during development
   - Switch to live keys for production
   - Test webhook locally using Stripe CLI

4. **Security**
   - Never commit `.env` file to git
   - Use strong passwords
   - Enable 2FA on all accounts
   - Rotate API keys regularly

---

## 📞 Getting Help

If you need help obtaining any of these credentials:

1. **WhatsApp Business API**: Contact Meta Business Support
2. **Google Maps**: Google Cloud Support
3. **Stripe**: Stripe Support (excellent documentation)
4. **MongoDB**: MongoDB Atlas Support

---

## ✅ Pre-Launch Checklist

Before going live, ensure:

- [ ] All API keys configured
- [ ] WhatsApp webhook verified
- [ ] Stripe webhook tested
- [ ] Google Maps API working
- [ ] Database backed up
- [ ] Admin password changed
- [ ] HTTPS enabled
- [ ] Domain configured
- [ ] Daily notifications tested
- [ ] Test booking completed end-to-end

---

## 🎯 Next Steps After Setup

1. Create your first service in Admin Panel
2. Test booking flow via WhatsApp
3. Configure provider and driver phone numbers
4. Test payment flow
5. Verify daily notifications
6. Go live! 🚀

---

**Need help?** Refer to `REQUIREMENTS.md` for detailed setup instructions for each service.
