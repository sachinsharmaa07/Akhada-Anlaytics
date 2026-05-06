import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSecurityQuestion, resetPassword } from '../api/api';
import { toast } from '../stores/toastStore';
import logo from '../images/logo.png';
import '../styles/Auth.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetQuestion = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await getSecurityQuestion(email);
      setQuestion(data.securityQuestion || 'What is your pet name?');
      setStep('reset');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to fetch security question';
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
      await resetPassword({ email, answer, newPassword });
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

  const showReset = step === 'reset';

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

        <form onSubmit={showReset ? handleReset : handleGetQuestion} className="auth-form">
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
                <label className="label">Security Question</label>
                <div className="auth-question">{question || 'What is your pet name?'}</div>
              </div>
              <div className="auth-form__group">
                <label className="label">Answer</label>
                <input
                  className="input"
                  type="text"
                  placeholder="kutta (default)"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                />
                <span className="auth-hint">Default answer is kutta.</span>
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
            {loading ? (showReset ? 'Updating...' : 'Checking...') : (showReset ? 'Reset Password' : 'Next')}
          </button>
        </form>

        <p className="auth-link">
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
