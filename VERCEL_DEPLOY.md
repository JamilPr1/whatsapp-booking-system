# Quick Vercel Deployment Guide

## 🚀 Deploy Frontend to Vercel

### Step 1: Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import repository: `furqansaadat855/whatsapp-booking-system`

### Step 2: Configure Project

**Project Settings:**
- **Framework Preset**: Vite
- **Root Directory**: `admin-panel`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Environment Variables

Add in Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-url.railway.app
```

**Important**: Replace `your-backend-url.railway.app` with your actual backend URL after deploying the backend.

### Step 4: Deploy

Click "Deploy" and wait for build to complete.

---

## 🔧 Deploy Backend to Railway (Recommended)

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose: `furqansaadat855/whatsapp-booking-system`

### Step 2: Configure Service

1. Railway will auto-detect Node.js
2. Click on the service → Settings
3. Set **Root Directory**: `backend`
4. Set **Start Command**: `node server.js`

### Step 3: Environment Variables

Add in Railway Dashboard → Variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp-booking
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=production
TIMEZONE=Asia/Riyadh
INIT_WHATSAPP=false
GOOGLE_MAPS_API_KEY=your-google-maps-key
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable
```

### Step 4: Deploy

Railway will automatically deploy. Copy the generated URL (e.g., `https://your-app.railway.app`)

### Step 5: Update CORS

In `backend/server.js`, update CORS to include your Vercel domain:

```javascript
app.use(cors({
  origin: [
    'https://your-vercel-app.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

Then redeploy on Railway.

---

## 🔄 Update Frontend API URL

After backend is deployed:

1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Update `VITE_API_URL` with your Railway backend URL
4. Redeploy frontend

---

## ✅ Verify Deployment

1. **Backend Health**: Visit `https://your-backend.railway.app/api/health`
2. **Frontend**: Visit your Vercel URL
3. **Login**: Use admin credentials to test

---

## 📝 Alternative: Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add environment variables (same as Railway)
6. Deploy

---

## 🐛 Troubleshooting

### CORS Errors
- Ensure backend CORS includes Vercel domain
- Check `VITE_API_URL` is correct

### 404 on API Calls
- Verify `VITE_API_URL` environment variable
- Check backend is running
- Test backend health endpoint

### Build Failures
- Check Node.js version (18+)
- Verify all dependencies installed
- Check build logs

---

## 📞 Need Help?

Check deployment logs in:
- Vercel: Dashboard → Deployments → View Logs
- Railway: Service → Deployments → View Logs
