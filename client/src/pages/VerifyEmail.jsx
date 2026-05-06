import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { sendVerificationOtp, verifyEmailOtp } from '../api/api';
import useAuthStore from '../stores/authStore';
import { toast } from '../stores/toastStore';
import logo from '../images/logo.png';
import '../styles/Auth.css';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setToken } = useAuthStore();

  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    setError('');
    setResending(true);
    try {
      await sendVerificationOtp(email);
      toast.success('Verification code sent.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to send code';
      setError(msg);
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await verifyEmailOtp({ email, otp });
      setToken(data.token);
      setUser(data.user);
      toast.success('Email verified successfully.');

      if (data.user.onboardingStatus === 'INCOMPLETE') {
        navigate('/onboarding');
      } else {
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed';
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
        <p className="auth-subtitle">Verify your email to continue.</p>

        <form onSubmit={handleVerify} className="auth-form">
          <div className="auth-form__group">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-form__group">
            <label className="label">Verification Code</label>
            <input
              className="input"
              type="text"
              inputMode="numeric"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
          <button
            className="btn btn-ghost btn--sm"
            type="button"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? 'Sending...' : 'Resend Code'}
          </button>
        </form>

        <p className="auth-link">
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
