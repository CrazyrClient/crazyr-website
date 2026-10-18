import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Key, ShieldCheck, AlertCircle } from 'lucide-react';
import { registerUser, loginUser } from '../services/authApi';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login', initialPlan = null }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const determinedMode = (initialMode === 'register' || initialPlan === 'register') ? 'register' : 'login';
    setMode(determinedMode);
    setError('');
    setSuccess('');
  }, [initialMode, initialPlan, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'login') {
      const loginIdentifier = email.trim(); // can be username or email
      const pass = password.trim();

      if (!loginIdentifier || !pass) {
        setError('Please enter your email or username and password.');
        return;
      }

      setLoading(true);

      try {
        const data = await loginUser({ login: loginIdentifier, password: pass });
        
        if (data && data.status === 'SUCCESS') {
          const userObj = {
            id: data.user?.id,
            username: data.user?.username || loginIdentifier,
            email: data.user?.email || '',
            tier: data.user?.tier || 'member',
            license_key: data.user?.license_key || null,
            expiry_text: data.user?.expiry_text || null,
            expires_at: data.user?.expires_at || null,
            is_lifetime: data.user?.is_lifetime || false,
          };

          if (data.token) {
            localStorage.setItem('crazyr_token', data.token);
          }
          localStorage.setItem('crazyr_user', JSON.stringify(userObj));

          setSuccess(`Welcome back, ${userObj.username}!`);
          setTimeout(() => {
            if (onAuthSuccess) onAuthSuccess(userObj);
            onClose();
          }, 600);
        } else {
          setError(data?.message || 'Invalid username or password.');
        }
      } catch (err) {
        setError(err.message || 'Connection to auth database failed.');
      } finally {
        setLoading(false);
      }
    } else {
      // Register Mode
      const uName = username.trim();
      const mail = email.trim();
      const pass = password.trim();
      const key = licenseKey.trim();

      if (!uName || !mail || !pass) {
        setError('Please fill in username, email, and password.');
        return;
      }

      if (uName.length < 3 || uName.length > 32) {
        setError('Username must be between 3 and 32 characters.');
        return;
      }

      if (pass.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }

      setLoading(true);

      try {
        const data = await registerUser({
          username: uName,
          email: mail,
          password: pass,
          license_key: key || undefined,
        });

        if (data && data.status === 'SUCCESS') {
          const userObj = {
            id: data.user?.id,
            username: data.user?.username || uName,
            email: data.user?.email || mail,
            tier: data.user?.tier || (key ? 'booster_1m' : 'member'),
            license_key: data.user?.license_key || key || null,
            expires_at: data.user?.expires_at || null,
            is_lifetime: data.user?.is_lifetime || false,
          };

          if (data.token) {
            localStorage.setItem('crazyr_token', data.token);
          }
          localStorage.setItem('crazyr_user', JSON.stringify(userObj));

          setSuccess('Account created and saved to database successfully!');
          setTimeout(() => {
            if (onAuthSuccess) onAuthSuccess(userObj);
            onClose();
          }, 600);
        } else {
          setError(data?.message || 'Could not register account.');
        }
      } catch (err) {
        setError(err.message || 'Registration failed.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#0E1017] border border-white/[0.08] p-7 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#141722] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher: Sign In vs Register */}
        <div className="flex rounded-lg bg-[#141722] p-1 mb-6 border border-white/[0.06]">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
              mode === 'login'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
              mode === 'register'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          {mode === 'login'
            ? 'Sign in to access your Crazyr database account:'
            : 'Register a new account directly in our SQLite database:'}
        </p>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-950/30 border border-rose-500/20 text-rose-400 text-xs mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-xs mb-4">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. frost"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#141722] border border-white/[0.08] text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                  disabled={loading}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-slate-300 mb-1 uppercase tracking-wider">
              {mode === 'login' ? 'Email or Username' : 'Email Address'}
            </label>
            <input
              type={mode === 'login' ? 'text' : 'email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={mode === 'login' ? 'Enter username or email' : 'you@example.com'}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#141722] border border-white/[0.08] text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-red-500 transition-colors"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-300 mb-1 uppercase tracking-wider">
              Password {mode === 'register' && <span className="text-slate-500">(min. 8 chars)</span>}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#141722] border border-white/[0.08] text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-red-500 transition-colors"
              disabled={loading}
              required
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1 uppercase tracking-wider">
                Discord Booster License Key <span className="text-slate-500">(Optional)</span>
              </label>
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="Paste key if already claimed on Discord"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#141722] border border-white/[0.08] text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                disabled={loading}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-white/[0.05] text-center text-xs text-slate-400">
          Need a license key?{' '}
          <a
            href="https://discord.gg/8BH7TBYKEz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-400 hover:underline font-medium"
          >
            Boost our Discord server
          </a>
        </div>
      </div>
    </div>
  );
}
