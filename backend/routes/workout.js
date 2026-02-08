const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const PersonalRecord = require('../models/PersonalRecord');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const MET_DEFAULT = 6; // Moderate lifting

const getWeekKey = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  const monday = new Date(d);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10); // YYYY-MM-DD
};

const computeMuscleFrequencyForWorkout = (workout) => {
  const freq = {
    chest: 0, back: 0, shoulders: 0, biceps: 0, triceps: 0,
    forearms: 0, abs: 0, obliques: 0, quads: 0,
    hamstrings: 0, glutes: 0, calves: 0
  };
  (workout.exercises || []).forEach(ex => {
    if (ex.exerciseId && ex.exerciseId.muscleGroup && freq[ex.exerciseId.muscleGroup] !== undefined) {
      freq[ex.exerciseId.muscleGroup] += 1;
    }
    if (ex.exerciseId && Array.isArray(ex.exerciseId.secondaryMuscles)) {
      ex.exerciseId.secondaryMuscles.forEach(sm => {
        if (freq[sm] !== undefined) freq[sm] += 0.5;
      });
    }
  });
  return freq;
};

const getPrevWeekKey = (weekKey) => {
  const d = new Date(weekKey);
  d.setDate(d.getDate() - 7);
  return getWeekKey(d);
};

/* ── Exercise search ── */
router.get('/exercises/search', protect, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const filter = q ? { name: { $regex: q, $options: 'i' } } : {};
    const exercises = await Exercise.find(filter)
      .sort({ name: 1 })
      .limit(30)
      .lean();
    res.json({ exercises });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ── Last-used weights for an exercise name ── */
router.get('/last-weights', protect, async (req, res) => {
  try {
    const exerciseName = (req.query.exerciseName || '').trim();
    if (!exerciseName) return res.json({ sets: [] });

    // Find the most recent workout containing this exercise
    const workout = await Workout.findOne({
      user: req.user.id,
      'exercises.exerciseName': { $regex: new RegExp(`^${exerciseName}$`, 'i') }
    })
      .sort({ date: -1 })
      .select('exercises')
      .lean();

    if (!workout) return res.json({ sets: [] });

    const match = workout.exercises.find(
      (ex) => (ex.exerciseName || '').toLowerCase() === exerciseName.toLowerCase()
    );
    res.json({ sets: match ? match.sets : [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = { user: req.user.id };
    
    const [workouts, total] = await Promise.all([
      Workout.find(filter)
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('exercises.exerciseId', 'name muscleGroup secondaryMuscles')
        .lean(),
      Workout.countDocuments(filter)
    ]);
    
    res.status(200).json({ workouts, total, page, limit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { exercises, duration, notes } = req.body;
    
    let totalVolume = 0;
    let totalReps = 0;

    // Find-or-create Exercise documents so exerciseId is always linked
    const normalizedExercises = await Promise.all(
      (exercises || []).map(async (ex) => {
        let exerciseId = ex.exerciseId || null;

        // If no exerciseId but we have a name, find or create the Exercise doc
        if (!exerciseId && ex.exerciseName) {
          let dbEx = await Exercise.findOne({
            name: { $regex: new RegExp(`^${ex.exerciseName}$`, 'i') }
          }).lean();
          if (!dbEx) {
            dbEx = await Exercise.create({
              name: ex.exerciseName,
              muscleGroup: ex.muscleGroup || 'chest',
              secondaryMuscles: ex.secondaryMuscles || [],
              equipment: ex.equipment || 'bodyweight',
              category: ex.category || 'strength',
            });
          }
          exerciseId = dbEx._id;
        }

        const sets = ex.sets || [];
        let exVolume = 0;
        let exReps = 0;
        let completedSets = 0;
        sets.forEach(set => {
          if (set.completed) {
            const reps = set.reps || 0;
            const weight = set.weight || 0;
            exVolume += weight * reps;
            exReps += reps;
            completedSets += 1;
          }
        });
        totalVolume += exVolume;
        totalReps += exReps;
        return {
          exerciseId,
          exerciseName: ex.exerciseName,
          muscleGroup: ex.muscleGroup,
          secondaryMuscles: ex.secondaryMuscles || [],
          sets,
          notes: ex.notes || '',
          metrics: {
            totalReps: exReps,
            totalVolume: exVolume,
            completedSets,
          },
        };
      })
    );
    
    const workout = new Workout({
      user: req.user.id,
      exercises: normalizedExercises,
      duration,
      notes,
      totalVolume,
      totalReps,
    });
    await workout.save();
    
    const newRecords = [];
    // Batch: fetch all existing PRs for this user's exercises in one query
    const exerciseIds = normalizedExercises
      .filter(ex => ex.exerciseId && (ex.metrics?.totalVolume || 0) > 0)
      .map(ex => ex.exerciseId);
    
    if (exerciseIds.length > 0) {
      const existingPRs = await PersonalRecord.find({
        user: req.user.id,
        exerciseId: { $in: exerciseIds },
        recordType: '1RM'
      }).lean();
      
      const prMap = new Map();
      existingPRs.forEach(pr => prMap.set(pr.exerciseId.toString(), pr));
      
      const prUpdates = [];
      for (const ex of normalizedExercises) {
        const exVolume = ex.metrics?.totalVolume || 0;
        if (exVolume > 0 && ex.exerciseId) {
          const existingPR = prMap.get(ex.exerciseId.toString?.() || ex.exerciseId);
          if (!existingPR || exVolume > existingPR.value) {
            prUpdates.push(
              PersonalRecord.findOneAndUpdate(
                { user: req.user.id, exerciseId: ex.exerciseId, recordType: '1RM' },
                { value: exVolume, previousValue: existingPR ? existingPR.value : 0, date: new Date() },
                { upsert: true, new: true }
              )
            );
          }
        }
      }
      
      if (prUpdates.length > 0) {
        const results = await Promise.all(prUpdates);
        newRecords.push(...results);
      }
    }
    
    res.status(201).json({ workout, newRecords });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Recompute derived metrics for all workouts for the authenticated user.
// Reads existing logs, writes derived values only (no UI changes).
router.post('/metrics/recompute', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const weightKg = user?.weight || 70;

    const workouts = await Workout.find({ user: req.user.id })
      .sort({ date: 1 })
      .populate('exercises.exerciseId');

    const weekVolumes = {};

    // First pass: recompute per-workout totals and accumulate weekly volume
    workouts.forEach(w => {
      let totalVolume = 0;
      let totalReps = 0;

      w.exercises = (w.exercises || []).map(ex => {
        const sets = ex.sets || [];
        let exVolume = 0;
        let exReps = 0;
        let completedSets = 0;
        sets.forEach(set => {
          if (set.completed) {
            const reps = set.reps || 0;
            const weight = set.weight || 0;
            exVolume += weight * reps;
            exReps += reps;
            completedSets += 1;
          }
        });
        totalVolume += exVolume;
        totalReps += exReps;
        return {
          ...ex.toObject(),
          sets,
          metrics: {
            totalReps: exReps,
            totalVolume: exVolume,
            completedSets,
          },
        };
      });

      const durationMin = w.duration || 45;
      const caloriesBurned = Math.round(MET_DEFAULT * 3.5 * weightKg / 200 * durationMin);
      const muscleFrequency = computeMuscleFrequencyForWorkout(w);

      const weekKey = getWeekKey(w.logDate || w.date || new Date());
      weekVolumes[weekKey] = (weekVolumes[weekKey] || 0) + totalVolume;

      w.totalVolume = totalVolume;
      w.totalReps = totalReps;
      w.derived = {
        ...w.derived,
        caloriesBurned,
        muscleFrequency,
      };
      w._recomputeWeekKey = weekKey; // temp for second pass
    });

    // Second pass: compute weekly overload % using accumulated week volumes
    workouts.forEach(w => {
      const weekKey = w._recomputeWeekKey;
      const prevWeekKey = getPrevWeekKey(weekKey);
      const currVol = weekVolumes[weekKey] || 0;
      const prevVol = weekVolumes[prevWeekKey] || 0;
      const weeklyOverloadPct = prevVol ? ((currVol - prevVol) / prevVol) * 100 : 0;
      w.derived = {
        ...w.derived,
        weeklyOverloadPct: Math.round(weeklyOverloadPct * 10) / 10,
      };
      delete w._recomputeWeekKey;
    });

    await Promise.all(workouts.map(w => w.save()));

    res.status(200).json({ updated: workouts.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/muscles/last7days', protect, async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const workouts = await Workout.find({
      user: req.user.id,
      date: { $gte: sevenDaysAgo }
    })
      .select('exercises')
      .populate('exercises.exerciseId', 'muscleGroup secondaryMuscles')
      .lean();
    
    const frequency = {
      chest: 0, back: 0, shoulders: 0, biceps: 0, triceps: 0,
      forearms: 0, abs: 0, obliques: 0, quads: 0,
      hamstrings: 0, glutes: 0, calves: 0
    };
    
    workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        if (ex.exerciseId) {
          const muscleGroup = ex.exerciseId.muscleGroup;
          if (muscleGroup && frequency[muscleGroup] !== undefined) {
            frequency[muscleGroup]++;
          }
          if (ex.exerciseId.secondaryMuscles) {
            ex.exerciseId.secondaryMuscles.forEach(sm => {
              if (frequency[sm] !== undefined) {
                frequency[sm] += 0.5;
              }
            });
          }
        }
      });
    });
    
    const maxVal = Math.max(...Object.values(frequency), 1);
    const muscleIntensity = {};
    Object.keys(frequency).forEach(key => {
      muscleIntensity[key] = Math.round((frequency[key] / maxVal) * 100);
    });
    
    res.status(200).json({ muscleIntensity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/pr', protect, async (req, res) => {
  try {
    const records = await PersonalRecord.find({ user: req.user.id })
      .populate('exerciseId', 'name')
      .sort({ date: -1 })
      .lean();
    
    res.status(200).json({ records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user.id })
      .populate('exercises.exerciseId', 'name muscleGroup secondaryMuscles')
      .lean();
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
