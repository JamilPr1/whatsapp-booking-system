# 🚀 WhatsApp Booking System - Deployment Guide

## ✅ Project Status

- **Backend**: Supabase (PostgreSQL)
- **Frontend**: React + Vite
- **Deployment**: Vercel
- **Status**: ✅ Ready for Production

## 📋 Quick Setup

### 1. Environment Variables (Vercel)

Add these in **Vercel Dashboard** → **Settings** → **Environment Variables**:

```
SUPABASE_URL=https://nqosbgchdojiipndblqv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xb3NiZ2NoZG9qaWlwbmRibHF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQyODIyNiwiZXhwIjoyMDg0MDA0MjI2fQ.XzGHlr_LY-cmH7dC_n03X0apwTLQBO0dMebDvFGTVn0
JWT_SECRET=your-secret-key-minimum-32-characters
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123!
ADMIN_NAME=Admin User
```

### 2. Database Schema

Run the SQL from `backend/database/schema.sql` in **Supabase Dashboard** → **SQL Editor**.

### 3. Deploy

Push to GitHub - Vercel will auto-deploy.

## 🎯 Demo Data

Demo data is **automatically created** on first request:
- 5 clients
- 4 services
- 10 bookings (various statuses)
- Schedules for booking dates

No manual steps needed!

## 📁 Project Structure

```
├── api/
│   └── [...path].js          # Vercel serverless API handler
├── backend/
│   ├── app.js                 # Express app
│   ├── db.js                  # Supabase connection
│   ├── models/                # Supabase models (User, Booking, Service, Schedule)
│   ├── routes/                # API routes
│   ├── seedDemoData.js        # Clean demo data seeding
│   └── bootstrapDemoData.js   # Auto-seeding on startup
├── admin-panel/               # React frontend
└── vercel.json                # Vercel configuration
```

## 🔧 Key Features

- ✅ Automatic demo data seeding
- ✅ Client cleanup (keeps only 5)
- ✅ Supabase backend integration
- ✅ JWT authentication
- ✅ CORS configured for Vercel
- ✅ Serverless-ready

## 📝 Notes

- Demo data creates automatically on first API request
- Excess clients are automatically cleaned up
- Bookings are verified after creation
- All data is stored in Supabase PostgreSQL

---

**Last Updated**: After restructuring backend and fixing demo data seeding
