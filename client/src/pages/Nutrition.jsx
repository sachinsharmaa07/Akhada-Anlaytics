import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Search, Plus, Trash2, ChevronDown, ChevronUp, X, Flame, Beef, Wheat, Droplets, Scale } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import useAuthStore from '../stores/authStore';
import useNutritionStore from '../stores/nutritionStore';
import { getNutritionToday, logFood, deleteNutritionItem, searchFood, searchMexicanFood } from '../api/api';
import indianFoodDb from '../data/indianFoodDb';
import usFoodDb from '../data/usFoodDb';
import europeanFoodDb from '../data/europeanFoodDb';
import supplementsFoodDb from '../data/supplementsFoodDb';
import { toast } from '../stores/toastStore';
import '../styles/Nutrition.css';

/* ── Unit → grams conversion ── */
const UNIT_GRAMS = { g: 1, ml: 1, cup: 240, piece: 100, oz: 28.35, tbsp: 15, tsp: 5, serving: 100 };

/* ── Per-food piece weights (grams per 1 piece) ── */
const PIECE_WEIGHTS = {
  'Idli': 40, 'Idli (Steamed)': 40, 'Rava Idli': 45, 'Medu Vada': 50, 'Sambar Vada': 80,
  'Chapati': 35, 'Roti': 35, 'Phulka': 30, 'Naan': 90, 'Paratha': 80,
  'Aloo Paratha': 100, 'Gobi Paratha': 95, 'Paneer Paratha': 100, 'Methi Paratha': 85,
  'Plain Paratha': 80, 'Puri': 25, 'Bhatura': 60, 'Dosa': 80, 'Masala Dosa': 120,
  'Plain Dosa': 80, 'Rava Dosa': 85, 'Uttapam': 100, 'Appam': 50, 'Vada Pav': 120,
  'Samosa': 80, 'Bread Pakora': 70, 'Kachori': 60, 'Dhokla': 40, 'Egg': 50,
  'Boiled Egg': 50, 'Scrambled Eggs': 120, 'Banana': 120, 'Apple': 180, 'Orange': 150,
  'Mango': 200, 'Guava': 100, 'Chicken Breast': 175, 'Chicken Thigh': 130,
  'Bagel': 100, 'Muffin': 115, 'Croissant': 60, 'Pancake': 75, 'Waffle': 75,
  'Slice of Pizza': 107, 'Hot Dog': 100, 'Burger Patty': 115, 'Taco': 80,
  'Bread Slice': 30, 'Toast': 30, 'Cookie': 30, 'Brownie': 55, 'Donut': 65,
  // Supplements
  'Protein Bar': 60, 'Protein Cookie': 75, 'Protein Brownie': 65,
  'Protein Muffin': 70, 'Dates': 16, 'Almonds': 14, 'Walnuts': 14, 'Cashews': 15,
};

const getPieceWeight = (foodName) => {
  const key = Object.keys(PIECE_WEIGHTS).find(k => foodName.toLowerCase().includes(k.toLowerCase()));
  return key ? PIECE_WEIGHTS[key] : 100;
};

const getGramsEquivalent = (qty, unit, foodName = '') => {
  if (unit === 'piece') return qty * getPieceWeight(foodName);
  return qty * (UNIT_GRAMS[unit] || 1);
};

/* ── Category emoji map ── */
const CATEGORY_EMOJI = {
  Breakfast: '🍳', Rice: '🍚', Bread: '🫓', Dal: '🍲', Sabzi: '🥘',
  'Non-Veg': '🍗', Snack: '🥟', Sweet: '🍬', Dessert: '🍮', Beverage: '🥤',
  Tandoori: '🔥', 'Indo-Chinese': '🥡', Chutney: '🫙', Pickle: '🥒',
  Accompaniment: '🥗', Salad: '🥗', Regional: '🏠',
  /* US categories */
  'Fast Food': '🍔', Protein: '🥩', Dairy: '🧀', Grain: '🌾',
  Fruit: '🍎', Vegetable: '🥦', Seafood: '🦐', Soup: '🍜',
  /* European categories */
  Pasta: '🍝', Pastry: '🥐', Meat: '🥩', Cheese: '🧀', Sausage: '🌭',
  Stew: '🍲',
  /* Supplements categories */
  'Protein Powder': '🥤', 'Pre-Workout': '⚡', Creatine: '💊',
  'Protein Snack': '🍫', Egg: '🥚', Shake: '🧉',
  'Oats & Cereal': '🥣', 'Nuts & Seeds': '🥜', Supplement: '💊',
};
const INDIAN_CATEGORIES = ['All', 'Breakfast', 'Rice', 'Bread', 'Dal', 'Sabzi', 'Non-Veg', 'Snack', 'Sweet', 'Dessert', 'Beverage', 'Tandoori', 'Indo-Chinese', 'Chutney', 'Pickle', 'Accompaniment', 'Salad', 'Regional'];
const US_CATEGORIES = ['All', 'Breakfast', 'Fast Food', 'Protein', 'Dairy', 'Grain', 'Snack', 'Fruit', 'Vegetable', 'Beverage', 'Dessert', 'Seafood', 'Soup'];
const EU_CATEGORIES = ['All', 'Breakfast', 'Pasta', 'Bread', 'Pastry', 'Meat', 'Cheese', 'Seafood', 'Sausage', 'Soup', 'Stew', 'Dessert', 'Snack', 'Beverage', 'Salad'];
const SUPP_CATEGORIES = ['All', 'Protein Powder', 'Pre-Workout', 'Creatine', 'Protein Snack', 'Dairy', 'Oats & Cereal', 'Fruit', 'Nuts & Seeds', 'Egg', 'Meat', 'Grain', 'Shake', 'Supplement'];

/* ── Convert flat food item → nutrients-array format ── */
const toNutrientsFormat = (item) => ({
  id: item.id,
  name: item.name,
  category: item.category,
  region: item.region,
  pieceWeight: item.pieceWeight,
  nutrients: [
    { name: 'Energy', value: item.calories, unit: 'kcal' },
    { name: 'Protein', value: item.protein, unit: 'g' },
    { name: 'Carbohydrate', value: item.carbs, unit: 'g' },
    { name: 'Total lipid (fat)', value: item.fats, unit: 'g' },
    { name: 'Fiber', value: item.fiber, unit: 'g' },
  ],
});

/* ── Local search functions ── */
const searchLocalFoods = (db, query, category = 'All', limit = 20) => {
  if (!query && category === 'All') return db.slice(0, limit).map(toNutrientsFormat);
  const q = query?.toLowerCase().trim() || '';
  return db
    .filter((item) => {
      const catMatch = category === 'All' || item.category === category;
      const nameMatch = !q || item.name.toLowerCase().includes(q) || item.region?.toLowerCase().includes(q);
      return catMatch && nameMatch;
    })
    .slice(0, limit)
    .map(toNutrientsFormat);
};

/* ─── Food Search Dropdown ─── */
/* ── All local databases combined for cross-cuisine search ── */
const ALL_LOCAL_FOODS = [...indianFoodDb, ...usFoodDb, ...europeanFoodDb, ...supplementsFoodDb];

const CUISINE_CONFIG = [
  { key: 'indian', label: '🇮🇳 Indian', db: indianFoodDb, categories: INDIAN_CATEGORIES, placeholder: 'Search 500+ Indian foods…' },
  { key: 'supplements', label: '💪 Supplements', db: supplementsFoodDb, categories: SUPP_CATEGORIES, placeholder: 'Protein, creatine, oats, fruits…' },
  { key: 'us', label: '🇺🇸 US', db: usFoodDb, categories: US_CATEGORIES, placeholder: 'Search American foods…' },
  { key: 'european', label: '🇪🇺 European', db: europeanFoodDb, categories: EU_CATEGORIES, placeholder: 'Search European foods…' },
  { key: 'all', label: '🌍 Global', db: ALL_LOCAL_FOODS, categories: null, placeholder: 'Search all cuisines + USDA…' },
  { key: 'mexican', label: '🇲🇽 Mexican', db: null, categories: null, placeholder: 'Search Mexican foods…' },
];

const FoodSearch = React.memo(({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [cuisine, setCuisine] = useState('indian');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const searchTimerRef = useRef(null);

  const activeCuisine = useMemo(() => CUISINE_CONFIG.find(c => c.key === cuisine), [cuisine]);

  const getNutrientValue = useCallback((nutrients, name) => {
    const lowerName = name.toLowerCase();
    const n = nutrients?.find((nu) => nu.name.toLowerCase().includes(lowerName));
    return n ? n.value : 0;
  }, []);

  // Search effect — cross-cuisine: local DB search + API fallback
  useEffect(() => {
    if (activeCuisine?.db) {
      // Instant local search for local databases
      const r = searchLocalFoods(activeCuisine.db, query, categoryFilter, cuisine === 'all' ? 40 : 20);

      // For 'all' tab with a query, also search USDA API for extra results
      if (cuisine === 'all' && query.length >= 2) {
        setResults(r);
        setOpen(true);
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        setLoading(true);
        searchTimerRef.current = setTimeout(async () => {
          try {
            const data = await searchFood(query);
            const apiResults = data.foods || [];
            // Merge local + API, dedupe by name
            const localNames = new Set(r.map(f => f.name.toLowerCase()));
            const unique = apiResults.filter(f => !localNames.has(f.name.toLowerCase()));
            setResults([...r, ...unique]);
          } catch { /* keep local results */ }
          finally { setLoading(false); }
        }, 400);
      } else {
        setResults(r);
        setOpen(query.length > 0 || categoryFilter !== 'All' || document.activeElement === wrapperRef.current?.querySelector('input'));
      }
    } else if (query.length >= 2) {
      // Debounced API search for mexican / others
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      setLoading(true);
      searchTimerRef.current = setTimeout(async () => {
        try {
          let data;
          if (cuisine === 'mexican') data = await searchMexicanFood(query);
          else data = await searchFood(query);
          setResults(data.foods || []);
        } catch { setResults([]); }
        finally { setLoading(false); }
      }, 400);
    }
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [query, cuisine, categoryFilter, activeCuisine]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (food) => {
    onSelect(food);
    setQuery('');
    setOpen(false);
  };

  return (
    <div className="food-search" ref={wrapperRef}>
      {/* ── Cuisine tabs ── */}
      <div className="food-search__cuisine-tabs">
        {CUISINE_CONFIG.map((c) => (
          <button
            key={c.key}
            className={`food-search__cuisine-tab ${cuisine === c.key ? 'food-search__cuisine-tab--active' : ''}`}
            onClick={() => { setCuisine(c.key); setCategoryFilter('All'); setResults([]); }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* ── Search input ── */}
      <div className="food-search__input-wrap">
        <Search size={16} className="food-search__icon" />
        <input
          className="input food-search__input"
          placeholder={activeCuisine?.placeholder || 'Search foods…'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button className="food-search__clear" onClick={() => { setQuery(''); }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── Dropdown panel ── */}
      {open && (
        <div className="food-search__panel">
          {/* Category filter pills (local DBs only) */}
          {activeCuisine?.categories && (
            <div className="food-search__categories">
              {activeCuisine.categories.map((cat) => (
                <button
                  key={cat}
                  className={`food-search__cat-pill ${categoryFilter === cat ? 'food-search__cat-pill--active' : ''}`}
                  onMouseDown={(e) => { e.preventDefault(); setCategoryFilter(cat); }}
                >
                  {cat !== 'All' && CATEGORY_EMOJI[cat] && <span className="food-search__cat-emoji">{CATEGORY_EMOJI[cat]}</span>}
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Result list */}
          {loading && <div className="food-search__loading">Searching…</div>}
          {!loading && results.length > 0 ? (
            <ul className="food-search__results">
              {results.map((food, idx) => {
                const cal = getNutrientValue(food.nutrients, 'calor') || getNutrientValue(food.nutrients, 'energy');
                const protein = getNutrientValue(food.nutrients, 'protein');
                const carbs = getNutrientValue(food.nutrients, 'carb');
                const fats = getNutrientValue(food.nutrients, 'fat') || getNutrientValue(food.nutrients, 'lipid');
                return (
                  <li
                    key={food.id}
                    className="food-search__item"
                    style={{ animationDelay: `${idx * 25}ms` }}
                    onMouseDown={() => handleSelect(food)}
                  >
                    <div className="food-search__item-emoji">
                      {CATEGORY_EMOJI[food.category] || '🍽️'}
                    </div>
                    <div className="food-search__item-info">
                      <span className="food-search__item-name">{food.name}</span>
                      <div className="food-search__item-macros">
                        <span className="food-search__macro food-search__macro--cal">{cal} kcal</span>
                        <span className="food-search__macro food-search__macro--p">P:{protein}g</span>
                        <span className="food-search__macro food-search__macro--c">C:{carbs}g</span>
                        <span className="food-search__macro food-search__macro--f">F:{fats}g</span>
                      </div>
                    </div>
                    {food.region && (
                      <span className="food-search__item-region">{food.region}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            !loading && query.length > 0 && (
              <div className="food-search__empty">No foods found</div>
            )
          )}
        </div>
      )}
    </div>
  );
});
FoodSearch.displayName = 'FoodSearch';

const Nutrition = () => {
  const { user } = useAuthStore();
  const { todayLog, summary, setTodayLog, setSummary, setGoalProgress } = useNutritionStore();
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [unit, setUnit] = useState('g');
  const [mealType, setMealType] = useState('breakfast');
  const [expandedMeals, setExpandedMeals] = useState(['breakfast', 'lunch', 'dinner', 'snack']);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const data = await getNutritionToday();
        if (cancelled) return;
        setTodayLog(data.log);
        setSummary(data.summary);
        setGoalProgress(data.goalProgress);
      } catch (e) { if (!cancelled) console.error(e); }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [setSummary, setGoalProgress, setTodayLog]);

  const getNutrientValue = useCallback((nutrients, name) => {
    const lowerName = name.toLowerCase();
    const n = nutrients?.find((nu) => nu.name.toLowerCase().includes(lowerName));
    return n ? n.value : 0;
  }, []);

  const handleAddFood = async () => {
    if (!selectedFood) return;
    const grams = getGramsEquivalent(quantity, unit, selectedFood.name);
    const scale = grams / 100;
    const foodItem = {
      foodName: selectedFood.name,
      foodId: String(selectedFood.id),
      quantity,
      unit,
      quantityGrams: Math.round(grams),
      calories: Math.round((getNutrientValue(selectedFood.nutrients, 'calor') || getNutrientValue(selectedFood.nutrients, 'energy')) * scale),
      protein: Math.round(getNutrientValue(selectedFood.nutrients, 'protein') * scale),
      carbs: Math.round(getNutrientValue(selectedFood.nutrients, 'carb') * scale),
      fats: Math.round((getNutrientValue(selectedFood.nutrients, 'fat') || getNutrientValue(selectedFood.nutrients, 'lipid')) * scale),
      fiber: Math.round(getNutrientValue(selectedFood.nutrients, 'fiber') * scale),
      baseCaloriesPer100g: getNutrientValue(selectedFood.nutrients, 'calor') || getNutrientValue(selectedFood.nutrients, 'energy'),
      baseProteinPer100g: getNutrientValue(selectedFood.nutrients, 'protein'),
      baseCarbsPer100g: getNutrientValue(selectedFood.nutrients, 'carb'),
      baseFatsPer100g: getNutrientValue(selectedFood.nutrients, 'fat') || getNutrientValue(selectedFood.nutrients, 'lipid'),
      vitamins: { vitA: 0, vitC: 0, vitD: 0, vitE: 0, vitK: 0, vitB12: 0 },
      minerals: { calcium: 0, iron: 0, magnesium: 0, potassium: 0, zinc: 0 }
    };
    try {
      await logFood({ mealType, items: [foodItem] });
      const data = await getNutritionToday();
      setTodayLog(data.log);
      setSummary(data.summary);
      setGoalProgress(data.goalProgress);
      setSelectedFood(null);
      setQuantity(100);
      toast.success(`Added ${foodItem.foodName} to ${mealType}`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to log food');
    }
  };

  const handleDeleteItem = async (meal, idx) => {
    try {
      await deleteNutritionItem(meal, idx);
      const data = await getNutritionToday();
      setTodayLog(data.log);
      setSummary(data.summary);
      setGoalProgress(data.goalProgress);
      toast.success('Item removed');
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete item');
    }
  };

  const toggleMeal = (meal) => {
    setExpandedMeals((prev) => prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]);
  };

  const pieData = useMemo(() => [
    { name: 'Protein', value: (summary?.totalProtein || 0) * 4 },
    { name: 'Carbs', value: (summary?.totalCarbs || 0) * 4 },
    { name: 'Fats', value: (summary?.totalFats || 0) * 9 }
  ], [summary?.totalProtein, summary?.totalCarbs, summary?.totalFats]);
  const COLORS = useMemo(() => ['var(--neon-cyan)', 'var(--neon-green)', 'var(--neon-orange)'], []);

  return (
    <div className="nutrition page-enter">
      <h1 className="section-title">Nutrition <span>Tracker</span></h1>

      <div className="nutrition__macros">
        <div className="nutrition__macro-card">
          <div className="nutrition__macro-card__value" style={{ color: 'var(--neon-pink)' }}>{summary?.totalCalories || 0}</div>
          <div className="nutrition__macro-card__label">Calories</div>
          <div className="nutrition__macro-card__goal">/ {user?.dailyGoal?.calories || 2200}</div>
        </div>
        <div className="nutrition__macro-card">
          <div className="nutrition__macro-card__value" style={{ color: 'var(--neon-cyan)' }}>{summary?.totalProtein || 0}g</div>
          <div className="nutrition__macro-card__label">Protein</div>
          <div className="nutrition__macro-card__goal">/ {user?.dailyGoal?.protein || 160}g</div>
        </div>
        <div className="nutrition__macro-card">
          <div className="nutrition__macro-card__value" style={{ color: 'var(--neon-green)' }}>{summary?.totalCarbs || 0}g</div>
          <div className="nutrition__macro-card__label">Carbs</div>
          <div className="nutrition__macro-card__goal">/ {user?.dailyGoal?.carbs || 250}g</div>
        </div>
        <div className="nutrition__macro-card">
          <div className="nutrition__macro-card__value" style={{ color: 'var(--neon-orange)' }}>{summary?.totalFats || 0}g</div>
          <div className="nutrition__macro-card__label">Fats</div>
          <div className="nutrition__macro-card__goal">/ {user?.dailyGoal?.fats || 70}g</div>
        </div>
      </div>

      <div className="nutrition__chart-wrap card">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ── Food Search ── */}
      <div className="card nutrition__search">
        <h3 className="section-title" style={{ fontSize: '1rem' }}>Search <span>Foods</span></h3>
        <FoodSearch onSelect={setSelectedFood} />
      </div>

      {/* ── Selected food — quantity & add ── */}
      {selectedFood && (() => {
        const previewGrams = getGramsEquivalent(quantity, unit, selectedFood.name);
        const previewScale = previewGrams / 100;
        return (
        <div className="nutrition__quantity-card card">
          <div className="nutrition__quantity-header">
            <h4>{selectedFood.name}</h4>
            <button className="btn btn-ghost btn--sm" onClick={() => setSelectedFood(null)}>
              <X size={14} />
            </button>
          </div>
          <div className="nutrition__quantity-row">
            <div>
              <label className="label">Quantity</label>
              <input className="input" type="number" value={quantity} min="0" onChange={(e) => setQuantity(Number(e.target.value))} />
            </div>
            <div>
              <label className="label">Unit</label>
              <select className="input" value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="g">grams (g)</option>
                <option value="ml">ml</option>
                <option value="cup">cup (240g)</option>
                <option value="piece">piece</option>
                <option value="oz">oz (28g)</option>
                <option value="tbsp">tbsp (15g)</option>
                <option value="tsp">tsp (5g)</option>
                <option value="serving">serving</option>
              </select>
            </div>
            <div>
              <label className="label">Meal</label>
              <select className="input" value={mealType} onChange={(e) => setMealType(e.target.value)}>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>
          {unit !== 'g' && (
            <div className="nutrition__gram-equiv">
              <Scale size={14} /> ≈ {Math.round(previewGrams)}g
              {unit === 'piece' && <span className="nutrition__gram-hint">(1 {selectedFood.name.split(' ')[0]} ≈ {getPieceWeight(selectedFood.name)}g)</span>}
            </div>
          )}
          <div className="nutrition__preview">
            <div className="nutrition__preview-item">
              <Flame size={14} style={{ color: 'var(--neon-pink)' }} />
              <div className="nutrition__preview-value" style={{ color: 'var(--neon-pink)' }}>
                {Math.round((getNutrientValue(selectedFood.nutrients, 'calor') || getNutrientValue(selectedFood.nutrients, 'energy')) * previewScale)}
              </div>
              <div className="nutrition__preview-label">Calories</div>
            </div>
            <div className="nutrition__preview-item">
              <Beef size={14} style={{ color: 'var(--neon-cyan)' }} />
              <div className="nutrition__preview-value" style={{ color: 'var(--neon-cyan)' }}>
                {Math.round(getNutrientValue(selectedFood.nutrients, 'protein') * previewScale)}g
              </div>
              <div className="nutrition__preview-label">Protein</div>
            </div>
            <div className="nutrition__preview-item">
              <Wheat size={14} style={{ color: 'var(--neon-green)' }} />
              <div className="nutrition__preview-value" style={{ color: 'var(--neon-green)' }}>
                {Math.round(getNutrientValue(selectedFood.nutrients, 'carb') * previewScale)}g
              </div>
              <div className="nutrition__preview-label">Carbs</div>
            </div>
            <div className="nutrition__preview-item">
              <Droplets size={14} style={{ color: 'var(--neon-orange)' }} />
              <div className="nutrition__preview-value" style={{ color: 'var(--neon-orange)' }}>
                {Math.round((getNutrientValue(selectedFood.nutrients, 'fat') || getNutrientValue(selectedFood.nutrients, 'lipid')) * previewScale)}g
              </div>
              <div className="nutrition__preview-label">Fats</div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleAddFood}><Plus size={16} /> Add to {mealType}</button>
        </div>
        );
      })()}

      {/* ── Meals list ── */}
      <div className="card">
        <h3 className="section-title" style={{ fontSize: '1rem' }}>Today's <span>Meals</span></h3>
        {['breakfast', 'lunch', 'dinner', 'snack'].map((meal) => {
          const mealData = todayLog?.meals?.find((m) => m.mealType === meal);
          return (
            <div key={meal} className="nutrition__meal-card">
              <div className="nutrition__meal-header" onClick={() => toggleMeal(meal)}>
                <span className="nutrition__meal-title">{meal}</span>
                {expandedMeals.includes(meal) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {expandedMeals.includes(meal) && mealData && (
                <div className="nutrition__meal-items">
                  {mealData.items.map((item, idx) => (
                    <div key={idx} className="nutrition__meal-item">
                      <div>
                        <span className="nutrition__meal-item-name">{item.foodName}</span>
                        <span className="nutrition__meal-item-detail"> — {item.quantity}{item.unit}</span>
                      </div>
                      <div className="nutrition__meal-item-actions">
                        <span className="nutrition__meal-item-detail">{item.calories} kcal</span>
                        <button className="btn btn-danger btn--sm" onClick={() => handleDeleteItem(meal, idx)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {expandedMeals.includes(meal) && !mealData && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: 'var(--space-sm) 0' }}>No items yet</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Nutrition;
