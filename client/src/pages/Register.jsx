import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, googleAuth } from '../api/api';
import useAuthStore from '../stores/authStore';
import { toast } from '../stores/toastStore';
import logo from '../images/logo.png';
import '../styles/Auth.css';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '1004581803165-4dq1ee0aeq27cgj7g3pml3ipjojmt6sd.apps.googleusercontent.com';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const googleBtnRef = useRef(null);

  /** Handle Google credential response */
  const handleGoogleResponse = useCallback(async (response) => {
    setGoogleLoading(true);
    setError('');
    try {
      const data = await googleAuth(response.credential);
      setToken(data.token);
      setUser(data.user);

      if (data.user.onboardingStatus === 'INCOMPLETE') {
        toast.success('Account created! Let\'s set up your profile.');
        navigate('/onboarding');
      } else {
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Google sign-up failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  }, [navigate, setToken, setUser]);

  /** Load Google Identity Services script */
  useEffect(() => {
    const initGoogle = () => {
      if (!window.google?.accounts) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
      });
      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          width: '100%',
          text: 'signup_with',
          shape: 'pill',
          logo_alignment: 'center',
        });
      }
    };

    if (window.google?.accounts) { initGoogle(); return; }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.head.appendChild(script);
  }, [handleGoogleResponse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register({
        name, email, password, gender,
        age: Number(age), weight: Number(weight), height: Number(height), activityLevel
      });
      setToken(data.token);
      setUser(data.user);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow--1" />
      <div className="auth-glow auth-glow--2" />
      <div className="auth-card">
        <div className="auth-logo">
          <img src={logo} alt="" className="auth-logo__img" />
          <div className="auth-logo__text-wrap">
            <span className="auth-logo__title">Akhada</span>
            <span className="auth-logo__subtitle">Analytics</span>
          </div>
        </div>
        <p className="auth-subtitle">Start your transformation.</p>

        {/* Google Sign-Up button */}
        <div className="auth-google-wrap">
          <div ref={googleBtnRef} className="auth-google-btn" />
          {googleLoading && <div className="auth-google-loading">Signing up with Google...</div>}
        </div>

        <div className="auth-divider">
          <span>or register with email</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form__group">
            <label className="label">Name</label>
            <input className="input" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="auth-form__group">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="auth-form__group">
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="auth-form__row">
            <div className="auth-form__group">
              <label className="label">Gender</label>
              <select className="input" value={gender} onChange={e => setGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="auth-form__group">
              <label className="label">Age</label>
              <input className="input" type="number" placeholder="25" value={age} onChange={e => setAge(e.target.value)} required />
            </div>
          </div>
          <div className="auth-form__row">
            <div className="auth-form__group">
              <label className="label">Weight (kg)</label>
              <input className="input" type="number" placeholder="70" value={weight} onChange={e => setWeight(e.target.value)} required />
            </div>
            <div className="auth-form__group">
              <label className="label">Height (cm)</label>
              <input className="input" type="number" placeholder="175" value={height} onChange={e => setHeight(e.target.value)} required />
            </div>
          </div>
          <div className="auth-form__group">
            <label className="label">Activity Level</label>
            <select className="input" value={activityLevel} onChange={e => setActivityLevel(e.target.value)}>
              <option value="sedentary">Sedentary</option>
              <option value="light">Lightly Active</option>
              <option value="moderate">Moderately Active</option>
              <option value="active">Very Active</option>
              <option value="veryActive">Extremely Active</option>
            </select>
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
