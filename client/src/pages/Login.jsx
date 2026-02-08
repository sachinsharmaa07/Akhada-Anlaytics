import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, googleAuth } from '../api/api';
import useAuthStore from '../stores/authStore';
import { toast } from '../stores/toastStore';
import logo from '../images/logo.png';
import '../styles/Auth.css';

const GOOGLE_CLIENT_ID = '1004581803165-4dq1ee0aeq27cgj7g3pml3ipjojmt6sd.apps.googleusercontent.com';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        toast.success('Welcome! Let\'s set up your profile.');
        navigate('/onboarding');
      } else {
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Google sign-in failed';
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
          text: 'signin_with',
          shape: 'pill',
          logo_alignment: 'center',
        });
      }
    };

    // If script already loaded
    if (window.google?.accounts) {
      initGoogle();
      return;
    }

    // Load GSI script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.head.appendChild(script);

    return () => {
      // Cleanup not strictly needed, but good practice
    };
  }, [handleGoogleResponse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login({ email, password });
      setToken(data.token);
      setUser(data.user);

      if (data.user.onboardingStatus === 'INCOMPLETE') {
        navigate('/onboarding');
      } else {
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
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
        <p className="auth-subtitle">Welcome back. Push harder.</p>

        {/* Google Sign-In button */}
        <div className="auth-google-wrap">
          <div ref={googleBtnRef} className="auth-google-btn" />
          {googleLoading && <div className="auth-google-loading">Signing in with Google...</div>}
        </div>

        <div className="auth-divider">
          <span>or continue with email</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form__group">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@email.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="auth-form__group">
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-link">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
