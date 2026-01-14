# Backend Environment Variables (Template)

Set these environment variables in your backend hosting provider (Railway/Render/etc).
**Do not commit real secrets** to GitHub.

## Required

- **MONGODB_URI**: MongoDB Atlas connection string (your cluster URL + db name)
- **JWT_SECRET**: long random string (at least 32 chars)

## Recommended

- **FRONTEND_URL**: allowed frontend origins for CORS
  - You can provide multiple, comma-separated
  - Example: `https://whatsapp-booking-system-rho.vercel.app,http://localhost:3000`
- **NODE_ENV**: `production`
- **PORT**: `5000` (or the port your host provides)
- **TIMEZONE**: `Asia/Riyadh`
- **INIT_WHATSAPP**: `false` (recommended for production)

