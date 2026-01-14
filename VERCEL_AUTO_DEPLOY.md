# 🚀 Automatic Vercel Deployment Setup

## Option 1: Connect GitHub to Vercel (Easiest - Recommended)

### Step 1: Connect Repository in Vercel

1. Go to: https://vercel.com/jamils-projects-d0a48d3a/whatsapp-booking-system/settings/git
2. Click **"Connect Git Repository"**
3. Select: `furqansaadat855-code/whatsapp-booking-system`
4. Click **"Connect"**

### Step 2: Configure Project Settings

1. Go to: https://vercel.com/jamils-projects-d0a48d3a/whatsapp-booking-system/settings
2. **General** → **Build & Development Settings**:
   - **Root Directory**: `admin-panel`
   - **Framework Preset**: `Vite` (auto-detect)
   - **Build Command**: `npm run build` (auto-detect)
   - **Output Directory**: `dist` (auto-detect)
   - **Install Command**: `npm install` (auto-detect)
3. Click **"Save"**

### Step 3: Add Environment Variable

1. **Settings** → **Environment Variables**
2. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `http://localhost:5000`
   - **Environments**: All (Production, Preview, Development)
3. Click **"Save"**

### Step 4: Trigger Deployment

After connecting GitHub, Vercel will automatically:
- ✅ Detect the repository
- ✅ Start building
- ✅ Deploy automatically

**OR** manually trigger:
1. Go to **Deployments** tab
2. Click **"Redeploy"**

---

## Option 2: Use Vercel CLI (Alternative)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Link Project

```bash
cd admin-panel
vercel link
```

Follow prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **Yes**
- What's the name of your project? `whatsapp-booking-system`

### Step 4: Deploy

```bash
vercel --prod
```

---

## Option 3: GitHub Actions (Automatic)

I've created a GitHub Actions workflow (`.github/workflows/deploy-vercel.yml`).

### Setup:

1. Go to Vercel Dashboard → Settings → Tokens
2. Create a new token
3. Go to GitHub → Repository → Settings → Secrets → Actions
4. Add these secrets:
   - `VERCEL_TOKEN` - Your Vercel token
   - `VERCEL_ORG_ID` - Your Vercel org ID (from Vercel dashboard)
   - `VERCEL_PROJECT_ID` - Your project ID (from Vercel dashboard)
   - `VITE_API_URL` - Your API URL (optional)

### Get Vercel IDs:

1. Go to: https://vercel.com/jamils-projects-d0a48d3a/whatsapp-booking-system/settings
2. Scroll to bottom → **Project ID** is there
3. For **Org ID**: Go to Team Settings → General

---

## ✅ Recommended: Option 1 (GitHub Integration)

This is the easiest and most reliable method. Once connected:
- Every push to `main` branch automatically deploys
- Preview deployments for pull requests
- Automatic builds and deployments

---

## 🔍 Troubleshooting

### No Deployments Showing:

1. **Check Git Connection**:
   - Settings → Git → Verify repository is connected
   - If not connected, click "Connect Git Repository"

2. **Check Root Directory**:
   - Settings → General → Root Directory must be `admin-panel`

3. **Trigger Manual Deployment**:
   - Deployments → Click "Redeploy"

### Build Fails:

1. Check build logs in Vercel dashboard
2. Verify Root Directory is `admin-panel`
3. Check environment variables are set
4. Verify `package.json` has build script

---

## 📞 Quick Fix

If nothing works, try this:

1. **Delete the project in Vercel** (if exists)
2. **Create new project**:
   - Go to: https://vercel.com/new
   - Import: `furqansaadat855-code/whatsapp-booking-system`
   - Set **Root Directory**: `admin-panel`
   - Click **"Deploy"**

This will create a fresh deployment.
