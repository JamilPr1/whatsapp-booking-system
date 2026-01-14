# 🔧 Vercel Deployment Fix Instructions

## ✅ Code Updated and Pushed!

I've fixed the Vercel configuration and pushed the changes to GitHub.

## 📋 Now Do This in Vercel Dashboard:

### Step 1: Go to Vercel Project Settings

1. Visit: https://vercel.com/jamils-projects-d0a48d3a/whatsapp-booking-system/settings
2. Or go to: https://vercel.com/dashboard → Select your project → Settings

### Step 2: Configure Build Settings

Go to **Settings** → **General** → **Build & Development Settings**:

- **Framework Preset**: `Vite` (or `Other`)
- **Root Directory**: Leave empty (or set to `.` for root)
- **Build Command**: `cd admin-panel && npm install && npm run build`
- **Output Directory**: `admin-panel/dist`
- **Install Command**: `cd admin-panel && npm install`

### Step 3: Connect Git Repository

Go to **Settings** → **Git**:

1. Click **"Connect Git Repository"**
2. Select: `furqansaadat855-code/whatsapp-booking-system`
3. Ensure it's connected

### Step 4: Add Environment Variable

Go to **Settings** → **Environment Variables**:

Add:
- **Name**: `VITE_API_URL`
- **Value**: `http://localhost:5000` (update after backend deploy)
- **Environments**: Production, Preview, Development (select all)

Click **Save**

### Step 5: Trigger Deployment

1. Go to **Deployments** tab
2. Click **"..."** (three dots) on the latest deployment
3. Click **"Redeploy"**
4. OR: Go to **Settings** → **Git** → Click **"Redeploy"**

### Step 6: Wait for Build

- Build will take 2-3 minutes
- Watch the build logs for any errors
- Once successful, you'll get a URL

## 🎯 Your Live URL Will Be:

After successful deployment, your app will be available at:
- **Production**: `https://whatsapp-booking-system-rho.vercel.app`
- Or check the **Domains** section in Vercel dashboard

## ⚠️ If Build Fails:

1. Check build logs in Vercel dashboard
2. Common issues:
   - Missing environment variables
   - Build command incorrect
   - Root directory not set correctly

## 📞 Need Help?

If deployment still fails, share the build logs from Vercel dashboard.
