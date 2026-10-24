import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, User, Mail, Lock, Key, ShieldCheck, AlertCircle } from 'lucide-react';
import { registerUser, loginUser } from '../services/authApi';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, onOpenLegal, initialMode = 'login', initialPlan = null }) {
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
      const loginIdentifier = email.trim();
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
            tier: data.user?.tier || 'booster_lifetime',
            license_key: data.user?.license_key || null,
            expiry_text: data.user?.expiry_text || null,
            expires_at: data.user?.expires_at || null,
            is_lifetime: data.user?.is_lifetime ?? true,
          };

          if (data.token) {
            localStorage.setItem('crazyr_token', data.token);
          }
          localStorage.setItem('crazyr_user', JSON.stringify(userObj));

          setSuccess(`Welcome back, ${userObj.username}!`);
          setTimeout(() => {
            if (onAuthSuccess) onAuthSuccess(userObj);
            onClose();
          }, 500);
        } else {
          setError(data?.message || 'Invalid username or password.');
        }
      } catch (err) {
        setError(err.message || 'Login failed. Please verify your credentials.');
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
            tier: data.user?.tier || (key ? 'booster_1m' : 'booster_lifetime'),
            license_key: data.user?.license_key || key || null,
            expires_at: data.user?.expires_at || null,
            is_lifetime: data.user?.is_lifetime ?? true,
          };

          if (data.token) {
            localStorage.setItem('crazyr_token', data.token);
          }
          localStorage.setItem('crazyr_user', JSON.stringify(userObj));

          setSuccess('Account created successfully!');
          setTimeout(() => {
            if (onAuthSuccess) onAuthSuccess(userObj);
            onClose();
          }, 500);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
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
        <div className="flex rounded-xl bg-[#141722] p-1 mb-6 border border-white/[0.06]">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
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
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        <div className="mb-5">
          <h3 className="text-xl font-bold text-white tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Enter your credentials to access your Crazyr account.'
              : 'Register to access your license dashboard and client downloads.'}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs mb-4 leading-relaxed flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-xs mb-4"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. frost"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141722] border border-white/[0.08] text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                disabled={loading}
                required
              />
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141722] border border-white/[0.08] text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-red-500 transition-colors"
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141722] border border-white/[0.08] text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-red-500 transition-colors"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141722] border border-white/[0.08] text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                disabled={loading}
              />
            </div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors disabled:opacity-60 mt-3 shadow-md shadow-red-950/40"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </motion.button>
        </form>

        {/* Clean Corporate Footer */}
        <div className="mt-5 pt-4 border-t border-white/[0.05] space-y-2 text-center">
          <div className="text-[11px] text-slate-500">
            Need a key?{' '}
            <a
              href="https://discord.gg/8BH7TBYKEz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:underline font-medium"
            >
              Boost Discord
            </a>
          </div>

          <div className="text-[10px] text-slate-500 leading-normal">
            By continuing, you agree to our{' '}
            <button
              type="button"
              onClick={() => onOpenLegal && onOpenLegal('tos')}
              className="text-slate-400 hover:text-white underline transition-colors"
            >
              Terms of Service
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={() => onOpenLegal && onOpenLegal('privacy')}
              className="text-slate-400 hover:text-white underline transition-colors"
            >
              Privacy Policy
            </button>
            .
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
