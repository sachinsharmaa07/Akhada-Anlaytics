import React, { useEffect, useState, useCallback } from 'react';
import { LogOut, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { updateProfile, updateGoals, logout } from '../api/api';
import { toast } from '../stores/toastStore';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser, logout: logoutStore } = useAuthStore();

  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');

  const [goalCalories, setGoalCalories] = useState(2200);
  const [goalProtein, setGoalProtein] = useState(160);
  const [goalCarbs, setGoalCarbs] = useState(250);
  const [goalFats, setGoalFats] = useState(70);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name || '');
    setGender(user.gender || 'male');
    setAge(user.age ?? '');
    setWeight(user.weight ?? '');
    setHeight(user.height ?? '');
    setActivityLevel(user.activityLevel || 'moderate');

    setGoalCalories(user.dailyGoal?.calories || 2200);
    setGoalProtein(user.dailyGoal?.protein || 160);
    setGoalCarbs(user.dailyGoal?.carbs || 250);
    setGoalFats(user.dailyGoal?.fats || 70);
  }, [user]);

  const handleSaveProfile = useCallback(async () => {
    setSaving(true);
    try {
      const updated = await updateProfile({
        name,
        gender,
        age: age === '' ? undefined : Number(age),
        weight: weight === '' ? undefined : Number(weight),
        height: height === '' ? undefined : Number(height),
        activityLevel,
      });
      setUser({ ...updated, id: updated._id || updated.id });
      toast.success('Profile updated');
    } catch (e) {
      console.error(e);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  }, [name, gender, age, weight, height, activityLevel, setUser]);

  const handleSaveGoals = useCallback(async () => {
    setSaving(true);
    try {
      const updated = await updateGoals({
        calories: goalCalories,
        protein: goalProtein,
        carbs: goalCarbs,
        fats: goalFats,
      });
      setUser({
        ...user,
        dailyGoal: updated.dailyGoal,
      });
      toast.success('Goals updated');
    } catch (e) {
      console.error(e);
      toast.error('Failed to save goals');
    } finally {
      setSaving(false);
    }
  }, [goalCalories, goalProtein, goalCarbs, goalFats, user, setUser]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (e) {}
    logoutStore();
    navigate('/login');
  }, [logoutStore, navigate]);

  return (
    <div className="profile page-enter">
      <h1 className="section-title">
        Your <span>Profile</span>
      </h1>

      <div className="profile__layout">
        <div className="card profile__card">
          <div className="profile__avatar">
            <span className="profile__avatar-initials">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <p className="profile__email">{user?.email}</p>

          <div className="profile__form">
            <div className="profile__form-row">
              <div>
                <label className="label">Name</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="label">Gender</label>
                <select className="input" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="profile__form-row">
              <div>
                <label className="label">Age</label>
                <input
                  className="input"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label">Weight (kg)</label>
                <input
                  className="input"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label">Height (cm)</label>
                <input
                  className="input"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className="label">Activity Level</label>
              <select className="input" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                <option value="sedentary">Sedentary</option>
                <option value="light">Lightly Active</option>
                <option value="moderate">Moderately Active</option>
                <option value="active">Very Active</option>
                <option value="veryActive">Extremely Active</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>

        <div className="card profile__card">
          <h2 className="section-title" style={{ fontSize: '1.1rem' }}>
            Daily <span>Goals</span>
          </h2>
          <div className="profile__goals">
            <div className="profile__goal-item" style={{ '--goal-color': 'var(--neon-pink)' }}>
              <label className="label">Calories (kcal)</label>
              <input
                className="input"
                type="number"
                value={goalCalories}
                onChange={(e) => setGoalCalories(Number(e.target.value))}
              />
            </div>
            <div className="profile__goal-item" style={{ '--goal-color': 'var(--neon-cyan)' }}>
              <label className="label">Protein (g)</label>
              <input
                className="input"
                type="number"
                value={goalProtein}
                onChange={(e) => setGoalProtein(Number(e.target.value))}
              />
            </div>
            <div className="profile__goal-item" style={{ '--goal-color': 'var(--neon-green)' }}>
              <label className="label">Carbs (g)</label>
              <input
                className="input"
                type="number"
                value={goalCarbs}
                onChange={(e) => setGoalCarbs(Number(e.target.value))}
              />
            </div>
            <div className="profile__goal-item" style={{ '--goal-color': 'var(--neon-orange)' }}>
              <label className="label">Fats (g)</label>
              <input
                className="input"
                type="number"
                value={goalFats}
                onChange={(e) => setGoalFats(Number(e.target.value))}
              />
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleSaveGoals} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Goals'}
          </button>
        </div>
      </div>

      <button
        className="btn btn-danger"
        style={{ width: '100%', marginTop: 'var(--space-lg)' }}
        onClick={handleLogout}
      >
        <LogOut size={18} /> Sign Out
      </button>
    </div>
  );
};

export default Profile;
