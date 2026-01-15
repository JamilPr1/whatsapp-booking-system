# 🔐 Vercel Environment Variables - Complete List

## 📋 Required Environment Variables

Add these in **Vercel Dashboard** → **Settings** → **Environment Variables**

### 1. Database (Supabase) - REQUIRED

```
SUPABASE_URL=https://nqosbgchdojiipndblqv.supabase.co
```

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xb3NiZ2NoZG9qaWlwbmRibHF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQyODIyNiwiZXhwIjoyMDg0MDA0MjI2fQ.XzGHlr_LY-cmH7dC_n03X0apwTLQBO0dMebDvFGTVn0
```

**Note**: Use `SUPABASE_SERVICE_ROLE_KEY` (not ANON_KEY) for backend API access.

---

### 2. Authentication - REQUIRED

```
JWT_SECRET=your-secret-key-here-minimum-32-characters-long
```

**Generate a secure JWT secret:**
- Use a random string (minimum 32 characters)
- Example: `openssl rand -base64 32` (run in terminal)
- Or use an online generator: https://generate-secret.vercel.app/32

---

### 3. Admin User (Auto-Creation) - REQUIRED

```
ADMIN_EMAIL=admin@example.com
```

```
ADMIN_PASSWORD=Admin123!
```

```
ADMIN_NAME=Admin User
```

**Note**: Admin user will be automatically created on first deployment if these are set.

---

## 🔧 Optional Environment Variables

### 4. Frontend (Supabase) - OPTIONAL

Only needed if frontend needs direct Supabase access:

```
NEXT_PUBLIC_SUPABASE_URL=https://nqosbgchdojiipndblqv.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xb3NiZ2NoZG9qaWlwbmRibHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MjgyMjYsImV4cCI6MjA4NDAwNDIyNn0.wu0AQtmqzXS2Ma-flcJzt62THDgNTSjeTlrUmHipCqU
```

---

### 5. CORS & Frontend URL - OPTIONAL

```
FRONTEND_URL=https://your-app.vercel.app
```

**Note**: Vercel automatically sets `VERCEL_URL`, but you can override with this.

---

### 6. WhatsApp Integration - OPTIONAL

Only enable if you want WhatsApp Web.js integration:

```
ENABLE_WHATSAPP_WEB=false
```

**Note**: Set to `true` only if you have a dedicated server (not recommended for serverless).

---

### 7. Payment Integration (Stripe) - OPTIONAL

Only needed if using Stripe payments:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

### 8. Google Maps API - OPTIONAL

Only needed if using Google Maps for location services:

```
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

---

### 9. Twilio (SMS) - OPTIONAL

Only needed if using Twilio for SMS:

```
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 📝 Step-by-Step Setup Instructions

### In Vercel Dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Click **Add New**
3. For each variable:
   - **Key**: Enter the variable name (e.g., `SUPABASE_URL`)
   - **Value**: Enter the value
   - **Environments**: Select **Production**, **Preview**, and **Development** (or just Production)
   - Click **Save**
4. Repeat for all required variables

### Minimum Required Variables:

✅ `SUPABASE_URL`  
✅ `SUPABASE_SERVICE_ROLE_KEY`  
✅ `JWT_SECRET`  
✅ `ADMIN_EMAIL`  
✅ `ADMIN_PASSWORD`  
✅ `ADMIN_NAME` (optional but recommended)

---

## ✅ After Adding Variables

1. **Redeploy** your project:
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger auto-deploy

2. **Verify**:
   - Check deployment logs for errors
   - Test `/api/health` endpoint
   - Test admin login with `ADMIN_EMAIL` and `ADMIN_PASSWORD`

---

## 🔍 Quick Copy-Paste List

Copy this entire block and fill in the values:

```
SUPABASE_URL=https://nqosbgchdojiipndblqv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xb3NiZ2NoZG9qaWlwbmRibHF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQyODIyNiwiZXhwIjoyMDg0MDA0MjI2fQ.XzGHlr_LY-cmH7dC_n03X0apwTLQBO0dMebDvFGTVn0
JWT_SECRET=CHANGE_THIS_TO_A_SECURE_RANDOM_STRING_MIN_32_CHARS
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123!
ADMIN_NAME=Admin User
```

---

## ⚠️ Important Notes

- **Never commit** environment variables to Git
- **JWT_SECRET** should be a strong random string (32+ characters)
- **SUPABASE_SERVICE_ROLE_KEY** has full database access - keep it secret
- After adding variables, **always redeploy** for changes to take effect
- Use **Production** environment for live site, **Preview** for pull requests

---

## 🐛 Troubleshooting

**If deployment fails:**
1. Check Vercel logs for specific errors
2. Verify all required variables are set
3. Ensure `JWT_SECRET` is at least 32 characters
4. Check Supabase credentials are correct
5. Verify database schema is created in Supabase

**If login doesn't work:**
1. Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set correctly
2. Verify Supabase `users` table exists
3. Check deployment logs for admin creation messages
4. Test `/api/health` endpoint first

---

**Last Updated**: After fixing npm ci issues and updating Vercel configuration