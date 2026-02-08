const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  revokedAt: { type: Date, default: null },
  replacedByToken: { type: String, default: null }, // token rotation audit
});

// Auto-remove expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ token: 1 });

refreshTokenSchema.methods.isExpired = function () {
  return Date.now() >= this.expiresAt;
};

refreshTokenSchema.methods.isRevoked = function () {
  return !!this.revokedAt;
};

refreshTokenSchema.methods.isActive = function () {
  return !this.isExpired() && !this.isRevoked();
};

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
