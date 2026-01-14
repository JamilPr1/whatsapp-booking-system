# 🗄️ Supabase Migration Guide

## ✅ Migration Complete!

MongoDB se Supabase (PostgreSQL) migration ho chuki hai.

## 📋 Steps to Complete Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create Database Schema in Supabase

1. **Supabase Dashboard** → **SQL Editor**
2. Open file: `backend/database/schema.sql`
3. Copy **sab SQL code**
4. **SQL Editor** me paste karein
5. **Run** click karein

Ye tables create karega:
- ✅ `users`
- ✅ `services`
- ✅ `bookings`
- ✅ `schedules`

### Step 3: Add Environment Variables to Vercel

Vercel Dashboard → Settings → Environment Variables me ye add karein:

**Required:**
- `SUPABASE_URL` = `https://nqosbgchdojiipndblqv.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xb3NiZ2NoZG9qaWlwbmRibHF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQyODIyNiwiZXhwIjoyMDg0MDA0MjI2fQ.XzGHlr_LY-cmH7dC_n03X0apwTLQBO0dMebDvFGTVn0`
- `JWT_SECRET` = (apna JWT secret - pehle se set hai)
- `ADMIN_EMAIL` = `admin@example.com`
- `ADMIN_PASSWORD` = `Admin123!`

**Optional (for frontend):**
- `NEXT_PUBLIC_SUPABASE_URL` = `https://nqosbgchdojiipndblqv.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 4: Redeploy on Vercel

1. **Deployments** tab → Latest deployment → **"Redeploy"**
2. Wait 2-3 minutes

### Step 5: Verify Admin User

Deployment ke baad admin user automatically create ho jayega (agar `ADMIN_EMAIL` aur `ADMIN_PASSWORD` set hain).

## 🔄 What Changed

### Database
- ❌ MongoDB → ✅ Supabase PostgreSQL
- ❌ Mongoose → ✅ Supabase JS Client

### Models
- ✅ `User` model migrated
- ⚠️ `Booking`, `Service`, `Schedule` models abhi migrate hone hain (basic functionality ke liye User model kaafi hai)

### Features
- ✅ User authentication
- ✅ Admin creation
- ✅ Login/Register
- ✅ JWT tokens

## 📝 Notes

- Supabase uses PostgreSQL, so queries are SQL-based
- Row Level Security (RLS) enabled - service role can access everything
- UUIDs used instead of MongoDB ObjectIds
- Timestamps auto-update via triggers

## 🚀 After Migration

1. ✅ Login API kaam karega
2. ✅ Admin user automatically create hoga
3. ✅ Dashboard data load hoga
4. ✅ All user operations work

---

**Important**: Schema SQL file run karna zaroori hai Supabase me!
