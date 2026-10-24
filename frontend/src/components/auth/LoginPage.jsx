import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import {
  Sparkles,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { login, signup, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect to todos
  if (user) {
    const from = location.state?.from?.pathname || '/todos';
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      if (isSignUp) {
        await signup(email, password);
        setSuccessMsg('Account created successfully! Redirecting...');
      } else {
        await login(email, password);
      }
      const destination = location.state?.from?.pathname || '/todos';
      navigate(destination, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Authentication failed. Please try again.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setSubmitting(false);
    }
  }

  function toggleMode() {
    setIsSignUp((prev) => !prev);
    setError('');
    setSuccessMsg('');
  }

  return (
    <div className="auth-page-container">
      <div className="auth-card glass-card">
        {/* Header */}
        <div className="auth-card-header">
          <div className="auth-brand-badge">
            <Sparkles size={22} className="brand-glow-icon" />
          </div>
          <h1 className="auth-title">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="auth-subtitle">
            {isSignUp
              ? 'Join JivitNhom to start organizing your tasks.'
              : 'Sign in to access your synchronized todos and workspace.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            className={`auth-tab-btn ${!isSignUp ? 'active' : ''}`}
            onClick={() => !submitting && setIsSignUp(false)}
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${isSignUp ? 'active' : ''}`}
            onClick={() => !submitting && setIsSignUp(true)}
          >
            <UserPlus size={15} />
            <span>Create Account</span>
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="auth-alert auth-alert-error" role="alert">
            <AlertCircle size={17} className="alert-icon" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-alert auth-alert-success" role="status">
            <CheckCircle2 size={17} className="alert-icon" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-field" htmlFor="auth-email">
            <span className="auth-label-text">Email Address</span>
            <div className="auth-input-wrapper">
              <Mail size={17} className="auth-input-icon" />
              <input
                id="auth-email"
                type="email"
                className="auth-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label className="auth-field" htmlFor="auth-password">
            <span className="auth-label-text">Password</span>
            <div className="auth-input-wrapper">
              <Lock size={17} className="auth-input-icon" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {isSignUp && (
              <span className="auth-input-hint">Minimum 8 characters</span>
            )}
          </label>

          {isSignUp && (
            <label className="auth-field" htmlFor="auth-confirm-password">
              <span className="auth-label-text">Confirm Password</span>
              <div className="auth-input-wrapper">
                <Lock size={17} className="auth-input-icon" />
                <input
                  id="auth-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </label>
          )}

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={submitting}
          >
            {submitting ? (
              <span className="auth-loading-text">
                <span className="inline-spinner" />
                {isSignUp ? 'Creating account...' : 'Signing in...'}
              </span>
            ) : isSignUp ? (
              <>
                <UserPlus size={17} />
                <span>Create Account</span>
              </>
            ) : (
              <>
                <LogIn size={17} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer-prompt">
          <p>
            {isSignUp
              ? 'Already have an account?'
              : "Don't have an account yet?"}{' '}
            <button
              type="button"
              className="auth-switch-link"
              onClick={toggleMode}
            >
              {isSignUp ? 'Sign in instead' : 'Sign up now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
