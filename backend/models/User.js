const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String }, // nullable for OAuth users
  username: { type: String, unique: true, sparse: true, trim: true, lowercase: true },

  // Auth provider
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String, unique: true, sparse: true },
  avatar: { type: String }, // Google profile picture

  // Onboarding
  onboardingStatus: { type: String, enum: ['INCOMPLETE', 'COMPLETE'], default: 'COMPLETE' },

  // Profile
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  age: { type: Number },
  weight: { type: Number },
  height: { type: Number },
  activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'veryActive'], default: 'moderate' },
  dailyGoal: {
    type: Object,
    default: { calories: 2200, protein: 160, carbs: 250, fats: 70 }
  },

  isDeleted: { type: Boolean, default: false }, // soft delete
}, { timestamps: true });

// Index for fast lookups
userSchema.index({ googleId: 1 });
userSchema.index({ email: 1, authProvider: 1 });

module.exports = mongoose.model('User', userSchema);
