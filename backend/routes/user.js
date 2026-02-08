const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Workout = require('../models/Workout');
const NutritionLog = require('../models/NutritionLog');
const { protect, requireOnboarded } = require('../middleware/authMiddleware');

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const updateFields = {};
    const allowed = ['name', 'gender', 'age', 'weight', 'height', 'activityLevel'];
    allowed.forEach(f => { if (req.body[f] !== undefined) updateFields[f] = req.body[f]; });
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password').lean();
    
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/goals', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (req.body.calories !== undefined) user.dailyGoal.calories = req.body.calories;
    if (req.body.protein !== undefined) user.dailyGoal.protein = req.body.protein;
    if (req.body.carbs !== undefined) user.dailyGoal.carbs = req.body.carbs;
    if (req.body.fats !== undefined) user.dailyGoal.fats = req.body.fats;
    
    user.markModified('dailyGoal');
    await user.save();
    
    res.status(200).json({ dailyGoal: user.dailyGoal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats', protect, async (req, res) => {
  try {
    const [totalWorkouts, totalNutritionLogs, lastWorkout] = await Promise.all([
      Workout.countDocuments({ user: req.user.id }),
      NutritionLog.countDocuments({ user: req.user.id }),
      Workout.findOne({ user: req.user.id }).sort({ date: -1 }).select('date').lean()
    ]);
    
    res.status(200).json({
      totalWorkouts,
      totalNutritionLogs,
      lastWorkoutDate: lastWorkout ? lastWorkout.date : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
