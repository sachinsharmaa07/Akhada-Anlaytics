// Pre-built workout templates: Push / Pull / Legs / Upper / Lower / Full Body
// Each template has exercises with muscleGroup, secondaryMuscles, default sets

const WORKOUT_TEMPLATES = [
  {
    id: 'push',
    name: 'Push Day',
    emoji: '💪',
    description: 'Chest, Shoulders & Triceps',
    color: 'var(--neon-pink)',
    exercises: [
      { name: 'Flat Barbell Bench Press', muscleGroup: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'barbell', defaultSets: 4 },
      { name: 'Incline Dumbbell Press', muscleGroup: 'chest', secondaryMuscles: ['shoulders', 'triceps'], equipment: 'dumbbell', defaultSets: 3 },
      { name: 'Overhead Press', muscleGroup: 'shoulders', secondaryMuscles: ['triceps'], equipment: 'barbell', defaultSets: 4 },
      { name: 'Dumbbell Lateral Raise', muscleGroup: 'shoulders', secondaryMuscles: [], equipment: 'dumbbell', defaultSets: 3 },
      { name: 'Cable Tricep Pushdown', muscleGroup: 'triceps', secondaryMuscles: [], equipment: 'cable', defaultSets: 3 },
      { name: 'Overhead Tricep Extension', muscleGroup: 'triceps', secondaryMuscles: [], equipment: 'dumbbell', defaultSets: 3 },
    ],
  },
  {
    id: 'pull',
    name: 'Pull Day',
    emoji: '🏋️',
    description: 'Back & Biceps',
    color: 'var(--neon-cyan)',
    exercises: [
      { name: 'Barbell Deadlift', muscleGroup: 'back', secondaryMuscles: ['hamstrings', 'glutes'], equipment: 'barbell', defaultSets: 4 },
      { name: 'Pull Ups', muscleGroup: 'back', secondaryMuscles: ['biceps'], equipment: 'bodyweight', defaultSets: 3 },
      { name: 'Barbell Row', muscleGroup: 'back', secondaryMuscles: ['biceps', 'forearms'], equipment: 'barbell', defaultSets: 4 },
      { name: 'Face Pull', muscleGroup: 'shoulders', secondaryMuscles: ['back'], equipment: 'cable', defaultSets: 3 },
      { name: 'Barbell Bicep Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'barbell', defaultSets: 3 },
      { name: 'Hammer Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'dumbbell', defaultSets: 3 },
    ],
  },
  {
    id: 'legs',
    name: 'Leg Day',
    emoji: '🦵',
    description: 'Quads, Hamstrings & Glutes',
    color: 'var(--neon-green)',
    exercises: [
      { name: 'Barbell Back Squat', muscleGroup: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], equipment: 'barbell', defaultSets: 4 },
      { name: 'Leg Press', muscleGroup: 'quads', secondaryMuscles: ['glutes'], equipment: 'machine', defaultSets: 3 },
      { name: 'Romanian Deadlift', muscleGroup: 'hamstrings', secondaryMuscles: ['glutes', 'back'], equipment: 'barbell', defaultSets: 4 },
      { name: 'Leg Curl', muscleGroup: 'hamstrings', secondaryMuscles: [], equipment: 'machine', defaultSets: 3 },
      { name: 'Leg Extension', muscleGroup: 'quads', secondaryMuscles: [], equipment: 'machine', defaultSets: 3 },
      { name: 'Standing Calf Raise', muscleGroup: 'calves', secondaryMuscles: [], equipment: 'machine', defaultSets: 4 },
    ],
  },
  {
    id: 'upper',
    name: 'Upper Body',
    emoji: '🔥',
    description: 'Chest, Back, Shoulders & Arms',
    color: 'var(--neon-orange)',
    exercises: [
      { name: 'Flat Barbell Bench Press', muscleGroup: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'barbell', defaultSets: 4 },
      { name: 'Barbell Row', muscleGroup: 'back', secondaryMuscles: ['biceps'], equipment: 'barbell', defaultSets: 4 },
      { name: 'Overhead Press', muscleGroup: 'shoulders', secondaryMuscles: ['triceps'], equipment: 'barbell', defaultSets: 3 },
      { name: 'Lat Pulldown', muscleGroup: 'back', secondaryMuscles: ['biceps'], equipment: 'cable', defaultSets: 3 },
      { name: 'Dumbbell Lateral Raise', muscleGroup: 'shoulders', secondaryMuscles: [], equipment: 'dumbbell', defaultSets: 3 },
      { name: 'Cable Tricep Pushdown', muscleGroup: 'triceps', secondaryMuscles: [], equipment: 'cable', defaultSets: 3 },
      { name: 'Barbell Bicep Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'barbell', defaultSets: 3 },
    ],
  },
  {
    id: 'lower',
    name: 'Lower Body',
    emoji: '🦿',
    description: 'Quads, Hams, Glutes & Calves',
    color: 'var(--neon-cyan)',
    exercises: [
      { name: 'Barbell Back Squat', muscleGroup: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], equipment: 'barbell', defaultSets: 4 },
      { name: 'Romanian Deadlift', muscleGroup: 'hamstrings', secondaryMuscles: ['glutes', 'back'], equipment: 'barbell', defaultSets: 4 },
      { name: 'Bulgarian Split Squat', muscleGroup: 'quads', secondaryMuscles: ['glutes'], equipment: 'dumbbell', defaultSets: 3 },
      { name: 'Leg Curl', muscleGroup: 'hamstrings', secondaryMuscles: [], equipment: 'machine', defaultSets: 3 },
      { name: 'Hip Thrust', muscleGroup: 'glutes', secondaryMuscles: ['hamstrings'], equipment: 'barbell', defaultSets: 3 },
      { name: 'Standing Calf Raise', muscleGroup: 'calves', secondaryMuscles: [], equipment: 'machine', defaultSets: 4 },
    ],
  },
  {
    id: 'fullbody',
    name: 'Full Body',
    emoji: '⚡',
    description: 'All major muscle groups',
    color: 'var(--neon-green)',
    exercises: [
      { name: 'Barbell Back Squat', muscleGroup: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], equipment: 'barbell', defaultSets: 3 },
      { name: 'Flat Barbell Bench Press', muscleGroup: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'barbell', defaultSets: 3 },
      { name: 'Barbell Row', muscleGroup: 'back', secondaryMuscles: ['biceps'], equipment: 'barbell', defaultSets: 3 },
      { name: 'Overhead Press', muscleGroup: 'shoulders', secondaryMuscles: ['triceps'], equipment: 'barbell', defaultSets: 3 },
      { name: 'Romanian Deadlift', muscleGroup: 'hamstrings', secondaryMuscles: ['glutes', 'back'], equipment: 'barbell', defaultSets: 3 },
      { name: 'Barbell Bicep Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'barbell', defaultSets: 2 },
    ],
  },
];

export default WORKOUT_TEMPLATES;
