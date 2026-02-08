const mongoose = require('mongoose');

const muscleGroupEnum = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'forearms',
  'abs',
  'obliques',
  'quads',
  'hamstrings',
  'glutes',
  'calves',
];

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    muscleGroup: { type: String, required: true, enum: muscleGroupEnum },
    secondaryMuscles: [{ type: String, enum: muscleGroupEnum }],
    equipment: { type: String, enum: ['barbell', 'dumbbell', 'machine', 'bodyweight', 'cable'] },
    description: { type: String },
    category: { type: String, enum: ['strength', 'cardio', 'flexibility'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exercise', exerciseSchema);
