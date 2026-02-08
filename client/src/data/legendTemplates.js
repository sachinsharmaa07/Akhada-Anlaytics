/* ═══════════════════════════════════════════════════════
   Legendary Athlete Workout Templates
   CBUM · Ronnie · Larry · Jeff Nippard
   ═══════════════════════════════════════════════════════ */

import cbumImg from '../images/cbum.png';
import ronnieImg from '../images/ronnie.jpg';
import larryImg from '../images/larry.jpeg';
import jeffImg from '../images/jeffNippard.jpg';

const LEGEND_TEMPLATES = [
  /* ── CBUM — Classic Physique Hypertrophy ── */
  {
    id: 'cbum-push',
    legendId: 'cbum',
    name: 'CBUM Push',
    athlete: 'Chris Bumstead',
    image: cbumImg,
    tag: 'Classic Physique',
    accent: '#ff2d95',
    philosophy: 'High-volume, perfect form, slow tempo. Shape, symmetry, and mind–muscle connection.',
    warmup: '5 min incline walk · Band pull-aparts × 20 · Shoulder CARs · 2 light ramp-up sets',
    notes: [
      'Tempo > weight',
      'Train close to failure, not sloppy failure',
      'Rest 60–90 sec',
      'Looks light. Feels evil.',
    ],
    exercises: [
      { name: 'Incline Dumbbell Press', muscleGroup: 'chest', secondaryMuscles: ['shoulders', 'triceps'], equipment: 'dumbbell', defaultSets: 4, reps: '10–12' },
      { name: 'Pec Deck', muscleGroup: 'chest', secondaryMuscles: [], equipment: 'machine', defaultSets: 3, reps: '12–15' },
      { name: 'Cable Crossover', muscleGroup: 'chest', secondaryMuscles: ['shoulders'], equipment: 'cable', defaultSets: 3, reps: '15' },
      { name: 'Lateral Raise', muscleGroup: 'shoulders', secondaryMuscles: [], equipment: 'dumbbell', defaultSets: 5, reps: '15–20' },
      { name: 'Rope Pushdown', muscleGroup: 'triceps', secondaryMuscles: [], equipment: 'cable', defaultSets: 4, reps: '12–15' },
    ],
  },
  {
    id: 'cbum-pull',
    legendId: 'cbum',
    name: 'CBUM Pull',
    athlete: 'Chris Bumstead',
    image: cbumImg,
    tag: 'Classic Physique',
    accent: '#ff2d95',
    philosophy: 'Controlled eccentric, deep stretch, pump-focused back work.',
    warmup: '5 min incline walk · Band pull-aparts × 20 · Light lat pulldown warm-up',
    notes: [
      'Squeeze at contraction, 2-sec negative',
      'Mind–muscle over load',
      'Rest 60–90 sec',
    ],
    exercises: [
      { name: 'Lat Pulldown', muscleGroup: 'back', secondaryMuscles: ['biceps'], equipment: 'cable', defaultSets: 4, reps: '12' },
      { name: 'Seated Cable Row', muscleGroup: 'back', secondaryMuscles: ['biceps'], equipment: 'cable', defaultSets: 3, reps: '15' },
      { name: 'Rear Delt Fly', muscleGroup: 'shoulders', secondaryMuscles: ['back'], equipment: 'dumbbell', defaultSets: 4, reps: '15–20' },
      { name: 'EZ Bar Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'barbell', defaultSets: 4, reps: '12' },
    ],
  },
  {
    id: 'cbum-legs',
    legendId: 'cbum',
    name: 'CBUM Legs',
    athlete: 'Chris Bumstead',
    image: cbumImg,
    tag: 'Classic Physique',
    accent: '#ff2d95',
    philosophy: 'Deep ROM, slow negatives, isolation burnouts.',
    warmup: '5 min incline walk · Bodyweight squats × 15 · Hip circles',
    notes: [
      'Full range of motion on every rep',
      'Pause at the bottom of hack squats',
      'Standing calf — hold peak contraction 2 sec',
    ],
    exercises: [
      { name: 'Hack Squat', muscleGroup: 'quads', secondaryMuscles: ['glutes'], equipment: 'machine', defaultSets: 4, reps: '10–12' },
      { name: 'Romanian Deadlift', muscleGroup: 'hamstrings', secondaryMuscles: ['glutes', 'back'], equipment: 'barbell', defaultSets: 4, reps: '8–10' },
      { name: 'Leg Curl', muscleGroup: 'hamstrings', secondaryMuscles: [], equipment: 'machine', defaultSets: 4, reps: '12–15' },
      { name: 'Leg Extension', muscleGroup: 'quads', secondaryMuscles: [], equipment: 'machine', defaultSets: 4, reps: '15' },
      { name: 'Standing Calf Raise', muscleGroup: 'calves', secondaryMuscles: [], equipment: 'machine', defaultSets: 5, reps: '15–20' },
    ],
  },

  /* ── RONNIE — Old-School Mass & Power ── */
  {
    id: 'ronnie-chest',
    legendId: 'ronnie',
    name: 'Ronnie Chest',
    athlete: 'Ronnie Coleman',
    image: ronnieImg,
    tag: 'Mass & Power',
    accent: '#ff6a00',
    philosophy: 'Heavy compounds, brutal intensity, volume that scares physicists.',
    warmup: '5–7 min bike or rower · Dynamic arm swings · Progressive loading sets (VERY important)',
    notes: [
      'Long rest 2–4 min between heavy sets',
      'Requires excellent recovery & nutrition',
      'Not beginner-friendly',
      '"Lightweight baby" was a lie 😈',
    ],
    exercises: [
      { name: 'Bench Press', muscleGroup: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'barbell', defaultSets: 5, reps: '5–8' },
      { name: 'Incline Dumbbell Press', muscleGroup: 'chest', secondaryMuscles: ['shoulders', 'triceps'], equipment: 'dumbbell', defaultSets: 4, reps: '8–10' },
      { name: 'Chest Dips', muscleGroup: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'bodyweight', defaultSets: 3, reps: 'AMRAP' },
    ],
  },
  {
    id: 'ronnie-back',
    legendId: 'ronnie',
    name: 'Ronnie Back',
    athlete: 'Ronnie Coleman',
    image: ronnieImg,
    tag: 'Mass & Power',
    accent: '#ff6a00',
    philosophy: 'Deadlifts, rows, heavy pulls. Build a back that blocks the sun.',
    warmup: '5 min bike · Dynamic stretches · Ramp-up deadlift sets',
    notes: [
      'Belt up for heavy pulls',
      'Rest 3–4 min on deadlifts',
      'Chalk is mandatory, not optional',
    ],
    exercises: [
      { name: 'Deadlift', muscleGroup: 'back', secondaryMuscles: ['glutes', 'hamstrings', 'forearms'], equipment: 'barbell', defaultSets: 5, reps: '5' },
      { name: 'T-Bar Row', muscleGroup: 'back', secondaryMuscles: ['biceps', 'forearms'], equipment: 'barbell', defaultSets: 4, reps: '8' },
      { name: 'Lat Pulldown', muscleGroup: 'back', secondaryMuscles: ['biceps'], equipment: 'cable', defaultSets: 4, reps: '10' },
    ],
  },
  {
    id: 'ronnie-legs',
    legendId: 'ronnie',
    name: 'Ronnie Legs',
    athlete: 'Ronnie Coleman',
    image: ronnieImg,
    tag: 'Mass & Power',
    accent: '#ff6a00',
    philosophy: 'Squats deep enough to visit the earth\'s core. Quads that need their own zip code.',
    warmup: '5 min bike · Leg swings · Hip openers · Ramp-up squat sets',
    notes: [
      'Go deep or go home',
      'Walking lunges — 20 steps each leg',
      'If your legs aren\'t shaking, add weight',
    ],
    exercises: [
      { name: 'Squat', muscleGroup: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], equipment: 'barbell', defaultSets: 5, reps: '5' },
      { name: 'Leg Press', muscleGroup: 'quads', secondaryMuscles: ['glutes'], equipment: 'machine', defaultSets: 4, reps: '12' },
      { name: 'Lunges', muscleGroup: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], equipment: 'dumbbell', defaultSets: 3, reps: '20 steps' },
    ],
  },

  /* ── LARRY WHEELS — Powerbuilding Hybrid ── */
  {
    id: 'larry-upper',
    legendId: 'larry',
    name: 'Larry Upper',
    athlete: 'Larry Wheels',
    image: larryImg,
    tag: 'Powerbuilding',
    accent: '#00f0ff',
    philosophy: 'Powerlifting strength meets bodybuilding volume. Lift heavy AND look jacked.',
    warmup: 'Jump rope 5 min · Hip + shoulder mobility · Gradual ramp-up to working weight',
    notes: [
      'Track numbers weekly',
      'Heavy days feel CNS-intense',
      'Needs sleep + food discipline',
      'Strength is non-negotiable here',
    ],
    exercises: [
      { name: 'Bench Press', muscleGroup: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'barbell', defaultSets: 5, reps: '3–5' },
      { name: 'Bent Over Row', muscleGroup: 'back', secondaryMuscles: ['biceps', 'forearms'], equipment: 'barbell', defaultSets: 4, reps: '6–8' },
      { name: 'Overhead Press', muscleGroup: 'shoulders', secondaryMuscles: ['triceps'], equipment: 'barbell', defaultSets: 4, reps: '6' },
      { name: 'Pull Ups', muscleGroup: 'back', secondaryMuscles: ['biceps', 'forearms'], equipment: 'bodyweight', defaultSets: 4, reps: 'AMRAP' },
      { name: 'Cable Crossover', muscleGroup: 'chest', secondaryMuscles: ['shoulders'], equipment: 'cable', defaultSets: 3, reps: '12–15' },
      { name: 'Bicep Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'dumbbell', defaultSets: 3, reps: '12–15' },
    ],
  },
  {
    id: 'larry-lower',
    legendId: 'larry',
    name: 'Larry Lower',
    athlete: 'Larry Wheels',
    image: larryImg,
    tag: 'Powerbuilding',
    accent: '#00f0ff',
    philosophy: 'Squat and deadlift heavy, then finish with hypertrophy accessories.',
    warmup: 'Jump rope 5 min · Hip mobility · Gradual barbell ramp-up',
    notes: [
      'Squat & deadlift are king',
      'RDL for hamstring stretch under load',
      'Calves every lower day — no excuses',
    ],
    exercises: [
      { name: 'Squat', muscleGroup: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], equipment: 'barbell', defaultSets: 5, reps: '3–5' },
      { name: 'Deadlift', muscleGroup: 'back', secondaryMuscles: ['glutes', 'hamstrings', 'forearms'], equipment: 'barbell', defaultSets: 4, reps: '4' },
      { name: 'Romanian Deadlift', muscleGroup: 'hamstrings', secondaryMuscles: ['glutes', 'back'], equipment: 'barbell', defaultSets: 3, reps: '8' },
      { name: 'Leg Curl', muscleGroup: 'hamstrings', secondaryMuscles: [], equipment: 'machine', defaultSets: 3, reps: '12' },
      { name: 'Standing Calf Raise', muscleGroup: 'calves', secondaryMuscles: [], equipment: 'machine', defaultSets: 5, reps: '15' },
    ],
  },

  /* ── JEFF NIPPARD — Science-Based Hypertrophy ── */
  {
    id: 'jeff-fullbody',
    legendId: 'jeff',
    name: 'Jeff Full Body',
    athlete: 'Jeff Nippard',
    image: jeffImg,
    tag: 'Science-Based',
    accent: '#39ff14',
    philosophy: 'Evidence-based, measurable, sustainable. Volume is calculated, effort is tracked.',
    warmup: 'Light cardio · Dynamic mobility · Movement-specific warm-up sets',
    notes: [
      'Train 1–3 reps in reserve (RIR)',
      'Weekly volume matters more than annihilation',
      'Deload every 6–8 weeks',
      'Best long-term approach for most lifters',
    ],
    exercises: [
      { name: 'Squat', muscleGroup: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], equipment: 'barbell', defaultSets: 3, reps: '6–8 (RPE 7–8)' },
      { name: 'Bench Press', muscleGroup: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'barbell', defaultSets: 3, reps: '6–8' },
      { name: 'Lat Pulldown', muscleGroup: 'back', secondaryMuscles: ['biceps'], equipment: 'cable', defaultSets: 3, reps: '8–10' },
      { name: 'Romanian Deadlift', muscleGroup: 'hamstrings', secondaryMuscles: ['glutes', 'back'], equipment: 'barbell', defaultSets: 3, reps: '8' },
      { name: 'Lateral Raise', muscleGroup: 'shoulders', secondaryMuscles: [], equipment: 'dumbbell', defaultSets: 3, reps: '12–15' },
      { name: 'Cable Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'cable', defaultSets: 2, reps: '12' },
    ],
  },
  {
    id: 'jeff-upper',
    legendId: 'jeff',
    name: 'Jeff Upper',
    athlete: 'Jeff Nippard',
    image: jeffImg,
    tag: 'Science-Based',
    accent: '#39ff14',
    philosophy: 'Optimized volume per muscle group. Quality reps within RIR targets.',
    warmup: 'Light cardio 5 min · Band pull-aparts · Rotator cuff work',
    notes: [
      'RPE 7–8 on compounds',
      'RPE 8–9 on isolations',
      'Track total weekly sets per muscle group',
    ],
    exercises: [
      { name: 'Bench Press', muscleGroup: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'barbell', defaultSets: 3, reps: '6–8' },
      { name: 'Seated Cable Row', muscleGroup: 'back', secondaryMuscles: ['biceps'], equipment: 'cable', defaultSets: 3, reps: '8–10' },
      { name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', secondaryMuscles: ['triceps'], equipment: 'dumbbell', defaultSets: 3, reps: '8–10' },
      { name: 'Lat Pulldown', muscleGroup: 'back', secondaryMuscles: ['biceps'], equipment: 'cable', defaultSets: 3, reps: '10–12' },
      { name: 'Cable Lateral Raise', muscleGroup: 'shoulders', secondaryMuscles: [], equipment: 'cable', defaultSets: 3, reps: '12–15' },
      { name: 'Tricep Pushdown', muscleGroup: 'triceps', secondaryMuscles: [], equipment: 'cable', defaultSets: 2, reps: '12–15' },
      { name: 'Hammer Curl', muscleGroup: 'biceps', secondaryMuscles: ['forearms'], equipment: 'dumbbell', defaultSets: 2, reps: '12' },
    ],
  },
];

/* Group by athlete */
export const LEGEND_ATHLETES = [
  { id: 'cbum',   name: 'Chris Bumstead', image: cbumImg,   tag: 'Classic Physique', accent: '#ff2d95', emoji: '🏆', tagline: 'Aesthetics & Control' },
  { id: 'ronnie', name: 'Ronnie Coleman', image: ronnieImg, tag: 'Mass & Power',     accent: '#ff6a00', emoji: '🔥', tagline: 'Mass & Brutality' },
  { id: 'larry',  name: 'Larry Wheels',   image: larryImg,  tag: 'Powerbuilding',    accent: '#00f0ff', emoji: '⚙️', tagline: 'Strength + Size' },
  { id: 'jeff',   name: 'Jeff Nippard',   image: jeffImg,   tag: 'Science-Based',    accent: '#39ff14', emoji: '🧠', tagline: 'Sustainability & Precision' },
];

export default LEGEND_TEMPLATES;
