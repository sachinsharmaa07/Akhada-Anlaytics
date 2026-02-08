const express = require('express');
const router = express.Router();
const NutritionLog = require('../models/NutritionLog');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');

// Compute calories and macros from gram-based inputs when provided, otherwise keep existing values
const computeItemMacros = (item) => {
  const grams = item.quantityGrams || item.quantity;
  const scale = grams ? grams / 100 : null;

  const calories = (scale && item.baseCaloriesPer100g !== undefined)
    ? Math.round(scale * item.baseCaloriesPer100g)
    : item.calories;

  const protein = (scale && item.baseProteinPer100g !== undefined)
    ? Math.round(scale * item.baseProteinPer100g)
    : item.protein;

  const carbs = (scale && item.baseCarbsPer100g !== undefined)
    ? Math.round(scale * item.baseCarbsPer100g)
    : item.carbs;

  const fats = (scale && item.baseFatsPer100g !== undefined)
    ? Math.round(scale * item.baseFatsPer100g)
    : item.fats;

  return {
    ...item,
    calories,
    protein,
    carbs,
    fats,
  };
};

router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const query = { user: req.user.id, date: { $gte: today, $lt: tomorrow } };
    
    // Fetch log and user in parallel
    const [log, user] = await Promise.all([
      NutritionLog.findOne(query).lean(),
      User.findById(req.user.id).select('dailyGoal').lean()
    ]);
    
    if (!log) {
      return res.status(200).json({ log: null, summary: null, goalProgress: null });
    }
    
    let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFats = 0, totalFiber = 0;
    
    for (const meal of log.meals) {
      for (const item of meal.items) {
        totalCalories += item.calories || 0;
        totalProtein += item.protein || 0;
        totalCarbs += item.carbs || 0;
        totalFats += item.fats || 0;
        totalFiber += item.fiber || 0;
      }
    }
    
    const g = user.dailyGoal;
    const goalProgress = {
      caloriesPercent: g.calories > 0 ? Math.min((totalCalories / g.calories) * 100, 100) : 0,
      proteinPercent: g.protein > 0 ? Math.min((totalProtein / g.protein) * 100, 100) : 0,
      carbsPercent: g.carbs > 0 ? Math.min((totalCarbs / g.carbs) * 100, 100) : 0,
      fatsPercent: g.fats > 0 ? Math.min((totalFats / g.fats) * 100, 100) : 0
    };
    
    res.status(200).json({
      log,
      summary: { totalCalories, totalProtein, totalCarbs, totalFats, totalFiber },
      goalProgress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const validateNutritionLog = [
  body('mealType').isIn(['breakfast', 'lunch', 'dinner', 'snack']).withMessage('Invalid meal type'),
  body('items').isArray({ min: 1 }).withMessage('At least one food item is required'),
  body('items.*.foodName').trim().notEmpty().withMessage('Food name is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
    next();
  }
];

router.post('/log', protect, validateNutritionLog, async (req, res) => {
  try {
    const { mealType, items } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let log = await NutritionLog.findOne({
      user: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    });

    const normalizedItems = (items || []).map(computeItemMacros);
    
    if (log) {
      const existingMeal = log.meals.find(m => m.mealType === mealType);
      if (existingMeal) {
        existingMeal.items.push(...normalizedItems);
      } else {
        log.meals.push({ mealType, items: normalizedItems });
      }
      await log.save();
    } else {
      log = new NutritionLog({
        user: req.user.id,
        date: today,
        meals: [{ mealType, items: normalizedItems }]
      });
      await log.save();
    }
    
    res.status(201).json({ log });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/log/:mealType/:itemIndex', protect, async (req, res) => {
  try {
    const { mealType, itemIndex } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const log = await NutritionLog.findOne({
      user: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    });
    
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }
    
    const mealIndex = log.meals.findIndex(m => m.mealType === mealType);
    if (mealIndex === -1) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    
    log.meals[mealIndex].items.splice(parseInt(itemIndex), 1);
    
    if (log.meals[mealIndex].items.length === 0) {
      log.meals.splice(mealIndex, 1);
    }
    
    await log.save();
    res.status(200).json({ log });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/history', protect, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    
    const logs = await NutritionLog.find({
      user: req.user.id,
      date: { $gte: startDate }
    }).sort({ date: 1 }).select('date meals.items.calories meals.items.protein meals.items.carbs meals.items.fats').lean();
    
    const history = logs.map(log => {
      let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFats = 0;
      for (const meal of log.meals) {
        for (const item of meal.items) {
          totalCalories += item.calories || 0;
          totalProtein += item.protein || 0;
          totalCarbs += item.carbs || 0;
          totalFats += item.fats || 0;
        }
      }
      return { date: log.date, totalCalories, totalProtein, totalCarbs, totalFats };
    });
    
    res.status(200).json({ history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/vitamins/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const log = await NutritionLog.findOne({
      user: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    });
    
    const vitamins = { vitA: 0, vitC: 0, vitD: 0, vitE: 0, vitK: 0, vitB12: 0 };
    const minerals = { calcium: 0, iron: 0, magnesium: 0, potassium: 0, zinc: 0 };
    
    if (log) {
      log.meals.forEach(meal => {
        meal.items.forEach(item => {
          if (item.vitamins) {
            Object.keys(vitamins).forEach(k => { vitamins[k] += item.vitamins[k] || 0; });
          }
          if (item.minerals) {
            Object.keys(minerals).forEach(k => { minerals[k] += item.minerals[k] || 0; });
          }
        });
      });
    }
    
    res.status(200).json({ vitamins, minerals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
