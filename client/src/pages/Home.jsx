import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Apple, TrendingUp, Plus } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import useWorkoutStore from '../stores/workoutStore';
import useNutritionStore from '../stores/nutritionStore';
import { getNutritionToday, getMusclesLast7Days, getStats } from '../api/api';
import MacroRing from '../components/MacroRing.jsx';
import MuscleHeatMap from '../components/MuscleHeatMap.jsx';
import { HomeSkeleton } from '../components/Skeleton.jsx';
import cbumImg from '../images/cbum.png';
import logo from '../images/logo.png';
import '../styles/Home.css';

const Home = () => {
  const { user } = useAuthStore();
  const { setMuscleIntensity, muscleIntensity } = useWorkoutStore();
  const { summary, setSummary, setGoalProgress, setTodayLog } = useNutritionStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalWorkouts: 0, totalNutritionLogs: 0, lastWorkoutDate: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      try {
        const [nutData, muscData, statsData] = await Promise.all([
          getNutritionToday(),
          getMusclesLast7Days(),
          getStats()
        ]);
        if (cancelled) return;
        setTodayLog(nutData.log);
        setSummary(nutData.summary);
        setGoalProgress(nutData.goalProgress);
        setMuscleIntensity(muscData.muscleIntensity);
        setStats(statsData);
      } catch (e) { if (!cancelled) console.error(e); }
      finally { if (!cancelled) setLoading(false); }
    };
    fetchAll();
    return () => { cancelled = true; };
  }, [setMuscleIntensity, setSummary, setGoalProgress, setTodayLog]);

  if (loading) return <HomeSkeleton />;

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="home page-enter">
      <div className="home__header">
        <div className="home__brand">
          <img src={logo} alt="" className="home__logo" />
          <div className="home__brand-text">
            <span className="home__brand-title">Akhada</span>
            <span className="home__brand-accent">Analytics</span>
          </div>
        </div>
        <h1 className="home__greeting">{greeting}, <span>{user?.name}</span></h1>
        <p className="home__date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="home__stats grid-3">
        <div className="card home__stat-card">
          <Dumbbell size={20} color="var(--neon-cyan)" />
          <span className="home__stat-value">{stats.totalWorkouts}</span>
          <span className="home__stat-label">Workouts</span>
        </div>
        <div className="card home__stat-card">
          <Apple size={20} color="var(--neon-green)" />
          <span className="home__stat-value">{stats.totalNutritionLogs}</span>
          <span className="home__stat-label">Days Logged</span>
        </div>
        <div className="card home__stat-card">
          <TrendingUp size={20} color="var(--neon-pink)" />
          <span className="home__stat-value">{stats.lastWorkoutDate ? new Date(stats.lastWorkoutDate).toLocaleDateString() : '—'}</span>
          <span className="home__stat-label">Last Workout</span>
        </div>
      </div>

      <div className="card home__macro-section">
        <div className="home__macro-header">
          <h2 className="section-title">Today's <span>Nutrition</span></h2>
          <button className="btn btn-secondary btn--sm" onClick={() => navigate('/nutrition')}>
            <Plus size={16} /> Log Food
          </button>
        </div>
        <div className="home__rings">
          <MacroRing label="Calories" current={summary?.totalCalories || 0} goal={user?.dailyGoal?.calories || 2200} color="var(--neon-pink)" size={140} isMain={true} />
          <div className="home__rings-small">
            <MacroRing label="Protein" current={summary?.totalProtein || 0} goal={user?.dailyGoal?.protein || 160} color="var(--neon-cyan)" size={100} />
            <MacroRing label="Carbs" current={summary?.totalCarbs || 0} goal={user?.dailyGoal?.carbs || 250} color="var(--neon-green)" size={100} />
            <MacroRing label="Fats" current={summary?.totalFats || 0} goal={user?.dailyGoal?.fats || 70} color="var(--neon-orange)" size={100} />
          </div>
        </div>
      </div>

      <div className="card home__muscle-section">
        <div className="home__muscle-header">
          <h2 className="section-title">Muscles Trained <span>— Last 7 Days</span></h2>
          <button className="btn btn-secondary btn--sm" onClick={() => navigate('/workout')}>
            <Dumbbell size={16} /> Log Workout
          </button>
        </div>
        <div className="home__muscle-body">
          <img src={cbumImg} alt="" className="home__muscle-model" draggable={false} />
          <MuscleHeatMap data={muscleIntensity} />
        </div>
      </div>
    </div>
  );
};

export default Home;
