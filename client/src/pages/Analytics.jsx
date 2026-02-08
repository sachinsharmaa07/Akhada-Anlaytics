import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from 'recharts';
import { getNutritionHistory, getWorkouts } from '../api/api';
import useAuthStore from '../stores/authStore';
import { Activity, Flame, Target, TrendingUp, Scale, Ruler, Zap, Dumbbell } from 'lucide-react';
import '../styles/Analytics.css';

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

/* ── Activity multipliers for TDEE ── */
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

const Analytics = () => {
  const { user } = useAuthStore();
  const [nutritionHistory, setNutritionHistory] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [timePeriod, setTimePeriod] = useState(7);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const [nutData, workoutData] = await Promise.all([
          getNutritionHistory(timePeriod),
          getWorkouts(1, 30)
        ]);
        if (cancelled) return;
        setNutritionHistory(nutData.history);
        setWorkouts(workoutData.workouts);
      } catch (e) { console.error(e); }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [timePeriod]);

  /* ── Profile-based calculations ── */
  const weight = user?.weight || 0;
  const height = user?.height || 0;
  const age = user?.age || 25;
  const gender = user?.gender || 'male';
  const activityLevel = user?.activityLevel || 'moderate';

  const bmi = useMemo(() => {
    if (!weight || !height) return null;
    return (weight / ((height / 100) ** 2)).toFixed(1);
  }, [weight, height]);

  const bmiCategory = useMemo(() => {
    if (!bmi) return '';
    const val = parseFloat(bmi);
    if (val < 18.5) return 'Underweight';
    if (val < 25) return 'Normal';
    if (val < 30) return 'Overweight';
    return 'Obese';
  }, [bmi]);

  const bmr = useMemo(() => {
    if (!weight || !height || !age) return null;
    // Mifflin-St Jeor
    if (gender === 'female') return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  }, [weight, height, age, gender]);

  const tdee = useMemo(() => {
    if (!bmr) return null;
    return Math.round(bmr * (ACTIVITY_MULTIPLIERS[activityLevel] || 1.55));
  }, [bmr, activityLevel]);

  const proteinTarget = useMemo(() => weight ? Math.round(weight * 2) : null, [weight]);

  /* ── Workout stats ── */
  const workoutStats = useMemo(() => {
    const periodWorkouts = workouts.filter(w => {
      const d = new Date(w.date);
      return d >= new Date(Date.now() - timePeriod * 24 * 60 * 60 * 1000);
    });
    const totalSessions = periodWorkouts.length;
    const totalVolume = periodWorkouts.reduce((t, w) => t + (w.totalVolume || 0), 0);
    const avgVolume = totalSessions > 0 ? Math.round(totalVolume / totalSessions) : 0;
    const totalDuration = periodWorkouts.reduce((t, w) => t + (w.duration || 0), 0);
    return { totalSessions, totalVolume, avgVolume, totalDuration };
  }, [workouts, timePeriod]);

  /* ── Average daily intake ── */
  const avgIntake = useMemo(() => {
    if (!nutritionHistory.length) return { calories: 0, protein: 0, carbs: 0, fats: 0 };
    const n = nutritionHistory.length;
    return {
      calories: Math.round(nutritionHistory.reduce((t, h) => t + h.totalCalories, 0) / n),
      protein: Math.round(nutritionHistory.reduce((t, h) => t + h.totalProtein, 0) / n),
      carbs: Math.round(nutritionHistory.reduce((t, h) => t + h.totalCarbs, 0) / n),
      fats: Math.round(nutritionHistory.reduce((t, h) => t + h.totalFats, 0) / n),
    };
  }, [nutritionHistory]);

  const calorieData = useMemo(() =>
    nutritionHistory.map(h => ({ date: fmtDate(h.date), Calories: h.totalCalories })),
    [nutritionHistory]
  );

  const macroData = useMemo(() =>
    nutritionHistory.map(h => ({ date: fmtDate(h.date), Protein: h.totalProtein, Carbs: h.totalCarbs, Fats: h.totalFats })),
    [nutritionHistory]
  );

  const volumeData = useMemo(() =>
    [...workouts]
      .filter(w => new Date(w.date) >= new Date(Date.now() - timePeriod * 24 * 60 * 60 * 1000))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(w => ({ date: fmtDate(w.date), Volume: w.totalVolume })),
    [workouts, timePeriod]
  );

  const goalCalories = user?.dailyGoal?.calories || 2200;
  const goalData = useMemo(() =>
    nutritionHistory.map(h => ({ date: fmtDate(h.date), Eaten: h.totalCalories, Goal: goalCalories })),
    [nutritionHistory, goalCalories]
  );

  return (
    <div className="analytics page-enter">
      <h1 className="section-title">Analytics <span>& Progress</span></h1>

      <div className="analytics__time-btns">
        {[7, 14, 30].map(d => (
          <button key={d} className={`analytics__time-btn ${timePeriod === d ? 'analytics__time-btn--active' : ''}`}
            onClick={() => setTimePeriod(d)}>{d} Days</button>
        ))}
      </div>

      {/* ── Body Stats Cards ── */}
      <div className="analytics__stats-grid">
        {bmi && (
          <div className="analytics__stat-card">
            <div className="analytics__stat-icon" style={{ color: 'var(--neon-cyan)' }}><Scale size={20} /></div>
            <div className="analytics__stat-value" style={{ color: 'var(--neon-cyan)' }}>{bmi}</div>
            <div className="analytics__stat-label">BMI</div>
            <div className={`analytics__stat-badge analytics__stat-badge--${bmiCategory.toLowerCase()}`}>{bmiCategory}</div>
          </div>
        )}
        {tdee && (
          <div className="analytics__stat-card">
            <div className="analytics__stat-icon" style={{ color: 'var(--neon-orange)' }}><Flame size={20} /></div>
            <div className="analytics__stat-value" style={{ color: 'var(--neon-orange)' }}>{tdee}</div>
            <div className="analytics__stat-label">TDEE (kcal/day)</div>
            <div className="analytics__stat-sub">BMR: {bmr}</div>
          </div>
        )}
        {proteinTarget && (
          <div className="analytics__stat-card">
            <div className="analytics__stat-icon" style={{ color: 'var(--neon-green)' }}><Target size={20} /></div>
            <div className="analytics__stat-value" style={{ color: 'var(--neon-green)' }}>{proteinTarget}g</div>
            <div className="analytics__stat-label">Protein Target</div>
            <div className="analytics__stat-sub">2g per kg body weight</div>
          </div>
        )}
        {weight > 0 && (
          <div className="analytics__stat-card">
            <div className="analytics__stat-icon" style={{ color: 'var(--neon-pink)' }}><Ruler size={20} /></div>
            <div className="analytics__stat-value" style={{ color: 'var(--neon-pink)' }}>{weight}kg</div>
            <div className="analytics__stat-label">Body Weight</div>
            <div className="analytics__stat-sub">{height}cm</div>
          </div>
        )}
      </div>

      {/* ── Period Summary Cards ── */}
      <div className="analytics__summary-grid">
        <div className="analytics__summary-card">
          <Flame size={18} style={{ color: 'var(--neon-pink)' }} />
          <div className="analytics__summary-value">{avgIntake.calories}</div>
          <div className="analytics__summary-label">Avg Daily Cal</div>
        </div>
        <div className="analytics__summary-card">
          <Activity size={18} style={{ color: 'var(--neon-cyan)' }} />
          <div className="analytics__summary-value">{avgIntake.protein}g</div>
          <div className="analytics__summary-label">Avg Daily Protein</div>
        </div>
        <div className="analytics__summary-card">
          <Dumbbell size={18} style={{ color: 'var(--neon-green)' }} />
          <div className="analytics__summary-value">{workoutStats.totalSessions}</div>
          <div className="analytics__summary-label">Workouts</div>
        </div>
        <div className="analytics__summary-card">
          <TrendingUp size={18} style={{ color: 'var(--neon-orange)' }} />
          <div className="analytics__summary-value">{Math.round(workoutStats.totalVolume / 1000)}k</div>
          <div className="analytics__summary-label">Total Volume (kg)</div>
        </div>
      </div>

      <div className="card analytics__chart-card">
        <h3 className="analytics__chart-title">Calorie Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={calorieData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '10px', color: 'var(--text-primary)' }} />
            {tdee && <ReferenceLine y={tdee} stroke="var(--neon-orange)" strokeDasharray="6 3" label={{ value: `TDEE ${tdee}`, fill: 'var(--neon-orange)', fontSize: 10, position: 'insideTopRight' }} />}
            {goalCalories && <ReferenceLine y={goalCalories} stroke="var(--neon-green)" strokeDasharray="6 3" label={{ value: `Goal ${goalCalories}`, fill: 'var(--neon-green)', fontSize: 10, position: 'insideBottomRight' }} />}
            <Area type="monotone" dataKey="Calories" stroke="var(--neon-pink)" fill="rgba(255,45,149,0.12)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card analytics__chart-card">
        <h3 className="analytics__chart-title">Macro Breakdown</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={macroData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '10px', color: 'var(--text-primary)' }} />
            <Legend wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '12px' }} />
            <Bar dataKey="Protein" stackId="a" fill="var(--neon-cyan)" />
            <Bar dataKey="Carbs" stackId="a" fill="var(--neon-green)" />
            <Bar dataKey="Fats" stackId="a" fill="var(--neon-orange)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card analytics__chart-card">
        <h3 className="analytics__chart-title">Workout Volume</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '10px', color: 'var(--text-primary)' }} />
            <Line type="monotone" dataKey="Volume" stroke="var(--neon-cyan)" strokeWidth={3} dot={{ fill: 'var(--neon-cyan)', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card analytics__chart-card">
        <h3 className="analytics__chart-title">Goal vs Eaten</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={goalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '10px', color: 'var(--text-primary)' }} />
            <Legend wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '12px' }} />
            <Bar dataKey="Goal" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Eaten" fill="var(--neon-green)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── No Profile Data Prompt ── */}
      {(!weight || !height) && (
        <div className="analytics__profile-prompt card">
          <Zap size={20} style={{ color: 'var(--neon-orange)' }} />
          <p>Add your <strong>height</strong> and <strong>weight</strong> in <a href="/profile" style={{ color: 'var(--neon-cyan)' }}>Profile</a> to unlock BMI, TDEE & protein targets.</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;
