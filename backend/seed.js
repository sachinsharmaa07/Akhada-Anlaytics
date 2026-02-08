const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const Exercise = require('./models/Exercise');

const exercises = [
  // ── CHEST ──
  { name: 'Bench Press', muscleGroup: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'barbell', category: 'strength', description: 'Classic chest press.' },
  { name: 'Incline Bench Press', muscleGroup: 'chest', secondaryMuscles: ['shoulders', 'triceps'], equipment: 'barbell', category: 'strength', description: 'Upper chest focus.' },
  { name: 'Decline Bench Press', muscleGroup: 'chest', secondaryMuscles: ['triceps'], equipment: 'barbell', category: 'strength', description: 'Lower chest focus.' },
  { name: 'Dumbbell Press', muscleGroup: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'dumbbell', category: 'strength', description: 'Dumbbell chest press.' },
  { name: 'Incline Dumbbell Press', muscleGroup: 'chest', secondaryMuscles: ['shoulders'], equipment: 'dumbbell', category: 'strength', description: 'Upper chest dumbbell press.' },
  { name: 'Dumbbell Flyes', muscleGroup: 'chest', secondaryMuscles: ['shoulders'], equipment: 'dumbbell', category: 'strength', description: 'Chest isolation fly.' },
  { name: 'Cable Crossover', muscleGroup: 'chest', secondaryMuscles: ['shoulders'], equipment: 'cable', category: 'strength', description: 'Cable chest fly.' },
  { name: 'Push Ups', muscleGroup: 'chest', secondaryMuscles: ['triceps', 'abs'], equipment: 'bodyweight', category: 'strength', description: 'Bodyweight chest exercise.' },
  { name: 'Chest Dips', muscleGroup: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'bodyweight', category: 'strength', description: 'Weighted dip for chest.' },
  { name: 'Pec Deck', muscleGroup: 'chest', secondaryMuscles: [], equipment: 'machine', category: 'strength', description: 'Machine chest isolation.' },

  // ── BACK ──
  { name: 'Pull Ups', muscleGroup: 'back', secondaryMuscles: ['biceps', 'forearms'], equipment: 'bodyweight', category: 'strength', description: 'Upper back and lats.' },
  { name: 'Chin Ups', muscleGroup: 'back', secondaryMuscles: ['biceps'], equipment: 'bodyweight', category: 'strength', description: 'Chin-up with bicep emphasis.' },
  { name: 'Lat Pulldown', muscleGroup: 'back', secondaryMuscles: ['biceps'], equipment: 'cable', category: 'strength', description: 'Cable lat pulldown.' },
  { name: 'Bent Over Row', muscleGroup: 'back', secondaryMuscles: ['biceps', 'forearms'], equipment: 'barbell', category: 'strength', description: 'Back thickness builder.' },
  { name: 'Deadlift', muscleGroup: 'back', secondaryMuscles: ['glutes', 'hamstrings', 'forearms'], equipment: 'barbell', category: 'strength', description: 'Full posterior chain.' },
  { name: 'Seated Cable Row', muscleGroup: 'back', secondaryMuscles: ['biceps'], equipment: 'cable', category: 'strength', description: 'Cable seated row.' },
  { name: 'T-Bar Row', muscleGroup: 'back', secondaryMuscles: ['biceps', 'forearms'], equipment: 'barbell', category: 'strength', description: 'T-bar back row.' },
  { name: 'Single Arm Dumbbell Row', muscleGroup: 'back', secondaryMuscles: ['biceps', 'forearms'], equipment: 'dumbbell', category: 'strength', description: 'One-arm row.' },
  { name: 'Face Pull', muscleGroup: 'back', secondaryMuscles: ['shoulders'], equipment: 'cable', category: 'strength', description: 'Rear delt and upper back.' },
  { name: 'Rack Pull', muscleGroup: 'back', secondaryMuscles: ['forearms', 'glutes'], equipment: 'barbell', category: 'strength', description: 'Partial deadlift.' },

  // ── SHOULDERS ──
  { name: 'Overhead Press', muscleGroup: 'shoulders', secondaryMuscles: ['triceps'], equipment: 'barbell', category: 'strength', description: 'Full shoulder press.' },
  { name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', secondaryMuscles: ['triceps'], equipment: 'dumbbell', category: 'strength', description: 'Dumbbell OHP.' },
  { name: 'Arnold Press', muscleGroup: 'shoulders', secondaryMuscles: ['triceps'], equipment: 'dumbbell', category: 'strength', description: 'Arnold rotational press.' },
  { name: 'Lateral Raise', muscleGroup: 'shoulders', secondaryMuscles: [], equipment: 'dumbbell', category: 'strength', description: 'Side delt isolation.' },
  { name: 'Front Raise', muscleGroup: 'shoulders', secondaryMuscles: [], equipment: 'dumbbell', category: 'strength', description: 'Front delt raise.' },
  { name: 'Rear Delt Fly', muscleGroup: 'shoulders', secondaryMuscles: ['back'], equipment: 'dumbbell', category: 'strength', description: 'Rear delt isolation.' },
  { name: 'Upright Row', muscleGroup: 'shoulders', secondaryMuscles: ['biceps'], equipment: 'barbell', category: 'strength', description: 'Upright barbell row.' },
  { name: 'Shrugs', muscleGroup: 'shoulders', secondaryMuscles: ['forearms'], equipment: 'dumbbell', category: 'strength', description: 'Trap shrugs.' },
  { name: 'Cable Lateral Raise', muscleGroup: 'shoulders', secondaryMuscles: [], equipment: 'cable', category: 'strength', description: 'Cable side raise.' },

  // ── BICEPS ──
  { name: 'Bicep Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'dumbbell', category: 'strength', description: 'Classic bicep curl.' },
  { name: 'Hammer Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'dumbbell', category: 'strength', description: 'Neutral grip curl.' },
  { name: 'Preacher Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'dumbbell', category: 'strength', description: 'Preacher bench curl.' },
  { name: 'Concentration Curl', muscleGroup: 'biceps', secondaryMuscles: [], equipment: 'dumbbell', category: 'strength', description: 'Seated isolation curl.' },
  { name: 'EZ Bar Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'barbell', category: 'strength', description: 'EZ bar bicep curl.' },
  { name: 'Cable Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'cable', category: 'strength', description: 'Cable bicep curl.' },
  { name: 'Barbell Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'barbell', category: 'strength', description: 'Standard barbell curl.' },
  { name: 'Incline Dumbbell Curl', muscleGroup: 'biceps', secondaryMuscles: [], equipment: 'dumbbell', category: 'strength', description: 'Incline bench curl.' },

  // ── TRICEPS ──
  { name: 'Tricep Pushdown', muscleGroup: 'triceps', secondaryMuscles: [], equipment: 'cable', category: 'strength', description: 'Cable tricep isolation.' },
  { name: 'Tricep Dips', muscleGroup: 'triceps', secondaryMuscles: ['chest', 'shoulders'], equipment: 'bodyweight', category: 'strength', description: 'Bodyweight tricep work.' },
  { name: 'Skull Crushers', muscleGroup: 'triceps', secondaryMuscles: [], equipment: 'barbell', category: 'strength', description: 'Lying tricep extension.' },
  { name: 'Overhead Tricep Extension', muscleGroup: 'triceps', secondaryMuscles: [], equipment: 'dumbbell', category: 'strength', description: 'Overhead dumbbell extension.' },
  { name: 'Close Grip Bench Press', muscleGroup: 'triceps', secondaryMuscles: ['chest'], equipment: 'barbell', category: 'strength', description: 'Close-grip press.' },
  { name: 'Diamond Push Ups', muscleGroup: 'triceps', secondaryMuscles: ['chest'], equipment: 'bodyweight', category: 'strength', description: 'Diamond hand push-ups.' },
  { name: 'Rope Pushdown', muscleGroup: 'triceps', secondaryMuscles: [], equipment: 'cable', category: 'strength', description: 'Rope cable pushdown.' },
  { name: 'Tricep Kickback', muscleGroup: 'triceps', secondaryMuscles: [], equipment: 'dumbbell', category: 'strength', description: 'Dumbbell kickback.' },

  // ── FOREARMS ──
  { name: 'Wrist Curl', muscleGroup: 'forearms', secondaryMuscles: [], equipment: 'barbell', category: 'strength', description: 'Forearm grip strength.' },
  { name: 'Reverse Wrist Curl', muscleGroup: 'forearms', secondaryMuscles: [], equipment: 'barbell', category: 'strength', description: 'Forearm extensor work.' },
  { name: 'Reverse Curl', muscleGroup: 'forearms', secondaryMuscles: ['biceps'], equipment: 'barbell', category: 'strength', description: 'Overhand grip curl.' },
  { name: "Farmer's Walk", muscleGroup: 'forearms', secondaryMuscles: ['shoulders', 'abs'], equipment: 'dumbbell', category: 'strength', description: 'Loaded carry.' },

  // ── ABS ──
  { name: 'Plank', muscleGroup: 'abs', secondaryMuscles: ['obliques'], equipment: 'bodyweight', category: 'strength', description: 'Core stability hold.' },
  { name: 'Crunches', muscleGroup: 'abs', secondaryMuscles: [], equipment: 'bodyweight', category: 'strength', description: 'Classic ab crunch.' },
  { name: 'Leg Raises', muscleGroup: 'abs', secondaryMuscles: [], equipment: 'bodyweight', category: 'strength', description: 'Lower ab leg raise.' },
  { name: 'Hanging Knee Raise', muscleGroup: 'abs', secondaryMuscles: ['obliques'], equipment: 'bodyweight', category: 'strength', description: 'Hanging knee raise.' },
  { name: 'Ab Wheel Rollout', muscleGroup: 'abs', secondaryMuscles: ['shoulders'], equipment: 'bodyweight', category: 'strength', description: 'Ab wheel exercise.' },
  { name: 'Sit Ups', muscleGroup: 'abs', secondaryMuscles: [], equipment: 'bodyweight', category: 'strength', description: 'Full sit-up.' },
  { name: 'Cable Crunch', muscleGroup: 'abs', secondaryMuscles: [], equipment: 'cable', category: 'strength', description: 'Weighted cable crunch.' },

  // ── OBLIQUES ──
  { name: 'Russian Twist', muscleGroup: 'obliques', secondaryMuscles: ['abs'], equipment: 'bodyweight', category: 'strength', description: 'Oblique rotational work.' },
  { name: 'Side Plank', muscleGroup: 'obliques', secondaryMuscles: ['abs'], equipment: 'bodyweight', category: 'strength', description: 'Lateral core hold.' },
  { name: 'Woodchoppers', muscleGroup: 'obliques', secondaryMuscles: ['abs', 'shoulders'], equipment: 'cable', category: 'strength', description: 'Cable chop rotation.' },
  { name: 'Bicycle Crunches', muscleGroup: 'obliques', secondaryMuscles: ['abs'], equipment: 'bodyweight', category: 'strength', description: 'Alternating oblique crunch.' },

  // ── QUADS ──
  { name: 'Squat', muscleGroup: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], equipment: 'barbell', category: 'strength', description: 'King of leg exercises.' },
  { name: 'Front Squat', muscleGroup: 'quads', secondaryMuscles: ['abs', 'glutes'], equipment: 'barbell', category: 'strength', description: 'Front-loaded squat.' },
  { name: 'Leg Press', muscleGroup: 'quads', secondaryMuscles: ['glutes'], equipment: 'machine', category: 'strength', description: 'Machine quad press.' },
  { name: 'Leg Extension', muscleGroup: 'quads', secondaryMuscles: [], equipment: 'machine', category: 'strength', description: 'Quad isolation.' },
  { name: 'Lunges', muscleGroup: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], equipment: 'dumbbell', category: 'strength', description: 'Walking lunge.' },
  { name: 'Bulgarian Split Squat', muscleGroup: 'quads', secondaryMuscles: ['glutes'], equipment: 'dumbbell', category: 'strength', description: 'Rear-elevated split squat.' },
  { name: 'Hack Squat', muscleGroup: 'quads', secondaryMuscles: ['glutes'], equipment: 'machine', category: 'strength', description: 'Machine hack squat.' },
  { name: 'Goblet Squat', muscleGroup: 'quads', secondaryMuscles: ['glutes', 'abs'], equipment: 'dumbbell', category: 'strength', description: 'Front-held squat.' },

  // ── HAMSTRINGS ──
  { name: 'Romanian Deadlift', muscleGroup: 'hamstrings', secondaryMuscles: ['glutes', 'back'], equipment: 'barbell', category: 'strength', description: 'Hamstring stretch & strength.' },
  { name: 'Leg Curl', muscleGroup: 'hamstrings', secondaryMuscles: [], equipment: 'machine', category: 'strength', description: 'Isolated hamstring curl.' },
  { name: 'Stiff Leg Deadlift', muscleGroup: 'hamstrings', secondaryMuscles: ['back', 'glutes'], equipment: 'barbell', category: 'strength', description: 'Straight-leg deadlift.' },
  { name: 'Good Mornings', muscleGroup: 'hamstrings', secondaryMuscles: ['back', 'glutes'], equipment: 'barbell', category: 'strength', description: 'Hinge movement.' },
  { name: 'Nordic Curl', muscleGroup: 'hamstrings', secondaryMuscles: [], equipment: 'bodyweight', category: 'strength', description: 'Eccentric hamstring curl.' },

  // ── GLUTES ──
  { name: 'Hip Thrust', muscleGroup: 'glutes', secondaryMuscles: ['hamstrings', 'quads'], equipment: 'barbell', category: 'strength', description: 'Glute activation powerhouse.' },
  { name: 'Glute Bridge', muscleGroup: 'glutes', secondaryMuscles: ['hamstrings'], equipment: 'bodyweight', category: 'strength', description: 'Bodyweight glute bridge.' },
  { name: 'Cable Kickback', muscleGroup: 'glutes', secondaryMuscles: ['hamstrings'], equipment: 'cable', category: 'strength', description: 'Cable glute kickback.' },
  { name: 'Step Ups', muscleGroup: 'glutes', secondaryMuscles: ['quads'], equipment: 'dumbbell', category: 'strength', description: 'Dumbbell step-up.' },
  { name: 'Sumo Deadlift', muscleGroup: 'glutes', secondaryMuscles: ['quads', 'back', 'forearms'], equipment: 'barbell', category: 'strength', description: 'Wide-stance deadlift.' },

  // ── CALVES ──
  { name: 'Standing Calf Raise', muscleGroup: 'calves', secondaryMuscles: [], equipment: 'machine', category: 'strength', description: 'Machine calf raise.' },
  { name: 'Seated Calf Raise', muscleGroup: 'calves', secondaryMuscles: [], equipment: 'machine', category: 'strength', description: 'Seated soleus focus.' },
  { name: 'Donkey Calf Raise', muscleGroup: 'calves', secondaryMuscles: [], equipment: 'machine', category: 'strength', description: 'Old-school calf raise.' },
  { name: 'Bodyweight Calf Raise', muscleGroup: 'calves', secondaryMuscles: [], equipment: 'bodyweight', category: 'strength', description: 'Bodyweight calf raise.' },

  // ── CARDIO / FULL BODY ──
  { name: 'Running', muscleGroup: 'quads', secondaryMuscles: ['calves', 'hamstrings'], equipment: 'bodyweight', category: 'cardio', description: 'Steady state cardio.' },
  { name: 'Burpees', muscleGroup: 'abs', secondaryMuscles: ['chest', 'quads'], equipment: 'bodyweight', category: 'cardio', description: 'Full body HIIT.' },
  { name: 'Mountain Climbers', muscleGroup: 'abs', secondaryMuscles: ['quads', 'shoulders'], equipment: 'bodyweight', category: 'cardio', description: 'Core cardio.' },
  { name: 'Jumping Jacks', muscleGroup: 'calves', secondaryMuscles: ['shoulders', 'quads'], equipment: 'bodyweight', category: 'cardio', description: 'Full body warm-up.' },
  { name: 'Box Jumps', muscleGroup: 'quads', secondaryMuscles: ['glutes', 'calves'], equipment: 'bodyweight', category: 'cardio', description: 'Plyometric jump.' },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Exercise.deleteMany({});
    await Exercise.insertMany(exercises);
    console.log('Seeded', exercises.length, 'exercises');
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
