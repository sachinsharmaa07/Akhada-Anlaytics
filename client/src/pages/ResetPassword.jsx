import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordReset, resetPasswordOtp } from '../api/api';
import { toast } from '../stores/toastStore';
import logo from '../images/logo.png';
import '../styles/Auth.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await requestPasswordReset(email);
      toast.success('Reset code sent to your email.');
      setStep('otp');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to send reset code';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPasswordOtp({ email, otp, newPassword });
      toast.success('Password updated. Please login again.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Password reset failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResending(true);
    try {
      await requestPasswordReset(email);
      toast.success('Reset code sent to your email.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to send reset code';
      setError(msg);
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  const showReset = step === 'otp';

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
        <p className="auth-subtitle">Reset your password.</p>

        <form onSubmit={showReset ? handleReset : handleRequestCode} className="auth-form">
          <div className="auth-form__group">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={showReset}
              required
            />
          </div>

          {showReset && (
            <>
              <div className="auth-form__group">
                <label className="label">Reset Code</label>
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
              <div className="auth-form__group">
                <label className="label">New Password</label>
                <input
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {error && <p className="auth-error">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? (showReset ? 'Updating...' : 'Sending...') : (showReset ? 'Reset Password' : 'Send Code')}
          </button>
          {showReset && (
            <button
              className="btn btn-ghost btn--sm"
              type="button"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          )}
        </form>

        <p className="auth-link">
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
