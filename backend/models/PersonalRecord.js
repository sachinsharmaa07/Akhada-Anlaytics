const mongoose = require('mongoose');

const prSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  recordType: { type: String, enum: ['1RM', 'maxReps', 'maxVolume'], default: '1RM' },
  value: { type: Number, required: true },
  previousValue: { type: Number },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('PersonalRecord', prSchema);
