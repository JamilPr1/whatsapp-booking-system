# 🔐 Vercel Environment Variables Setup for Supabase

## ✅ Required Environment Variables

Vercel Dashboard → **Settings** → **Environment Variables** me ye add karein:

### Database (Supabase)
```
SUPABASE_URL=https://nqosbgchdojiipndblqv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xb3NiZ2NoZG9qaWlwbmRibHF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQyODIyNiwiZXhwIjoyMDg0MDA0MjI2fQ.XzGHlr_LY-cmH7dC_n03X0apwTLQBO0dMebDvFGTVn0
```

### Authentication
```
JWT_SECRET=<your-existing-jwt-secret>
```

### Admin User (Auto-Creation)
```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123!
ADMIN_NAME=Admin User
```

### Optional (Frontend)
```
NEXT_PUBLIC_SUPABASE_URL=https://nqosbgchdojiipndblqv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xb3NiZ2NoZG9qaWlwbmRibHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MjgyMjYsImV4cCI6MjA4NDAwNDIyNn0.wu0AQtmqzXS2Ma-flcJzt62THDgNTSjeTlrUmHipCqU
```

## 📋 Step-by-Step

1. **Vercel Dashboard** → Project → **Settings** → **Environment Variables**
2. Har variable ke liye:
   - **Key** type karein (e.g., `SUPABASE_URL`)
   - **Value** paste karein
   - **Environments** select karein: Production, Preview, Development (sab)
   - **Add** click karein
3. **Save** karein

## ⚠️ Important Notes

- `SUPABASE_SERVICE_ROLE_KEY` use karein (not ANON_KEY) - backend ke liye zaroori hai
- `JWT_SECRET` pehle se set hai to update nahi karna
- `ADMIN_EMAIL` aur `ADMIN_PASSWORD` set karne se admin automatically create ho jayega

## ✅ After Adding Variables

1. **Redeploy** karein (Deployments → Redeploy)
2. Admin user automatically create ho jayega
3. Login test karein: `admin@example.com` / `Admin123!`

---

**Note**: Environment variables add karne ke baad redeploy zaroori hai!
