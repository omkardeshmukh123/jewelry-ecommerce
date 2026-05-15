import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff } from 'lucide-react';
import './Auth.css';

export default function Auth() {
  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [tab, setTab]         = useState('login');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm,   setRegForm]   = useState({ name: '', email: '', password: '', confirm: '' });

  const redirect = () => navigate(from, { replace: true });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(loginForm.email, loginForm.password);
    setLoading(false);
    if (res.success) redirect();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regForm.password !== regForm.confirm) { return; }
    setLoading(true);
    const res = await register(regForm.name, regForm.email, regForm.password);
    setLoading(false);
    if (res.success) redirect();
  };

  const handleGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await googleLogin(tokenResponse.access_token);
      if (res.success) redirect();
    },
    onError: () => {},
  });

  return (
    <div className="auth-page">
      {/* Left decorative panel */}
      <div className="auth-left">
        <div className="auth-left__overlay" />
        <div className="auth-left__content">
          <Link to="/" className="auth-logo">DRISORA</Link>
          <div className="auth-divider" />
          <h2 className="auth-tagline">Where Elegance<br />Meets Eternity</h2>
          <p className="auth-quote">"Adorn yourself with stories worth telling"</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-right">
        {/* Tabs */}
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>
            Sign In
          </button>
          <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>
            Create Account
          </button>
        </div>

        {/* Sign In */}
        {tab === 'login' && (
          <form className="auth-form" onSubmit={handleLogin}>
            <h1 className="auth-form__heading">Welcome Back</h1>
            <p className="auth-form__sub text-muted">Sign in to your Drisora account</p>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" required
                value={loginForm.email}
                onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com" />
            </div>

            <div className="form-group">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <label className="form-label">Password</label>
                <Link to="#" className="text-gold" style={{ fontSize:'0.8125rem' }}>Forgot Password?</Link>
              </div>
              <div className="auth-pw-wrap">
                <input type={showPw ? 'text' : 'password'} className="form-input" required
                  value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••" />
                <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="auth-divider-text"><span>or continue with</span></div>

            <button type="button" className="auth-google-btn" onClick={() => handleGoogle()}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
              Continue with Google
            </button>

            <p className="auth-switch">
              Don't have an account?{' '}
              <button type="button" className="auth-switch__link" onClick={() => setTab('register')}>
                Create one
              </button>
            </p>
          </form>
        )}

        {/* Register */}
        {tab === 'register' && (
          <form className="auth-form" onSubmit={handleRegister}>
            <h1 className="auth-form__heading">Create Account</h1>
            <p className="auth-form__sub text-muted">Join the Drisora family today</p>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" required
                value={regForm.name}
                onChange={e => setRegForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your full name" />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" required
                value={regForm.email}
                onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="auth-pw-wrap">
                <input type={showPw ? 'text' : 'password'} className="form-input" required minLength={6}
                  value={regForm.password}
                  onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 6 characters" />
                <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-input" required
                value={regForm.confirm}
                onChange={e => setRegForm(f => ({ ...f, confirm: e.target.value }))}
                placeholder="Repeat your password" />
              {regForm.confirm && regForm.password !== regForm.confirm && (
                <p style={{ color: 'var(--color-error)', fontSize: '0.8125rem', marginTop: 4 }}>Passwords don't match</p>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg"
              disabled={loading || (regForm.confirm && regForm.password !== regForm.confirm)}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="auth-divider-text"><span>or continue with</span></div>

            <button type="button" className="auth-google-btn" onClick={() => handleGoogle()}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
              Continue with Google
            </button>

            <p className="auth-switch">
              Already have an account?{' '}
              <button type="button" className="auth-switch__link" onClick={() => setTab('login')}>
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
