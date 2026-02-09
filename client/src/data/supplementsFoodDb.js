// Supplements & Fitness Foods Database
// All values per 100g unless noted (per scoop/serving marked accordingly)

const supplementsFoodDb = [
  // ============ PROTEIN POWDERS ============
  { id: 5001, name: "Whey Protein Isolate (per scoop 30g)", category: "Protein Powder", calories: 120, protein: 25, carbs: 2, fats: 0.5, fiber: 0, region: "Supplement", pieceWeight: 30 },
  { id: 5002, name: "Whey Protein Concentrate (per scoop 30g)", category: "Protein Powder", calories: 130, protein: 24, carbs: 3, fats: 1.5, fiber: 0, region: "Supplement", pieceWeight: 30 },
  { id: 5003, name: "Casein Protein (per scoop 33g)", category: "Protein Powder", calories: 120, protein: 24, carbs: 3, fats: 1, fiber: 0, region: "Supplement", pieceWeight: 33 },
  { id: 5004, name: "Plant Protein (Pea + Rice, per scoop 35g)", category: "Protein Powder", calories: 130, protein: 22, carbs: 5, fats: 2, fiber: 1, region: "Supplement", pieceWeight: 35 },
  { id: 5005, name: "Soy Protein Isolate (per scoop 30g)", category: "Protein Powder", calories: 115, protein: 23, carbs: 2, fats: 0.5, fiber: 0.5, region: "Supplement", pieceWeight: 30 },
  { id: 5006, name: "Egg White Protein (per scoop 30g)", category: "Protein Powder", calories: 110, protein: 24, carbs: 1, fats: 0, fiber: 0, region: "Supplement", pieceWeight: 30 },
  { id: 5007, name: "Mass Gainer (per scoop 75g)", category: "Protein Powder", calories: 310, protein: 15, carbs: 55, fats: 4, fiber: 2, region: "Supplement", pieceWeight: 75 },
  { id: 5008, name: "Whey Protein — Chocolate Flavor (per scoop 32g)", category: "Protein Powder", calories: 130, protein: 24, carbs: 4, fats: 1.5, fiber: 0.5, region: "Supplement", pieceWeight: 32 },
  { id: 5009, name: "Whey Protein — Vanilla Flavor (per scoop 32g)", category: "Protein Powder", calories: 125, protein: 24, carbs: 3, fats: 1, fiber: 0, region: "Supplement", pieceWeight: 32 },
  { id: 5010, name: "Hemp Protein (per scoop 30g)", category: "Protein Powder", calories: 120, protein: 15, carbs: 7, fats: 3.5, fiber: 5, region: "Supplement", pieceWeight: 30 },

  // ============ PRE-WORKOUT ============
  { id: 5011, name: "Pre-Workout (C4 Original, per scoop 6.5g)", category: "Pre-Workout", calories: 5, protein: 0, carbs: 1, fats: 0, fiber: 0, region: "Supplement", pieceWeight: 6.5 },
  { id: 5012, name: "Pre-Workout (Generic Caffeine + Beta-Alanine, per scoop 10g)", category: "Pre-Workout", calories: 10, protein: 0, carbs: 2, fats: 0, fiber: 0, region: "Supplement", pieceWeight: 10 },
  { id: 5013, name: "Pre-Workout (Stimulant-Free, per scoop 12g)", category: "Pre-Workout", calories: 15, protein: 0, carbs: 3, fats: 0, fiber: 0, region: "Supplement", pieceWeight: 12 },
  { id: 5014, name: "Black Coffee (Pre-Workout)", category: "Pre-Workout", calories: 2, protein: 0.3, carbs: 0, fats: 0, fiber: 0, region: "Beverage" },
  { id: 5015, name: "Espresso Shot (30ml)", category: "Pre-Workout", calories: 3, protein: 0.1, carbs: 0.5, fats: 0, fiber: 0, region: "Beverage", pieceWeight: 30 },
  { id: 5016, name: "Energy Drink (Monster/Red Bull, 250ml)", category: "Pre-Workout", calories: 112, protein: 0, carbs: 28, fats: 0, fiber: 0, region: "Beverage", pieceWeight: 250 },
  { id: 5017, name: "BCAA Powder (per scoop 7g)", category: "Pre-Workout", calories: 5, protein: 0, carbs: 0, fats: 0, fiber: 0, region: "Supplement", pieceWeight: 7 },

  // ============ CREATINE ============
  { id: 5018, name: "Creatine Monohydrate (per scoop 5g)", category: "Creatine", calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, region: "Supplement", pieceWeight: 5 },
  { id: 5019, name: "Creatine HCL (per scoop 2g)", category: "Creatine", calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, region: "Supplement", pieceWeight: 2 },
  { id: 5020, name: "Creatine + Dextrose Mix (per scoop 10g)", category: "Creatine", calories: 20, protein: 0, carbs: 5, fats: 0, fiber: 0, region: "Supplement", pieceWeight: 10 },

  // ============ PROTEIN BARS & SNACKS ============
  { id: 5021, name: "Protein Bar (per bar 60g)", category: "Protein Snack", calories: 210, protein: 20, carbs: 22, fats: 8, fiber: 3, region: "Supplement", pieceWeight: 60 },
  { id: 5022, name: "Protein Cookie (per cookie 75g)", category: "Protein Snack", calories: 250, protein: 16, carbs: 30, fats: 10, fiber: 4, region: "Supplement", pieceWeight: 75 },
  { id: 5023, name: "Protein Brownie (per brownie 65g)", category: "Protein Snack", calories: 220, protein: 15, carbs: 25, fats: 8, fiber: 2, region: "Supplement", pieceWeight: 65 },
  { id: 5024, name: "Protein Chips (per bag 30g)", category: "Protein Snack", calories: 130, protein: 10, carbs: 14, fats: 4, fiber: 1, region: "Supplement", pieceWeight: 30 },
  { id: 5025, name: "Protein Muffin (per muffin 70g)", category: "Protein Snack", calories: 220, protein: 18, carbs: 20, fats: 9, fiber: 3, region: "Supplement", pieceWeight: 70 },

  // ============ DAIRY & PROTEIN DRINKS ============
  { id: 5026, name: "Whole Milk (250ml glass)", category: "Dairy", calories: 150, protein: 8, carbs: 12, fats: 8, fiber: 0, region: "Dairy", pieceWeight: 250 },
  { id: 5027, name: "Skim Milk (250ml glass)", category: "Dairy", calories: 85, protein: 8.5, carbs: 12, fats: 0.5, fiber: 0, region: "Dairy", pieceWeight: 250 },
  { id: 5028, name: "Toned Milk (250ml glass)", category: "Dairy", calories: 120, protein: 8, carbs: 12, fats: 3, fiber: 0, region: "Dairy", pieceWeight: 250 },
  { id: 5029, name: "Double Toned Milk (250ml glass)", category: "Dairy", calories: 100, protein: 8, carbs: 12, fats: 1.5, fiber: 0, region: "Dairy", pieceWeight: 250 },
  { id: 5030, name: "Almond Milk (250ml glass)", category: "Dairy", calories: 40, protein: 1, carbs: 3, fats: 3, fiber: 0.5, region: "Dairy", pieceWeight: 250 },
  { id: 5031, name: "Soy Milk (250ml glass)", category: "Dairy", calories: 80, protein: 7, carbs: 4, fats: 4, fiber: 1, region: "Dairy", pieceWeight: 250 },
  { id: 5032, name: "Oat Milk (250ml glass)", category: "Dairy", calories: 120, protein: 3, carbs: 16, fats: 5, fiber: 2, region: "Dairy", pieceWeight: 250 },
  { id: 5033, name: "Greek Yogurt (100g)", category: "Dairy", calories: 97, protein: 9, carbs: 5, fats: 5, fiber: 0, region: "Dairy" },
  { id: 5034, name: "Greek Yogurt — Non-Fat (100g)", category: "Dairy", calories: 59, protein: 10, carbs: 4, fats: 0.4, fiber: 0, region: "Dairy" },
  { id: 5035, name: "Cottage Cheese / Paneer (100g)", category: "Dairy", calories: 265, protein: 18, carbs: 1.2, fats: 21, fiber: 0, region: "Dairy" },
  { id: 5036, name: "Curd / Dahi (100g)", category: "Dairy", calories: 60, protein: 3.5, carbs: 5, fats: 3, fiber: 0, region: "Dairy" },
  { id: 5037, name: "Buttermilk / Chaas (250ml)", category: "Dairy", calories: 40, protein: 3, carbs: 5, fats: 1, fiber: 0, region: "Dairy", pieceWeight: 250 },
  { id: 5038, name: "Protein Shake — Whey + Milk (350ml)", category: "Dairy", calories: 280, protein: 35, carbs: 18, fats: 8, fiber: 0, region: "Supplement", pieceWeight: 350 },
  { id: 5039, name: "Protein Shake — Whey + Water (300ml)", category: "Dairy", calories: 120, protein: 25, carbs: 2, fats: 0.5, fiber: 0, region: "Supplement", pieceWeight: 300 },
  { id: 5040, name: "Chocolate Milk (250ml)", category: "Dairy", calories: 190, protein: 8, carbs: 26, fats: 5, fiber: 1, region: "Dairy", pieceWeight: 250 },

  // ============ OATS & CEREALS ============
  { id: 5041, name: "Rolled Oats (Raw, 100g)", category: "Oats & Cereal", calories: 389, protein: 13, carbs: 66, fats: 7, fiber: 10, region: "Grain" },
  { id: 5042, name: "Oatmeal — Cooked with Water (1 bowl 250g)", category: "Oats & Cereal", calories: 170, protein: 6, carbs: 30, fats: 3.5, fiber: 5, region: "Grain", pieceWeight: 250 },
  { id: 5043, name: "Oatmeal — Cooked with Milk (1 bowl 300g)", category: "Oats & Cereal", calories: 290, protein: 12, carbs: 42, fats: 8, fiber: 5, region: "Grain", pieceWeight: 300 },
  { id: 5044, name: "Overnight Oats (1 jar 250g)", category: "Oats & Cereal", calories: 310, protein: 14, carbs: 45, fats: 9, fiber: 6, region: "Grain", pieceWeight: 250 },
  { id: 5045, name: "Masala Oats (1 bowl 200g)", category: "Oats & Cereal", calories: 220, protein: 8, carbs: 35, fats: 5, fiber: 5, region: "Grain", pieceWeight: 200 },
  { id: 5046, name: "Steel Cut Oats (Raw, 100g)", category: "Oats & Cereal", calories: 379, protein: 13, carbs: 68, fats: 6, fiber: 8, region: "Grain" },
  { id: 5047, name: "Instant Oats (Raw, 100g)", category: "Oats & Cereal", calories: 375, protein: 12, carbs: 67, fats: 6, fiber: 9, region: "Grain" },
  { id: 5048, name: "Muesli (100g)", category: "Oats & Cereal", calories: 340, protein: 10, carbs: 60, fats: 8, fiber: 7, region: "Grain" },
  { id: 5049, name: "Granola (100g)", category: "Oats & Cereal", calories: 471, protein: 10, carbs: 64, fats: 20, fiber: 7, region: "Grain" },
  { id: 5050, name: "Corn Flakes (100g)", category: "Oats & Cereal", calories: 357, protein: 8, carbs: 84, fats: 0.4, fiber: 3, region: "Grain" },

  // ============ FRUITS ============
  { id: 5051, name: "Banana", category: "Fruit", calories: 89, protein: 1.1, carbs: 23, fats: 0.3, fiber: 2.6, region: "Fruit", pieceWeight: 120 },
  { id: 5052, name: "Apple", category: "Fruit", calories: 52, protein: 0.3, carbs: 14, fats: 0.2, fiber: 2.4, region: "Fruit", pieceWeight: 180 },
  { id: 5053, name: "Orange", category: "Fruit", calories: 47, protein: 0.9, carbs: 12, fats: 0.1, fiber: 2.4, region: "Fruit", pieceWeight: 150 },
  { id: 5054, name: "Mango", category: "Fruit", calories: 60, protein: 0.8, carbs: 15, fats: 0.4, fiber: 1.6, region: "Fruit", pieceWeight: 200 },
  { id: 5055, name: "Watermelon", category: "Fruit", calories: 30, protein: 0.6, carbs: 8, fats: 0.2, fiber: 0.4, region: "Fruit" },
  { id: 5056, name: "Papaya", category: "Fruit", calories: 43, protein: 0.5, carbs: 11, fats: 0.3, fiber: 1.7, region: "Fruit" },
  { id: 5057, name: "Grapes", category: "Fruit", calories: 69, protein: 0.7, carbs: 18, fats: 0.2, fiber: 0.9, region: "Fruit" },
  { id: 5058, name: "Pineapple", category: "Fruit", calories: 50, protein: 0.5, carbs: 13, fats: 0.1, fiber: 1.4, region: "Fruit" },
  { id: 5059, name: "Strawberries", category: "Fruit", calories: 32, protein: 0.7, carbs: 8, fats: 0.3, fiber: 2, region: "Fruit" },
  { id: 5060, name: "Blueberries", category: "Fruit", calories: 57, protein: 0.7, carbs: 14, fats: 0.3, fiber: 2.4, region: "Fruit" },
  { id: 5061, name: "Pomegranate", category: "Fruit", calories: 83, protein: 1.7, carbs: 19, fats: 1.2, fiber: 4, region: "Fruit", pieceWeight: 175 },
  { id: 5062, name: "Guava", category: "Fruit", calories: 68, protein: 2.6, carbs: 14, fats: 1, fiber: 5.4, region: "Fruit", pieceWeight: 100 },
  { id: 5063, name: "Kiwi", category: "Fruit", calories: 61, protein: 1.1, carbs: 15, fats: 0.5, fiber: 3, region: "Fruit", pieceWeight: 75 },
  { id: 5064, name: "Avocado", category: "Fruit", calories: 160, protein: 2, carbs: 9, fats: 15, fiber: 7, region: "Fruit", pieceWeight: 150 },
  { id: 5065, name: "Chickoo / Sapota", category: "Fruit", calories: 83, protein: 0.4, carbs: 20, fats: 1.1, fiber: 5.3, region: "Fruit", pieceWeight: 85 },
  { id: 5066, name: "Dates (Khajur, 2 pieces)", category: "Fruit", calories: 282, protein: 2.5, carbs: 75, fats: 0.4, fiber: 8, region: "Fruit", pieceWeight: 16 },
  { id: 5067, name: "Dry Figs (Anjeer, 2 pieces)", category: "Fruit", calories: 249, protein: 3.3, carbs: 64, fats: 1, fiber: 10, region: "Fruit", pieceWeight: 16 },
  { id: 5068, name: "Raisins (Kishmish, 1 tbsp)", category: "Fruit", calories: 299, protein: 3.1, carbs: 79, fats: 0.5, fiber: 3.7, region: "Fruit", pieceWeight: 15 },

  // ============ NUTS & SEEDS ============
  { id: 5069, name: "Almonds (10 pieces)", category: "Nuts & Seeds", calories: 576, protein: 21, carbs: 22, fats: 49, fiber: 12, region: "Nut", pieceWeight: 14 },
  { id: 5070, name: "Walnuts (5 halves)", category: "Nuts & Seeds", calories: 654, protein: 15, carbs: 14, fats: 65, fiber: 7, region: "Nut", pieceWeight: 14 },
  { id: 5071, name: "Cashews (10 pieces)", category: "Nuts & Seeds", calories: 553, protein: 18, carbs: 30, fats: 44, fiber: 3, region: "Nut", pieceWeight: 15 },
  { id: 5072, name: "Peanuts (1 handful 30g)", category: "Nuts & Seeds", calories: 567, protein: 26, carbs: 16, fats: 49, fiber: 9, region: "Nut", pieceWeight: 30 },
  { id: 5073, name: "Peanut Butter (1 tbsp 16g)", category: "Nuts & Seeds", calories: 588, protein: 25, carbs: 20, fats: 50, fiber: 6, region: "Nut", pieceWeight: 16 },
  { id: 5074, name: "Almond Butter (1 tbsp 16g)", category: "Nuts & Seeds", calories: 614, protein: 21, carbs: 19, fats: 56, fiber: 10, region: "Nut", pieceWeight: 16 },
  { id: 5075, name: "Chia Seeds (1 tbsp 12g)", category: "Nuts & Seeds", calories: 486, protein: 17, carbs: 42, fats: 31, fiber: 34, region: "Seed", pieceWeight: 12 },
  { id: 5076, name: "Flax Seeds (1 tbsp 10g)", category: "Nuts & Seeds", calories: 534, protein: 18, carbs: 29, fats: 42, fiber: 27, region: "Seed", pieceWeight: 10 },
  { id: 5077, name: "Pumpkin Seeds (1 tbsp 10g)", category: "Nuts & Seeds", calories: 559, protein: 30, carbs: 11, fats: 49, fiber: 6, region: "Seed", pieceWeight: 10 },
  { id: 5078, name: "Sunflower Seeds (1 tbsp 10g)", category: "Nuts & Seeds", calories: 584, protein: 21, carbs: 20, fats: 51, fiber: 9, region: "Seed", pieceWeight: 10 },
  { id: 5079, name: "Mixed Nuts Trail Mix (30g handful)", category: "Nuts & Seeds", calories: 520, protein: 18, carbs: 25, fats: 40, fiber: 5, region: "Nut", pieceWeight: 30 },

  // ============ EGGS ============
  { id: 5080, name: "Whole Egg — Boiled (1 egg)", category: "Egg", calories: 155, protein: 13, carbs: 1.1, fats: 11, fiber: 0, region: "Protein", pieceWeight: 50 },
  { id: 5081, name: "Egg White — Boiled (1 egg)", category: "Egg", calories: 52, protein: 11, carbs: 0.7, fats: 0.2, fiber: 0, region: "Protein", pieceWeight: 33 },
  { id: 5082, name: "Egg Omelette — 2 Eggs", category: "Egg", calories: 154, protein: 11, carbs: 1.6, fats: 12, fiber: 0, region: "Protein", pieceWeight: 120 },
  { id: 5083, name: "Egg Bhurji (2 Eggs)", category: "Egg", calories: 180, protein: 12, carbs: 3, fats: 14, fiber: 0.5, region: "Protein", pieceWeight: 130 },

  // ============ CHICKEN & MEAT (COOKED) ============
  { id: 5084, name: "Chicken Breast — Grilled (100g)", category: "Meat", calories: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0, region: "Protein" },
  { id: 5085, name: "Chicken Thigh — Skinless (100g)", category: "Meat", calories: 209, protein: 26, carbs: 0, fats: 11, fiber: 0, region: "Protein" },
  { id: 5086, name: "Chicken Breast — Boiled (100g)", category: "Meat", calories: 150, protein: 30, carbs: 0, fats: 3, fiber: 0, region: "Protein" },
  { id: 5087, name: "Fish — Rohu / Salmon (100g)", category: "Meat", calories: 180, protein: 25, carbs: 0, fats: 8, fiber: 0, region: "Protein" },
  { id: 5088, name: "Tuna — Canned in Water (100g)", category: "Meat", calories: 116, protein: 26, carbs: 0, fats: 1, fiber: 0, region: "Protein" },
  { id: 5089, name: "Mutton / Lamb (100g)", category: "Meat", calories: 250, protein: 25, carbs: 0, fats: 16, fiber: 0, region: "Protein" },
  { id: 5090, name: "Prawns / Shrimp (100g)", category: "Meat", calories: 99, protein: 24, carbs: 0, fats: 0.3, fiber: 0, region: "Protein" },

  // ============ OTHER SUPPLEMENTS ============
  { id: 5091, name: "Fish Oil Capsule (1 softgel)", category: "Supplement", calories: 10, protein: 0, carbs: 0, fats: 1, fiber: 0, region: "Supplement", pieceWeight: 1 },
  { id: 5092, name: "Multivitamin Tablet (1 tab)", category: "Supplement", calories: 5, protein: 0, carbs: 1, fats: 0, fiber: 0, region: "Supplement", pieceWeight: 1 },
  { id: 5093, name: "Glutamine Powder (per scoop 5g)", category: "Supplement", calories: 20, protein: 5, carbs: 0, fats: 0, fiber: 0, region: "Supplement", pieceWeight: 5 },
  { id: 5094, name: "EAA Powder (per scoop 10g)", category: "Supplement", calories: 5, protein: 0, carbs: 0, fats: 0, fiber: 0, region: "Supplement", pieceWeight: 10 },
  { id: 5095, name: "Electrolyte Powder (per sachet 5g)", category: "Supplement", calories: 10, protein: 0, carbs: 2, fats: 0, fiber: 0, region: "Supplement", pieceWeight: 5 },
  { id: 5096, name: "ZMA Capsule (1 cap)", category: "Supplement", calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, region: "Supplement", pieceWeight: 1 },
  { id: 5097, name: "Ashwagandha Capsule (1 cap)", category: "Supplement", calories: 5, protein: 0, carbs: 1, fats: 0, fiber: 0, region: "Supplement", pieceWeight: 1 },

  // ============ HEALTHY SNACKS / MEAL PREP ============
  { id: 5098, name: "Brown Rice — Cooked (1 bowl 200g)", category: "Grain", calories: 111, protein: 2.6, carbs: 23, fats: 0.9, fiber: 1.8, region: "Grain", pieceWeight: 200 },
  { id: 5099, name: "Quinoa — Cooked (1 bowl 185g)", category: "Grain", calories: 120, protein: 4.4, carbs: 21, fats: 1.9, fiber: 2.8, region: "Grain", pieceWeight: 185 },
  { id: 5100, name: "Sweet Potato — Boiled (100g)", category: "Grain", calories: 86, protein: 1.6, carbs: 20, fats: 0.1, fiber: 3, region: "Grain" },
  { id: 5101, name: "White Rice — Cooked (1 bowl 200g)", category: "Grain", calories: 130, protein: 2.7, carbs: 28, fats: 0.3, fiber: 0.4, region: "Grain", pieceWeight: 200 },
  { id: 5102, name: "Whole Wheat Bread (1 slice 30g)", category: "Grain", calories: 247, protein: 13, carbs: 41, fats: 4, fiber: 7, region: "Grain", pieceWeight: 30 },
  { id: 5103, name: "White Bread (1 slice 30g)", category: "Grain", calories: 265, protein: 9, carbs: 49, fats: 3, fiber: 2.7, region: "Grain", pieceWeight: 30 },
  { id: 5104, name: "Multigrain Bread (1 slice 35g)", category: "Grain", calories: 250, protein: 12, carbs: 43, fats: 4, fiber: 6, region: "Grain", pieceWeight: 35 },

  // ============ SMOOTHIES & SHAKES ============
  { id: 5105, name: "Banana Shake (300ml)", category: "Shake", calories: 220, protein: 8, carbs: 38, fats: 5, fiber: 2, region: "Shake", pieceWeight: 300 },
  { id: 5106, name: "Mango Shake (300ml)", category: "Shake", calories: 200, protein: 7, carbs: 35, fats: 4, fiber: 1.5, region: "Shake", pieceWeight: 300 },
  { id: 5107, name: "Protein Smoothie — Banana + Whey + Oats (400ml)", category: "Shake", calories: 380, protein: 35, carbs: 45, fats: 8, fiber: 5, region: "Shake", pieceWeight: 400 },
  { id: 5108, name: "Green Smoothie — Spinach + Banana (300ml)", category: "Shake", calories: 150, protein: 5, carbs: 30, fats: 2, fiber: 4, region: "Shake", pieceWeight: 300 },
  { id: 5109, name: "Peanut Butter Banana Shake (350ml)", category: "Shake", calories: 420, protein: 22, carbs: 48, fats: 18, fiber: 5, region: "Shake", pieceWeight: 350 },
  { id: 5110, name: "Mixed Berry Smoothie (300ml)", category: "Shake", calories: 160, protein: 4, carbs: 32, fats: 2, fiber: 5, region: "Shake", pieceWeight: 300 },
];

export default supplementsFoodDb;
