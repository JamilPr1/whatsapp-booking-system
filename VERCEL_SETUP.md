# 🚀 Deploy to Vercel - Step by Step

## ✅ Code is Already on GitHub!

Your code has been pushed to: https://github.com/furqansaadat855-code/whatsapp-booking-system

## Now Deploy to Vercel:

### Step 1: Go to Vercel

1. Visit: **https://vercel.com**
2. Click **"Sign Up"** or **"Log In"**
3. Sign in with **GitHub** (use the same GitHub account)

### Step 2: Import Project

1. Click **"Add New Project"**
2. You'll see your repositories listed
3. Find: **`furqansaadat855-code/whatsapp-booking-system`**
4. Click **"Import"**

### Step 3: Configure Project

**Project Settings:**
- **Framework Preset**: Select **"Vite"** (or leave as "Other")
- **Root Directory**: Click "Edit" → Set to: **`admin-panel`**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Environment Variables

Click **"Environment Variables"** and add:

**Name**: `VITE_API_URL`  
**Value**: `https://your-backend-url.railway.app`  
*(Update this after deploying backend)*

For now, you can set it to: `http://localhost:5000` (we'll update later)

### Step 5: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Vercel will give you a URL like: `https://whatsapp-booking-system.vercel.app`

---

## 🔧 Deploy Backend to Railway

### Step 1: Go to Railway

1. Visit: **https://railway.app**
2. Sign up with **GitHub**
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose: **`furqansaadat855-code/whatsapp-booking-system`**

### Step 2: Configure Service

1. Railway will auto-detect Node.js
2. Click on the service → **Settings**
3. Set **Root Directory**: `backend`
4. Set **Start Command**: `node server.js`

### Step 3: Environment Variables

In Railway Dashboard → **Variables**, add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp-booking
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
PORT=5000
NODE_ENV=production
TIMEZONE=Asia/Riyadh
INIT_WHATSAPP=false
FRONTEND_URL=https://your-vercel-app.vercel.app
GOOGLE_MAPS_API_KEY=your-google-maps-key
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable
```

### Step 4: Get Backend URL

1. Railway will deploy automatically
2. Go to **Settings** → **Networking**
3. Click **"Generate Domain"**
4. Copy the URL (e.g., `https://whatsapp-booking-production.up.railway.app`)

### Step 5: Update Frontend

1. Go back to **Vercel Dashboard**
2. **Settings** → **Environment Variables**
3. Update `VITE_API_URL` with your Railway backend URL
4. Go to **Deployments** → Click **"..."** → **"Redeploy"**

---

## ✅ Done!

Your app is now live:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`

---

## 🔗 Quick Links

- **Vercel**: https://vercel.com
- **Railway**: https://railway.app
- **GitHub Repo**: https://github.com/furqansaadat855-code/whatsapp-booking-system
