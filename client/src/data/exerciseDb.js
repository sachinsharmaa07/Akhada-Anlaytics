/* ──────────────────────────────────────────────────
   Comprehensive Exercise Database
   81 exercises · 12 muscle groups · images
   ────────────────────────────────────────────────── */

// Muscle-group → small inline SVG data-URI thumbnails
// Each SVG is a simple silhouette / icon for the muscle group
const MUSCLE_ICONS = {
  chest: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%231a1a2e'/%3E%3Cpath d='M32 18c-10 0-16 6-16 14s4 12 8 14c2 1 4 0 6-1h4c2 1 4 2 6 1 4-2 8-6 8-14s-6-14-16-14z' fill='%23ff2d75' opacity='0.85'/%3E%3Cpath d='M32 20v24M24 28h16' stroke='%23fff' stroke-width='1.5' fill='none' opacity='0.5'/%3E%3C/svg%3E`,
  back: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%231a1a2e'/%3E%3Cpath d='M22 16h20v8l-4 6v12l4 6H22l4-6V30l-4-6z' fill='%2300b4ff' opacity='0.85'/%3E%3Cpath d='M32 16v32M26 24l6 4 6-4M26 40l6-4 6 4' stroke='%23fff' stroke-width='1.2' fill='none' opacity='0.5'/%3E%3C/svg%3E`,
  shoulders: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%231a1a2e'/%3E%3Cellipse cx='22' cy='28' rx='8' ry='10' fill='%23ff9500' opacity='0.85'/%3E%3Cellipse cx='42' cy='28' rx='8' ry='10' fill='%23ff9500' opacity='0.85'/%3E%3Cpath d='M22 22a12 12 0 0 1 20 0' stroke='%23fff' stroke-width='1.5' fill='none' opacity='0.5'/%3E%3C/svg%3E`,
  biceps: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%231a1a2e'/%3E%3Cpath d='M24 44V28c0-6 4-12 8-12s8 6 8 12v16' fill='none' stroke='%2339ff14' stroke-width='4' stroke-linecap='round' opacity='0.85'/%3E%3Ccircle cx='32' cy='24' r='5' fill='%2339ff14' opacity='0.7'/%3E%3C/svg%3E`,
  triceps: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%231a1a2e'/%3E%3Cpath d='M24 18v28M40 18v28' stroke='%23c084fc' stroke-width='5' stroke-linecap='round' opacity='0.85'/%3E%3Cpath d='M24 32h16' stroke='%23fff' stroke-width='1.5' opacity='0.4'/%3E%3C/svg%3E`,
  forearms: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%231a1a2e'/%3E%3Cpath d='M28 16l-4 32M36 16l4 32' stroke='%2300e5ff' stroke-width='4' stroke-linecap='round' opacity='0.85'/%3E%3Ccircle cx='24' cy='48' r='3' fill='%2300e5ff' opacity='0.6'/%3E%3Ccircle cx='40' cy='48' r='3' fill='%2300e5ff' opacity='0.6'/%3E%3C/svg%3E`,
  abs: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%231a1a2e'/%3E%3Crect x='22' y='14' width='8' height='8' rx='2' fill='%23ffdd00' opacity='0.85'/%3E%3Crect x='34' y='14' width='8' height='8' rx='2' fill='%23ffdd00' opacity='0.85'/%3E%3Crect x='22' y='26' width='8' height='8' rx='2' fill='%23ffdd00' opacity='0.75'/%3E%3Crect x='34' y='26' width='8' height='8' rx='2' fill='%23ffdd00' opacity='0.75'/%3E%3Crect x='22' y='38' width='8' height='8' rx='2' fill='%23ffdd00' opacity='0.65'/%3E%3Crect x='34' y='38' width='8' height='8' rx='2' fill='%23ffdd00' opacity='0.65'/%3E%3C/svg%3E`,
  obliques: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%231a1a2e'/%3E%3Cpath d='M20 16l8 32M44 16l-8 32' stroke='%23ff6b6b' stroke-width='4' stroke-linecap='round' opacity='0.85'/%3E%3Cpath d='M24 32h16' stroke='%23fff' stroke-width='1' opacity='0.3'/%3E%3C/svg%3E`,
  quads: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%231a1a2e'/%3E%3Cpath d='M20 14c0 0 2 18 4 34M32 14c0 0 0 18 0 34M44 14c0 0-2 18-4 34' stroke='%23ff2d75' stroke-width='4' stroke-linecap='round' opacity='0.85'/%3E%3C/svg%3E`,
  hamstrings: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%231a1a2e'/%3E%3Cpath d='M22 14v34M32 14v34M42 14v34' stroke='%2300b4ff' stroke-width='4' stroke-linecap='round' opacity='0.85'/%3E%3Cpath d='M22 32c4-4 16-4 20 0' stroke='%23fff' stroke-width='1' fill='none' opacity='0.4'/%3E%3C/svg%3E`,
  glutes: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%231a1a2e'/%3E%3Cellipse cx='24' cy='32' rx='10' ry='14' fill='%23ff9500' opacity='0.8'/%3E%3Cellipse cx='40' cy='32' rx='10' ry='14' fill='%23ff9500' opacity='0.8'/%3E%3C/svg%3E`,
  calves: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%231a1a2e'/%3E%3Cpath d='M24 14c2 12 4 20 2 34M40 14c-2 12-4 20-2 34' stroke='%2339ff14' stroke-width='4' stroke-linecap='round' opacity='0.85'/%3E%3C/svg%3E`,
};

export const getMuscleIcon = (muscleGroup) =>
  MUSCLE_ICONS[muscleGroup] || MUSCLE_ICONS.chest;

// Equipment emoji labels
export const EQUIPMENT_LABELS = {
  barbell: '🏋️ Barbell',
  dumbbell: '💪 Dumbbell',
  machine: '⚙️ Machine',
  cable: '🔗 Cable',
  bodyweight: '🤸 Bodyweight',
  kettlebell: '🔔 Kettlebell',
  band: '🎗️ Band',
  other: '🔧 Other',
};

const EXERCISES = [
  // ── CHEST ──
  { name: 'Bench Press', muscleGroup: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'barbell', category: 'strength' },
  { name: 'Incline Bench Press', muscleGroup: 'chest', secondaryMuscles: ['shoulders', 'triceps'], equipment: 'barbell', category: 'strength' },
  { name: 'Decline Bench Press', muscleGroup: 'chest', secondaryMuscles: ['triceps'], equipment: 'barbell', category: 'strength' },
  { name: 'Dumbbell Press', muscleGroup: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'dumbbell', category: 'strength' },
  { name: 'Incline Dumbbell Press', muscleGroup: 'chest', secondaryMuscles: ['shoulders'], equipment: 'dumbbell', category: 'strength' },
  { name: 'Dumbbell Flyes', muscleGroup: 'chest', secondaryMuscles: ['shoulders'], equipment: 'dumbbell', category: 'strength' },
  { name: 'Cable Crossover', muscleGroup: 'chest', secondaryMuscles: ['shoulders'], equipment: 'cable', category: 'strength' },
  { name: 'Push Ups', muscleGroup: 'chest', secondaryMuscles: ['triceps', 'abs'], equipment: 'bodyweight', category: 'strength' },
  { name: 'Chest Dips', muscleGroup: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'bodyweight', category: 'strength' },
  { name: 'Pec Deck', muscleGroup: 'chest', secondaryMuscles: [], equipment: 'machine', category: 'strength' },

  // ── BACK ──
  { name: 'Pull Ups', muscleGroup: 'back', secondaryMuscles: ['biceps', 'forearms'], equipment: 'bodyweight', category: 'strength' },
  { name: 'Chin Ups', muscleGroup: 'back', secondaryMuscles: ['biceps'], equipment: 'bodyweight', category: 'strength' },
  { name: 'Lat Pulldown', muscleGroup: 'back', secondaryMuscles: ['biceps'], equipment: 'cable', category: 'strength' },
  { name: 'Bent Over Row', muscleGroup: 'back', secondaryMuscles: ['biceps', 'forearms'], equipment: 'barbell', category: 'strength' },
  { name: 'Deadlift', muscleGroup: 'back', secondaryMuscles: ['glutes', 'hamstrings', 'forearms'], equipment: 'barbell', category: 'strength' },
  { name: 'Seated Cable Row', muscleGroup: 'back', secondaryMuscles: ['biceps'], equipment: 'cable', category: 'strength' },
  { name: 'T-Bar Row', muscleGroup: 'back', secondaryMuscles: ['biceps', 'forearms'], equipment: 'barbell', category: 'strength' },
  { name: 'Single Arm Dumbbell Row', muscleGroup: 'back', secondaryMuscles: ['biceps', 'forearms'], equipment: 'dumbbell', category: 'strength' },
  { name: 'Face Pull', muscleGroup: 'back', secondaryMuscles: ['shoulders'], equipment: 'cable', category: 'strength' },
  { name: 'Rack Pull', muscleGroup: 'back', secondaryMuscles: ['forearms', 'glutes'], equipment: 'barbell', category: 'strength' },

  // ── SHOULDERS ──
  { name: 'Overhead Press', muscleGroup: 'shoulders', secondaryMuscles: ['triceps'], equipment: 'barbell', category: 'strength' },
  { name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', secondaryMuscles: ['triceps'], equipment: 'dumbbell', category: 'strength' },
  { name: 'Arnold Press', muscleGroup: 'shoulders', secondaryMuscles: ['triceps'], equipment: 'dumbbell', category: 'strength' },
  { name: 'Lateral Raise', muscleGroup: 'shoulders', secondaryMuscles: [], equipment: 'dumbbell', category: 'strength' },
  { name: 'Front Raise', muscleGroup: 'shoulders', secondaryMuscles: [], equipment: 'dumbbell', category: 'strength' },
  { name: 'Rear Delt Fly', muscleGroup: 'shoulders', secondaryMuscles: ['back'], equipment: 'dumbbell', category: 'strength' },
  { name: 'Upright Row', muscleGroup: 'shoulders', secondaryMuscles: ['biceps'], equipment: 'barbell', category: 'strength' },
  { name: 'Shrugs', muscleGroup: 'shoulders', secondaryMuscles: ['forearms'], equipment: 'dumbbell', category: 'strength' },
  { name: 'Cable Lateral Raise', muscleGroup: 'shoulders', secondaryMuscles: [], equipment: 'cable', category: 'strength' },

  // ── BICEPS ──
  { name: 'Bicep Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'dumbbell', category: 'strength' },
  { name: 'Hammer Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'dumbbell', category: 'strength' },
  { name: 'Preacher Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'dumbbell', category: 'strength' },
  { name: 'Concentration Curl', muscleGroup: 'biceps', secondaryMuscles: [], equipment: 'dumbbell', category: 'strength' },
  { name: 'EZ Bar Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'barbell', category: 'strength' },
  { name: 'Cable Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'cable', category: 'strength' },
  { name: 'Barbell Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'barbell', category: 'strength' },
  { name: 'Incline Dumbbell Curl', muscleGroup: 'biceps', secondaryMuscles: [], equipment: 'dumbbell', category: 'strength' },

  // ── TRICEPS ──
  { name: 'Tricep Pushdown', muscleGroup: 'triceps', secondaryMuscles: [], equipment: 'cable', category: 'strength' },
  { name: 'Tricep Dips', muscleGroup: 'triceps', secondaryMuscles: ['chest', 'shoulders'], equipment: 'bodyweight', category: 'strength' },
  { name: 'Skull Crushers', muscleGroup: 'triceps', secondaryMuscles: [], equipment: 'barbell', category: 'strength' },
  { name: 'Overhead Tricep Extension', muscleGroup: 'triceps', secondaryMuscles: [], equipment: 'dumbbell', category: 'strength' },
  { name: 'Close Grip Bench Press', muscleGroup: 'triceps', secondaryMuscles: ['chest'], equipment: 'barbell', category: 'strength' },
  { name: 'Diamond Push Ups', muscleGroup: 'triceps', secondaryMuscles: ['chest'], equipment: 'bodyweight', category: 'strength' },
  { name: 'Rope Pushdown', muscleGroup: 'triceps', secondaryMuscles: [], equipment: 'cable', category: 'strength' },
  { name: 'Tricep Kickback', muscleGroup: 'triceps', secondaryMuscles: [], equipment: 'dumbbell', category: 'strength' },

  // ── FOREARMS ──
  { name: 'Wrist Curl', muscleGroup: 'forearms', secondaryMuscles: [], equipment: 'barbell', category: 'strength' },
  { name: 'Reverse Wrist Curl', muscleGroup: 'forearms', secondaryMuscles: [], equipment: 'barbell', category: 'strength' },
  { name: 'Reverse Curl', muscleGroup: 'forearms', secondaryMuscles: ['biceps'], equipment: 'barbell', category: 'strength' },
  { name: "Farmer's Walk", muscleGroup: 'forearms', secondaryMuscles: ['shoulders', 'abs'], equipment: 'dumbbell', category: 'strength' },

  // ── ABS ──
  { name: 'Plank', muscleGroup: 'abs', secondaryMuscles: ['obliques'], equipment: 'bodyweight', category: 'strength' },
  { name: 'Crunches', muscleGroup: 'abs', secondaryMuscles: [], equipment: 'bodyweight', category: 'strength' },
  { name: 'Leg Raises', muscleGroup: 'abs', secondaryMuscles: [], equipment: 'bodyweight', category: 'strength' },
  { name: 'Hanging Knee Raise', muscleGroup: 'abs', secondaryMuscles: ['obliques'], equipment: 'bodyweight', category: 'strength' },
  { name: 'Ab Wheel Rollout', muscleGroup: 'abs', secondaryMuscles: ['shoulders'], equipment: 'other', category: 'strength' },
  { name: 'Sit Ups', muscleGroup: 'abs', secondaryMuscles: [], equipment: 'bodyweight', category: 'strength' },
  { name: 'Cable Crunch', muscleGroup: 'abs', secondaryMuscles: [], equipment: 'cable', category: 'strength' },

  // ── OBLIQUES ──
  { name: 'Russian Twist', muscleGroup: 'obliques', secondaryMuscles: ['abs'], equipment: 'bodyweight', category: 'strength' },
  { name: 'Side Plank', muscleGroup: 'obliques', secondaryMuscles: ['abs'], equipment: 'bodyweight', category: 'strength' },
  { name: 'Woodchoppers', muscleGroup: 'obliques', secondaryMuscles: ['abs', 'shoulders'], equipment: 'cable', category: 'strength' },
  { name: 'Bicycle Crunches', muscleGroup: 'obliques', secondaryMuscles: ['abs'], equipment: 'bodyweight', category: 'strength' },

  // ── QUADS ──
  { name: 'Squat', muscleGroup: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], equipment: 'barbell', category: 'strength' },
  { name: 'Front Squat', muscleGroup: 'quads', secondaryMuscles: ['abs', 'glutes'], equipment: 'barbell', category: 'strength' },
  { name: 'Leg Press', muscleGroup: 'quads', secondaryMuscles: ['glutes'], equipment: 'machine', category: 'strength' },
  { name: 'Leg Extension', muscleGroup: 'quads', secondaryMuscles: [], equipment: 'machine', category: 'strength' },
  { name: 'Lunges', muscleGroup: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], equipment: 'dumbbell', category: 'strength' },
  { name: 'Bulgarian Split Squat', muscleGroup: 'quads', secondaryMuscles: ['glutes'], equipment: 'dumbbell', category: 'strength' },
  { name: 'Hack Squat', muscleGroup: 'quads', secondaryMuscles: ['glutes'], equipment: 'machine', category: 'strength' },
  { name: 'Goblet Squat', muscleGroup: 'quads', secondaryMuscles: ['glutes', 'abs'], equipment: 'dumbbell', category: 'strength' },

  // ── HAMSTRINGS ──
  { name: 'Romanian Deadlift', muscleGroup: 'hamstrings', secondaryMuscles: ['glutes', 'back'], equipment: 'barbell', category: 'strength' },
  { name: 'Leg Curl', muscleGroup: 'hamstrings', secondaryMuscles: [], equipment: 'machine', category: 'strength' },
  { name: 'Stiff Leg Deadlift', muscleGroup: 'hamstrings', secondaryMuscles: ['back', 'glutes'], equipment: 'barbell', category: 'strength' },
  { name: 'Good Mornings', muscleGroup: 'hamstrings', secondaryMuscles: ['back', 'glutes'], equipment: 'barbell', category: 'strength' },
  { name: 'Nordic Curl', muscleGroup: 'hamstrings', secondaryMuscles: [], equipment: 'bodyweight', category: 'strength' },

  // ── GLUTES ──
  { name: 'Hip Thrust', muscleGroup: 'glutes', secondaryMuscles: ['hamstrings', 'quads'], equipment: 'barbell', category: 'strength' },
  { name: 'Glute Bridge', muscleGroup: 'glutes', secondaryMuscles: ['hamstrings'], equipment: 'bodyweight', category: 'strength' },
  { name: 'Cable Kickback', muscleGroup: 'glutes', secondaryMuscles: ['hamstrings'], equipment: 'cable', category: 'strength' },
  { name: 'Step Ups', muscleGroup: 'glutes', secondaryMuscles: ['quads'], equipment: 'dumbbell', category: 'strength' },
  { name: 'Sumo Deadlift', muscleGroup: 'glutes', secondaryMuscles: ['quads', 'back', 'forearms'], equipment: 'barbell', category: 'strength' },

  // ── CALVES ──
  { name: 'Standing Calf Raise', muscleGroup: 'calves', secondaryMuscles: [], equipment: 'machine', category: 'strength' },
  { name: 'Seated Calf Raise', muscleGroup: 'calves', secondaryMuscles: [], equipment: 'machine', category: 'strength' },
  { name: 'Donkey Calf Raise', muscleGroup: 'calves', secondaryMuscles: [], equipment: 'machine', category: 'strength' },
  { name: 'Bodyweight Calf Raise', muscleGroup: 'calves', secondaryMuscles: [], equipment: 'bodyweight', category: 'strength' },

  // ── CARDIO / FULL BODY ──
  { name: 'Running', muscleGroup: 'quads', secondaryMuscles: ['calves', 'hamstrings'], equipment: 'bodyweight', category: 'cardio' },
  { name: 'Burpees', muscleGroup: 'abs', secondaryMuscles: ['chest', 'quads'], equipment: 'bodyweight', category: 'cardio' },
  { name: 'Mountain Climbers', muscleGroup: 'abs', secondaryMuscles: ['quads', 'shoulders'], equipment: 'bodyweight', category: 'cardio' },
  { name: 'Jumping Jacks', muscleGroup: 'calves', secondaryMuscles: ['shoulders', 'quads'], equipment: 'bodyweight', category: 'cardio' },
  { name: 'Box Jumps', muscleGroup: 'quads', secondaryMuscles: ['glutes', 'calves'], equipment: 'bodyweight', category: 'cardio' },
];

/**
 * Search exercises by query string (matches name, muscleGroup, equipment).
 * Returns first `limit` results.
 */
export const searchLocalExercises = (query, limit = 20) => {
  if (!query || !query.trim()) return EXERCISES.slice(0, limit);
  const q = query.toLowerCase().trim();
  const scored = EXERCISES
    .map((ex) => {
      const nameLower = ex.name.toLowerCase();
      let score = 0;
      if (nameLower === q) score = 100;
      else if (nameLower.startsWith(q)) score = 80;
      else if (nameLower.includes(q)) score = 60;
      else if (ex.muscleGroup.includes(q)) score = 40;
      else if (ex.equipment?.includes(q)) score = 30;
      else if (ex.secondaryMuscles.some((m) => m.includes(q))) score = 20;
      return { ...ex, _score: score };
    })
    .filter((ex) => ex._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, limit);
  return scored;
};

export const MUSCLE_GROUPS = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
  'abs', 'obliques', 'quads', 'hamstrings', 'glutes', 'calves',
];

export default EXERCISES;
