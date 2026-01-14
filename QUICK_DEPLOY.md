# 🚀 Quick Vercel Deployment

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

## Step 2: Deploy Frontend to Vercel

1. Go to **vercel.com** → Sign in with GitHub
2. Click **"Add New Project"**
3. Import: `furqansaadat855/whatsapp-booking-system`
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: `admin-panel`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.railway.app` (update after backend deploy)
6. Click **"Deploy"**

## Step 3: Deploy Backend to Railway

1. Go to **railway.app** → Sign in with GitHub
2. **New Project** → **Deploy from GitHub repo**
3. Select your repo
4. Settings:
   - **Root Directory**: `backend`
   - **Start Command**: `node server.js`
5. Add Environment Variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   NODE_ENV=production
   TIMEZONE=Asia/Riyadh
   INIT_WHATSAPP=false
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
6. Copy Railway URL (e.g., `https://your-app.railway.app`)

## Step 4: Update Frontend API URL

1. Go to Vercel Dashboard
2. **Settings** → **Environment Variables**
3. Update `VITE_API_URL` with your Railway backend URL
4. **Redeploy** frontend

## ✅ Done!

Your app is live:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`
