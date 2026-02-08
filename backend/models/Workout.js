const mongoose = require('mongoose');

const setSchema = new mongoose.Schema(
  {
    setNumber: { type: Number },
    reps: { type: Number },
    weight: { type: Number },
    unit: { type: String, default: 'kg' },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

const workoutExerciseSchema = new mongoose.Schema(
  {
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    exerciseName: { type: String },
    muscleGroup: { type: String },
    secondaryMuscles: [{ type: String }],
    sets: [setSchema],
    notes: { type: String },
    // Optional computed metrics for analytics (populated at write time)
    metrics: {
      totalReps: { type: Number, default: 0 },
      totalVolume: { type: Number, default: 0 },
      completedSets: { type: Number, default: 0 },
    },
  },
  { _id: false }
);

const workoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    // Explicit log date for analytics and streaks
    logDate: { type: Date },
    exercises: [workoutExerciseSchema],
    totalVolume: { type: Number, default: 0 },
    totalReps: { type: Number, default: 0 },
    derived: {
      caloriesBurned: { type: Number, default: 0 },
      weeklyOverloadPct: { type: Number, default: 0 },
      muscleFrequency: { type: Object, default: {} },
    },
    duration: { type: Number },
    notes: { type: String },
  },
  { timestamps: true }
);

// Keep logDate aligned with date for legacy and new entries
workoutSchema.pre('save', function () {
  if (!this.logDate && this.date) {
    this.logDate = this.date;
  }
});

// Compound index for fast per-user time-based lookups (today/weekly/monthly/streaks)
workoutSchema.index({ user: 1, date: 1 });
workoutSchema.index({ user: 1, logDate: 1 });

module.exports = mongoose.model('Workout', workoutSchema);
