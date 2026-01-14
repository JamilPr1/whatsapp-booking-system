-- Supabase PostgreSQL Schema for WhatsApp Booking System
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number VARCHAR(20) UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  password TEXT,
  role VARCHAR(20) NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin', 'provider', 'driver')),
  whatsapp_id VARCHAR(255) UNIQUE,
  location JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_whatsapp_id ON users(whatsapp_id);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(20) DEFAULT 'main' CHECK (category IN ('main', 'sub')),
  parent_service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  duration INTEGER NOT NULL DEFAULT 60, -- in minutes
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  deposit_amount DECIMAL(10, 2) DEFAULT 0 CHECK (deposit_amount >= 0),
  is_active BOOLEAN DEFAULT true,
  provider_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_provider ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_parent ON services(parent_service_id);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES users(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  booking_time VARCHAR(5) NOT NULL, -- HH:mm format
  location JSONB NOT NULL, -- {latitude, longitude, address, district}
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled')),
  payment JSONB NOT NULL DEFAULT '{}', -- {method, status, amount, depositAmount, transactionId, stripePaymentIntentId}
  notes TEXT,
  whatsapp_conversation_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_client ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
-- Index on location JSONB field (for general JSON queries)
CREATE INDEX IF NOT EXISTS idx_bookings_location ON bookings USING GIN (location);
-- For district queries, we'll use a functional index with text pattern
CREATE INDEX IF NOT EXISTS idx_bookings_district ON bookings ((location->>'district'));

-- Schedules table
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  district VARCHAR(255) NOT NULL,
  provider_id UUID REFERENCES users(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  bookings UUID[] DEFAULT ARRAY[]::UUID[],
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(date);
CREATE INDEX IF NOT EXISTS idx_schedules_district ON schedules(district);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist (for re-running schema)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
DROP TRIGGER IF EXISTS update_schedules_updated_at ON schedules;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - Enable for production
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running schema)
DROP POLICY IF EXISTS "Service role can do everything on users" ON users;
DROP POLICY IF EXISTS "Service role can do everything on services" ON services;
DROP POLICY IF EXISTS "Service role can do everything on bookings" ON bookings;
DROP POLICY IF EXISTS "Service role can do everything on schedules" ON schedules;

-- Policies: Allow service role to do everything (for backend API)
CREATE POLICY "Service role can do everything on users" ON users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything on services" ON services
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything on bookings" ON bookings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything on schedules" ON schedules
  FOR ALL USING (auth.role() = 'service_role');
