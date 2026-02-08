import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { completeOnboarding, checkUsername } from '../api/api';
import useAuthStore from '../stores/authStore';
import { toast } from '../stores/toastStore';
import { User, Dumbbell, Target, ChevronRight, ChevronLeft, Check, Loader2 } from 'lucide-react';
import '../styles/Onboarding.css';

const STEPS = [
  { id: 'username', title: 'Choose your handle', icon: User, desc: 'Pick a unique username for your profile.' },
  { id: 'body', title: 'Body stats', icon: Dumbbell, desc: 'Help us personalise your experience.' },
  { id: 'goals', title: 'Your goals', icon: Target, desc: 'Set daily nutrition targets.' },
];

const Onboarding = () => {
  const { user, setUser, setToken, token } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 — Username
  const [username, setUsername] = useState('');
  const [usernameAvail, setUsernameAvail] = useState(null); // null | true | false
  const [checkingUsername, setCheckingUsername] = useState(false);
  const debounceRef = useRef(null);

  // Step 2 — Body
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');

  // Step 3 — Goals
  const [calories, setCalories] = useState('2200');
  const [protein, setProtein] = useState('160');
  const [carbs, setCarbs] = useState('250');
  const [fats, setFats] = useState('70');

  // Redirect if already onboarded
  useEffect(() => {
    if (user?.onboardingStatus === 'COMPLETE') {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  // Username availability check (debounced)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!username || username.length < 3) { setUsernameAvail(null); return; }

    setCheckingUsername(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await checkUsername(username);
        setUsernameAvail(data.available);
      } catch { setUsernameAvail(null); }
      finally { setCheckingUsername(false); }
    }, 500);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [username]);

  const canGoNext = () => {
    if (step === 0) return username.length >= 3 && usernameAvail === true;
    if (step === 1) return age && weight && height;
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(prev => prev - 1);
  };

  const handleFinish = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await completeOnboarding({
        username,
        gender,
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
        activityLevel,
        dailyGoal: {
          calories: Number(calories),
          protein: Number(protein),
          carbs: Number(carbs),
          fats: Number(fats),
        },
      });
      setToken(data.token);
      setUser(data.user);
      toast.success('Profile set up! Let\'s go 💪');
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save profile';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const currentStep = STEPS[step];
  const Icon = currentStep.icon;

  return (
    <div className="onboarding-page">
      <div className="auth-glow auth-glow--1" />
      <div className="auth-glow auth-glow--2" />

      <div className="onboarding-card">
        {/* Progress bar */}
        <div className="onboarding-progress">
          {STEPS.map((s, i) => (
            <div key={s.id} className={`onboarding-progress__step${i <= step ? ' onboarding-progress__step--active' : ''}`}>
              <div className="onboarding-progress__dot">{i < step ? <Check size={12} /> : i + 1}</div>
              <span className="onboarding-progress__text">{s.title}</span>
            </div>
          ))}
          <div className="onboarding-progress__bar">
            <div className="onboarding-progress__fill" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
          </div>
        </div>

        {/* Header */}
        <div className="onboarding-header">
          <div className="onboarding-header__icon"><Icon size={24} /></div>
          <h2 className="onboarding-header__title">{currentStep.title}</h2>
          <p className="onboarding-header__desc">{currentStep.desc}</p>
        </div>

        {/* Hey user greeting */}
        {step === 0 && user?.name && (
          <p className="onboarding-greeting">Hey <strong>{user.name}</strong>! {user.avatar && <img src={user.avatar} alt="" className="onboarding-avatar" />}</p>
        )}

        {/* Step content */}
        <div className="onboarding-body">
          {/* STEP 0 — Username */}
          {step === 0 && (
            <div className="onboarding-fields">
              <div className="auth-form__group">
                <label className="label">Username</label>
                <div className="onboarding-username-wrap">
                  <span className="onboarding-username-at">@</span>
                  <input
                    className="input onboarding-username-input"
                    type="text"
                    placeholder="yourname"
                    value={username}
                    onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 30))}
                    autoFocus
                  />
                  {checkingUsername && <Loader2 size={16} className="onboarding-username-spinner" />}
                  {!checkingUsername && usernameAvail === true && <Check size={16} className="onboarding-username-ok" />}
                  {!checkingUsername && usernameAvail === false && <span className="onboarding-username-taken">taken</span>}
                </div>
                {username.length > 0 && username.length < 3 && (
                  <span className="onboarding-hint">Min 3 characters</span>
                )}
              </div>
            </div>
          )}

          {/* STEP 1 — Body stats */}
          {step === 1 && (
            <div className="onboarding-fields">
              <div className="onboarding-row">
                <div className="auth-form__group">
                  <label className="label">Gender</label>
                  <div className="onboarding-gender-pills">
                    {['male', 'female', 'other'].map(g => (
                      <button key={g} type="button"
                        className={`onboarding-pill${gender === g ? ' onboarding-pill--active' : ''}`}
                        onClick={() => setGender(g)}
                      >{g.charAt(0).toUpperCase() + g.slice(1)}</button>
                    ))}
                  </div>
                </div>
                <div className="auth-form__group">
                  <label className="label">Age</label>
                  <input className="input" type="number" placeholder="25" value={age} onChange={e => setAge(e.target.value)} />
                </div>
              </div>
              <div className="onboarding-row">
                <div className="auth-form__group">
                  <label className="label">Weight (kg)</label>
                  <input className="input" type="number" placeholder="70" value={weight} onChange={e => setWeight(e.target.value)} />
                </div>
                <div className="auth-form__group">
                  <label className="label">Height (cm)</label>
                  <input className="input" type="number" placeholder="175" value={height} onChange={e => setHeight(e.target.value)} />
                </div>
              </div>
              <div className="auth-form__group">
                <label className="label">Activity Level</label>
                <select className="input" value={activityLevel} onChange={e => setActivityLevel(e.target.value)}>
                  <option value="sedentary">Sedentary — desk job</option>
                  <option value="light">Lightly Active — 1-2 days/week</option>
                  <option value="moderate">Moderately Active — 3-5 days/week</option>
                  <option value="active">Very Active — 6-7 days/week</option>
                  <option value="veryActive">Athlete — 2× daily</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2 — Goals */}
          {step === 2 && (
            <div className="onboarding-fields">
              <div className="onboarding-row">
                <div className="auth-form__group">
                  <label className="label">Calories (kcal)</label>
                  <input className="input" type="number" placeholder="2200" value={calories} onChange={e => setCalories(e.target.value)} />
                </div>
                <div className="auth-form__group">
                  <label className="label">Protein (g)</label>
                  <input className="input" type="number" placeholder="160" value={protein} onChange={e => setProtein(e.target.value)} />
                </div>
              </div>
              <div className="onboarding-row">
                <div className="auth-form__group">
                  <label className="label">Carbs (g)</label>
                  <input className="input" type="number" placeholder="250" value={carbs} onChange={e => setCarbs(e.target.value)} />
                </div>
                <div className="auth-form__group">
                  <label className="label">Fats (g)</label>
                  <input className="input" type="number" placeholder="70" value={fats} onChange={e => setFats(e.target.value)} />
                </div>
              </div>
            </div>
          )}
        </div>

        {error && <p className="auth-error">{error}</p>}

        {/* Footer nav */}
        <div className="onboarding-footer">
          {step > 0 && (
            <button className="btn btn-secondary" onClick={handleBack} type="button">
              <ChevronLeft size={16} /> Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={handleNext} disabled={!canGoNext()}>
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleFinish} disabled={loading || !canGoNext()}>
              {loading ? 'Saving...' : 'Finish Setup'} {!loading && <Check size={16} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
