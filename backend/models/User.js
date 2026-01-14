const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: false, // Not required for admin accounts
    unique: true,
    sparse: true, // Allow multiple nulls
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    select: false // Don't return password by default in queries
  },
  role: {
    type: String,
    enum: ['client', 'admin', 'provider', 'driver'],
    default: 'client'
  },
  whatsappId: {
    type: String,
    unique: true,
    sparse: true
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    district: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password if provided (for admin/provider accounts)
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
