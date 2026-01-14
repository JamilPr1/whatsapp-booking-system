# 🚀 Manual Deployment Commands

## 📋 Git Commands (Push Code)

### Check Status
```bash
cd "c:\Users\Iamja\Desktop\Whatsapp Project"
git status
```

### Add All Changes
```bash
git add .
```

### Commit Changes
```bash
git commit -m "Your commit message here"
```

### Push to GitHub
```bash
git push origin main
```

### Complete Workflow (One Command)
```bash
cd "c:\Users\Iamja\Desktop\Whatsapp Project"
git add .
git commit -m "Update code"
git push origin main
```

## 🚀 Vercel Deployment Options

### Option 1: Automatic (After Git Push)
Agar Vercel Git se connected hai:
1. Code push karein: `git push origin main`
2. Vercel automatically detect karega
3. Deployment start ho jayega

### Option 2: Manual Redeploy (Vercel Dashboard)
1. **Vercel Dashboard** → Project → **Deployments** tab
2. Latest deployment pe **"..."** menu
3. **"Redeploy"** click karein
4. Wait 2-3 minutes

### Option 3: Vercel CLI (If Installed)
```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## ✅ Quick Test Commands

### Test Health Endpoint
```powershell
Invoke-RestMethod -Uri "https://whatsapp-booking-system.vercel.app/api/health"
```

### Test Login API
```powershell
$body = '{"email":"admin@example.com","password":"Admin123!"}'
Invoke-RestMethod -Uri "https://whatsapp-booking-system.vercel.app/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

## 🔍 Verify Deployment

### Check Latest Deployment
1. Vercel Dashboard → **Deployments** tab
2. Latest deployment ka status check karein
3. **"View Function Logs"** se errors check karein

### Check Environment Variables
1. Vercel Dashboard → **Settings** → **Environment Variables**
2. Verify ye set hain:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`

## 📝 Common Workflow

1. **Make changes** in code
2. **Commit**: `git add . && git commit -m "Description"`
3. **Push**: `git push origin main`
4. **Wait** for Vercel auto-deploy (1-2 minutes)
5. **Test**: Login API check karein

---

**Note**: Agar auto-deploy nahi ho, to manual redeploy karein Vercel Dashboard se!
