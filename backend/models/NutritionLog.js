const mongoose = require('mongoose');

const vitaminsSchema = new mongoose.Schema(
  {
    vitA: { type: Number, default: 0 },
    vitC: { type: Number, default: 0 },
    vitD: { type: Number, default: 0 },
    vitE: { type: Number, default: 0 },
    vitK: { type: Number, default: 0 },
    vitB12: { type: Number, default: 0 },
  },
  { _id: false }
);

const mineralsSchema = new mongoose.Schema(
  {
    calcium: { type: Number, default: 0 },
    iron: { type: Number, default: 0 },
    magnesium: { type: Number, default: 0 },
    potassium: { type: Number, default: 0 },
    zinc: { type: Number, default: 0 },
  },
  { _id: false }
);

const foodItemSchema = new mongoose.Schema(
  {
    foodName: { type: String },
    foodId: { type: String },
    quantity: { type: Number },
    unit: { type: String },
    // Optional gram-based quantity for higher precision logging
    quantityGrams: { type: Number },
    // Optional per-100g baselines to allow backend to auto-compute macros
    baseCaloriesPer100g: { type: Number },
    baseProteinPer100g: { type: Number },
    baseCarbsPer100g: { type: Number },
    baseFatsPer100g: { type: Number },
    calories: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
    fats: { type: Number },
    fiber: { type: Number },
    vitamins: vitaminsSchema,
    minerals: mineralsSchema
  },
  { _id: false }
);

const mealSchema = new mongoose.Schema(
  {
    mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
    items: [foodItemSchema]
  },
  { _id: false }
);

const nutritionLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    // Optional alias to store explicit log date for analytics and streaks
    logDate: { type: Date },
    meals: [mealSchema]
  },
  { timestamps: true }
);

// Keep logDate in sync with date for legacy entries
nutritionLogSchema.pre('save', function () {
  if (!this.logDate && this.date) {
    this.logDate = this.date;
  }
});

// Compound index to speed up today/weekly/monthly queries per user
nutritionLogSchema.index({ user: 1, date: 1 });
nutritionLogSchema.index({ user: 1, logDate: 1 });

module.exports = mongoose.model('NutritionLog', nutritionLogSchema);
