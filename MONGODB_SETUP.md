# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended) ⭐

### Quick Setup (5 minutes):

1. **Create Free Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email (free tier available)

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select a cloud provider and region
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access" → "Add New Database User"
   - Username: `admin` (or your choice)
   - Password: Create a strong password (save it!)
   - Database User Privileges: "Atlas admin"
   - Click "Add User"

4. **Whitelist Your IP**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update .env File**
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add database name at the end: `...mongodb.net/whatsapp-booking?retryWrites=true&w=majority`
   - Final format: `mongodb+srv://admin:YourPassword@cluster0.xxxxx.mongodb.net/whatsapp-booking?retryWrites=true&w=majority`

✅ **Good news**: the backend already reads `MONGODB_URI` automatically in:
- `backend/server.js`
- `backend/scripts/seedDemoData.js`
- `backend/scripts/resetAdminPassword.js`

## Option 2: Local MongoDB

### Windows Installation:

1. **Download MongoDB**
   - Go to: https://www.mongodb.com/try/download/community
   - Select Windows, MSI package
   - Download and install

2. **Start MongoDB Service**
   ```powershell
   # Install as Windows Service (during installation)
   # Or start manually:
   mongod --dbpath "C:\data\db"
   ```

3. **Verify It's Running**
   ```powershell
   # Check if port 27017 is listening
   Test-NetConnection -ComputerName localhost -Port 27017
   ```

4. **Update .env** (if needed)
   ```
   MONGODB_URI=mongodb://localhost:27017/whatsapp-booking
   ```

## After Setup:

1. Restart your backend server
2. Check console for: `✅ MongoDB connected`
3. Try login again!
