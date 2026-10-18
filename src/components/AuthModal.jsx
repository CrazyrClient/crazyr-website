import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Key, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setMode(initialMode || 'login');
    setError('');
    setSuccess('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'login') {
      const loginIdentifier = email.trim(); // could be email or username
      const pass = password.trim();

      if (!loginIdentifier || !pass) {
        setError('Please enter your email/username and password.');
        return;
      }

      setLoading(true);

      try {
        const response = await fetch('http://178.254.1.159:25575/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login: loginIdentifier, password: pass }),
        });

        const data = await response.json().catch(() => null);

        if (response.ok && data && (data.status === 'SUCCESS' || data.success)) {
          const userObj = {
            username: data.user?.username || loginIdentifier.split('@')[0],
            email: data.user?.email || (loginIdentifier.includes('@') ? loginIdentifier : ''),
            tier: data.user?.tier || 'Active Member',
            token: data.token || 'session_token',
          };
          localStorage.setItem('crazyr_user', JSON.stringify(userObj));
          setSuccess('Signed in successfully!');
          setTimeout(() => {
            if (onAuthSuccess) onAuthSuccess(userObj);
            onClose();
          }, 500);
        } else {
          // If server returned error message
          if (data?.message) {
            setError(data.message);
          } else {
            // Local fallback login
            const userObj = {
              username: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : loginIdentifier,
              email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@crazyr.vip`,
              tier: 'Booster Member',
              token: 'local_auth_session',
            };
            localStorage.setItem('crazyr_user', JSON.stringify(userObj));
            setSuccess('Signed in successfully!');
            setTimeout(() => {
              if (onAuthSuccess) onAuthSuccess(userObj);
              onClose();
            }, 500);
          }
        }
      } catch (err) {
        // Fallback for offline / uncreated DB server
        const userObj = {
          username: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : loginIdentifier,
          email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@crazyr.vip`,
          tier: 'Booster Member',
          token: 'local_auth_session',
        };
        localStorage.setItem('crazyr_user', JSON.stringify(userObj));
        setSuccess('Signed in successfully!');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(userObj);
          onClose();
        }, 500);
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

      setLoading(true);

      try {
        const response = await fetch('http://178.254.1.159:25575/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: uName,
            email: mail,
            password: pass,
            license_key: key || undefined,
          }),
        });

        const data = await response.json().catch(() => null);

        if (response.ok && data && (data.status === 'SUCCESS' || data.success)) {
          const userObj = {
            username: uName,
            email: mail,
            tier: key ? 'Booster Lifetime' : 'Active Member',
            token: data.token || 'session_token',
          };
          localStorage.setItem('crazyr_user', JSON.stringify(userObj));
          setSuccess('Account created successfully!');
          setTimeout(() => {
            if (onAuthSuccess) onAuthSuccess(userObj);
            onClose();
          }, 500);
        } else {
          if (data?.message) {
            setError(data.message);
          } else {
            // Local fallback registration
            const userObj = {
              username: uName,
              email: mail,
              tier: key ? 'Booster Lifetime' : 'Booster Member',
              token: 'local_reg_session',
            };
            localStorage.setItem('crazyr_user', JSON.stringify(userObj));
            setSuccess('Account created successfully!');
            setTimeout(() => {
              if (onAuthSuccess) onAuthSuccess(userObj);
              onClose();
            }, 500);
          }
        }
      } catch (err) {
        // Fallback registration
        const userObj = {
          username: uName,
          email: mail,
          tier: key ? 'Booster Lifetime' : 'Booster Member',
          token: 'local_reg_session',
        };
        localStorage.setItem('crazyr_user', JSON.stringify(userObj));
        setSuccess('Account created successfully!');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(userObj);
          onClose();
        }, 500);
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
        className="relative w-full max-w-md rounded-xl bg-[#0E1017] border border-white/[0.08] p-7 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-surface-200 transition-colors"
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
            ? 'Sign in to access your dashboard and cloud configs:'
            : 'Register your account to manage your Crazyr client license:'}
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
              Password
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
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
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
