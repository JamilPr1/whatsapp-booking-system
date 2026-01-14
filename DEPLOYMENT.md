# Deployment Guide - Vercel

This guide will help you deploy the WhatsApp Booking System to Vercel.

## Architecture

- **Frontend (Admin Panel)**: Deploy to Vercel
- **Backend (API)**: Deploy to Railway/Render/Heroku (recommended) or use Vercel Serverless Functions

## Option 1: Frontend on Vercel + Backend on Railway (Recommended)

### Step 1: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository: `furqansaadat855/whatsapp-booking-system`
4. Railway will auto-detect Node.js
5. Set Root Directory to: `backend`
6. Add Environment Variables:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=production
   TIMEZONE=Asia/Riyadh
   INIT_WHATSAPP=false
   GOOGLE_MAPS_API_KEY=your_google_maps_key
   STRIPE_SECRET_KEY=your_stripe_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```
7. Railway will generate a URL like: `https://your-app.railway.app`

### Step 2: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository: `furqansaadat855/whatsapp-booking-system`
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `admin-panel`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-app.railway.app
   ```
6. Click "Deploy"

### Step 3: Update API URLs

After deployment, update the backend CORS settings to allow your Vercel domain:

In `backend/server.js`, update CORS:
```javascript
app.use(cors({
  origin: [
    'https://your-vercel-app.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

## Option 2: Full Stack on Vercel (Serverless Functions)

### Step 1: Create API Routes

Create `api/index.js` in the root:
```javascript
const express = require('express');
const app = express();
// Import all your backend routes
module.exports = app;
```

### Step 2: Update vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    },
    {
      "src": "admin-panel/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "admin-panel/dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/admin-panel/dist/$1"
    }
  ]
}
```

## Environment Variables Checklist

### Backend (Railway/Render)
- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Random secret for JWT tokens
- [ ] `PORT` - Port number (usually 5000)
- [ ] `NODE_ENV` - Set to `production`
- [ ] `TIMEZONE` - `Asia/Riyadh`
- [ ] `INIT_WHATSAPP` - `false` for production (or `true` if you want WhatsApp)
- [ ] `GOOGLE_MAPS_API_KEY` - Google Maps API key
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key
- [ ] `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

### Frontend (Vercel)
- [ ] `VITE_API_URL` - Your backend URL (e.g., `https://your-app.railway.app`)

## Post-Deployment Steps

1. **Test the API**: Visit `https://your-backend-url.railway.app/api/health`
2. **Test the Frontend**: Visit your Vercel URL
3. **Create Admin Account**: Use the reset password script or register endpoint
4. **Seed Demo Data** (optional): Run the seed script on your backend

## Troubleshooting

### CORS Errors
- Make sure backend CORS includes your Vercel domain
- Check that `VITE_API_URL` is set correctly

### API Not Found
- Verify `VITE_API_URL` environment variable
- Check backend is running and accessible
- Test backend health endpoint

### Build Failures
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Check build logs in Vercel dashboard

## Quick Deploy Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd admin-panel
vercel

# Follow prompts and deploy
```

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Railway/Render logs
3. Verify all environment variables are set
4. Test API endpoints directly
