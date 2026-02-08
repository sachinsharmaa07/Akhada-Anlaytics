const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const indianFoods = [
  { id: 'ind1', name: 'Dal (Lentils)', calories: 116, protein: 9, carbs: 20, fats: 0.4, fiber: 8 },
  { id: 'ind2', name: 'Paneer', calories: 265, protein: 18, carbs: 1.2, fats: 21, fiber: 0 },
  { id: 'ind3', name: 'Chicken Biryani', calories: 250, protein: 15, carbs: 30, fats: 8, fiber: 1 },
  { id: 'ind4', name: 'Rice (Cooked)', calories: 130, protein: 2.7, carbs: 28, fats: 0.3, fiber: 0.4 },
  { id: 'ind5', name: 'Roti (Wheat)', calories: 120, protein: 3.5, carbs: 25, fats: 1, fiber: 2 },
  { id: 'ind6', name: 'Mixed Sabzi', calories: 85, protein: 3, carbs: 12, fats: 3, fiber: 4 },
  { id: 'ind7', name: 'Samosa', calories: 262, protein: 4, carbs: 24, fats: 17, fiber: 2 },
  { id: 'ind8', name: 'Dosa', calories: 133, protein: 4, carbs: 22, fats: 3, fiber: 1 },
  { id: 'ind9', name: 'Idli', calories: 58, protein: 2, carbs: 12, fats: 0.2, fiber: 0.5 },
  { id: 'ind10', name: 'Coconut Chutney', calories: 115, protein: 1, carbs: 6, fats: 10, fiber: 2 },
  { id: 'ind11', name: 'Naan', calories: 262, protein: 9, carbs: 45, fats: 5, fiber: 2 },
  { id: 'ind12', name: 'Tandoori Chicken', calories: 165, protein: 26, carbs: 3, fats: 6, fiber: 0 },
  { id: 'ind13', name: 'Butter Chicken', calories: 240, protein: 18, carbs: 8, fats: 15, fiber: 1 },
  { id: 'ind14', name: 'Rajma (Kidney Beans)', calories: 127, protein: 9, carbs: 23, fats: 0.5, fiber: 6 },
  { id: 'ind15', name: 'Aloo Gobi', calories: 120, protein: 3, carbs: 18, fats: 4, fiber: 3 },
  { id: 'ind16', name: 'Palak Paneer', calories: 195, protein: 12, carbs: 8, fats: 14, fiber: 2 },
  { id: 'ind17', name: 'Chole (Chickpeas)', calories: 164, protein: 9, carbs: 27, fats: 2.6, fiber: 8 },
  { id: 'ind18', name: 'Fish Curry', calories: 145, protein: 20, carbs: 5, fats: 5, fiber: 1 },
  { id: 'ind19', name: 'Egg Curry', calories: 180, protein: 13, carbs: 6, fats: 12, fiber: 1 },
  { id: 'ind20', name: 'Kheer', calories: 150, protein: 4, carbs: 22, fats: 5, fiber: 0.5 },
  { id: 'ind21', name: 'Gulab Jamun', calories: 175, protein: 3, carbs: 28, fats: 6, fiber: 0.2 },
  { id: 'ind22', name: 'Jalebi', calories: 350, protein: 2, carbs: 60, fats: 12, fiber: 0 },
  { id: 'ind23', name: 'Lassi', calories: 120, protein: 4, carbs: 18, fats: 3, fiber: 0 },
  { id: 'ind24', name: 'Chai', calories: 45, protein: 1.5, carbs: 7, fats: 1.5, fiber: 0 },
  { id: 'ind25', name: 'Masala Dosa', calories: 206, protein: 5, carbs: 30, fats: 8, fiber: 2 },
  { id: 'ind26', name: 'Paratha', calories: 260, protein: 6, carbs: 36, fats: 10, fiber: 2 },
  { id: 'ind27', name: 'Poha', calories: 180, protein: 4, carbs: 32, fats: 5, fiber: 2 },
  { id: 'ind28', name: 'Upma', calories: 175, protein: 5, carbs: 28, fats: 5, fiber: 3 },
  { id: 'ind29', name: 'Pulao', calories: 190, protein: 4, carbs: 35, fats: 4, fiber: 1 },
  { id: 'ind30', name: 'Tikka Masala', calories: 210, protein: 20, carbs: 10, fats: 10, fiber: 2 }
];

const mexicanFoods = [
  { id: 'mex1', name: 'Tacos', calories: 226, protein: 10, carbs: 20, fats: 12, fiber: 3 },
  { id: 'mex2', name: 'Burrito', calories: 295, protein: 14, carbs: 38, fats: 10, fiber: 4 },
  { id: 'mex3', name: 'Enchiladas', calories: 280, protein: 12, carbs: 25, fats: 15, fiber: 3 },
  { id: 'mex4', name: 'Guacamole', calories: 160, protein: 2, carbs: 9, fats: 15, fiber: 7 },
  { id: 'mex5', name: 'Nachos', calories: 346, protein: 9, carbs: 36, fats: 19, fiber: 3 },
  { id: 'mex6', name: 'Quesadilla', calories: 300, protein: 14, carbs: 28, fats: 15, fiber: 2 },
  { id: 'mex7', name: 'Tamales', calories: 285, protein: 8, carbs: 30, fats: 15, fiber: 4 },
  { id: 'mex8', name: 'Churros', calories: 235, protein: 3, carbs: 26, fats: 14, fiber: 1 },
  { id: 'mex9', name: 'Mexican Rice', calories: 170, protein: 3, carbs: 32, fats: 4, fiber: 1 },
  { id: 'mex10', name: 'Refried Beans', calories: 182, protein: 10, carbs: 27, fats: 4, fiber: 9 },
  { id: 'mex11', name: 'Salsa', calories: 36, protein: 2, carbs: 8, fats: 0.2, fiber: 2 },
  { id: 'mex12', name: 'Corn Tortilla', calories: 52, protein: 1.4, carbs: 11, fats: 0.6, fiber: 1.5 },
  { id: 'mex13', name: 'Chicken Fajita', calories: 200, protein: 22, carbs: 12, fats: 8, fiber: 2 },
  { id: 'mex14', name: 'Carne Asada', calories: 215, protein: 26, carbs: 0, fats: 12, fiber: 0 },
  { id: 'mex15', name: 'Flour Tortilla', calories: 90, protein: 2.5, carbs: 15, fats: 2.5, fiber: 1 },
  { id: 'mex16', name: 'Pico de Gallo', calories: 26, protein: 1, carbs: 6, fats: 0.2, fiber: 2 },
  { id: 'mex17', name: 'Mole Sauce', calories: 180, protein: 4, carbs: 15, fats: 12, fiber: 3 },
  { id: 'mex18', name: 'Carnitas', calories: 210, protein: 20, carbs: 2, fats: 14, fiber: 0 },
  { id: 'mex19', name: 'Pozole', calories: 150, protein: 12, carbs: 18, fats: 4, fiber: 3 },
  { id: 'mex20', name: 'Elote', calories: 175, protein: 5, carbs: 25, fats: 8, fiber: 3 },
  { id: 'mex21', name: 'Tres Leches', calories: 295, protein: 6, carbs: 40, fats: 12, fiber: 0 },
  { id: 'mex22', name: 'Horchata', calories: 135, protein: 1, carbs: 28, fats: 2, fiber: 0.5 },
  { id: 'mex23', name: 'Agua Fresca', calories: 80, protein: 0.5, carbs: 20, fats: 0, fiber: 1 },
  { id: 'mex24', name: 'Chicharron', calories: 540, protein: 60, carbs: 0, fats: 32, fiber: 0 },
  { id: 'mex25', name: 'Empanada', calories: 290, protein: 8, carbs: 30, fats: 15, fiber: 2 },
  { id: 'mex26', name: 'Chile Relleno', calories: 225, protein: 10, carbs: 12, fats: 16, fiber: 2 },
  { id: 'mex27', name: 'Tostadas', calories: 200, protein: 8, carbs: 22, fats: 10, fiber: 3 },
  { id: 'mex28', name: 'Huevos Rancheros', calories: 280, protein: 14, carbs: 20, fats: 16, fiber: 4 },
  { id: 'mex29', name: 'Arroz con Pollo', calories: 240, protein: 18, carbs: 28, fats: 6, fiber: 1 },
  { id: 'mex30', name: 'Jalapeño', calories: 28, protein: 1, carbs: 6, fats: 0.4, fiber: 3 }
];

router.get('/search', async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) {
      return res.status(400).json({ message: 'Provide a search query' });
    }
    
    const response = await axios.get('https://api.nal.usda.gov/fdc/v1/foods/search', {
      params: { query: q, api_key: process.env.USDA_API_KEY || 'DEMO_KEY', pageSize: 20 },
      timeout: 8000
    });
    
    const foods = (response.data.foods || []).map(food => {
      const getNutrient = (name) => {
        const n = food.foodNutrients?.find(fn => fn.nutrientName?.toLowerCase().includes(name.toLowerCase()));
        return n ? { name: n.nutrientName, value: n.value || 0, unit: n.unitName || '' } : { name, value: 0, unit: '' };
      };
      
      return {
        id: food.fdcId,
        name: food.description,
        brandOwner: food.brandOwner || '',
        nutrients: [
          getNutrient('Energy'),
          getNutrient('Protein'),
          getNutrient('Carbohydrate'),
          getNutrient('Total lipid'),
          getNutrient('Fiber'),
          getNutrient('Vitamin A'),
          getNutrient('Vitamin C'),
          getNutrient('Vitamin D'),
          getNutrient('Vitamin E'),
          getNutrient('Vitamin K'),
          getNutrient('Vitamin B-12'),
          getNutrient('Calcium'),
          getNutrient('Iron'),
          getNutrient('Magnesium'),
          getNutrient('Potassium'),
          getNutrient('Zinc')
        ]
      };
    });
    
    res.status(200).json({ foods });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/search/indian', async (req, res) => {
  try {
    const q = (req.query.q || '').toLowerCase();
    const filtered = indianFoods
      .filter(f => f.name.toLowerCase().includes(q))
      .slice(0, 15)
      .map(f => ({
        id: f.id,
        name: f.name,
        nutrients: [
          { name: 'Calories', value: f.calories, unit: 'kcal' },
          { name: 'Protein', value: f.protein, unit: 'g' },
          { name: 'Carbs', value: f.carbs, unit: 'g' },
          { name: 'Fats', value: f.fats, unit: 'g' },
          { name: 'Fiber', value: f.fiber, unit: 'g' }
        ]
      }));
    
    res.status(200).json({ foods: filtered });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/search/mexican', async (req, res) => {
  try {
    const q = (req.query.q || '').toLowerCase();
    const filtered = mexicanFoods
      .filter(f => f.name.toLowerCase().includes(q))
      .slice(0, 15)
      .map(f => ({
        id: f.id,
        name: f.name,
        nutrients: [
          { name: 'Calories', value: f.calories, unit: 'kcal' },
          { name: 'Protein', value: f.protein, unit: 'g' },
          { name: 'Carbs', value: f.carbs, unit: 'g' },
          { name: 'Fats', value: f.fats, unit: 'g' },
          { name: 'Fiber', value: f.fiber, unit: 'g' }
        ]
      }));
    
    res.status(200).json({ foods: filtered });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
