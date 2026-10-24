import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Mail, Lock, Key, ShieldCheck, AlertCircle, 
  Settings, Wifi, WifiOff, RefreshCw, Check, Server
} from 'lucide-react';
import { 
  registerUser, loginUser, getApiBase, setApiBase, 
  checkApiHealth, DEFAULT_PROD_API_BASE 
} from '../services/authApi';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login', initialPlan = null }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Diagnostics & Backend Settings
  const [showSettings, setShowSettings] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [health, setHealth] = useState({ checking: false, ok: null, latency: null, error: null, url: '' });

  const runHealthCheck = async () => {
    setHealth(prev => ({ ...prev, checking: true }));
    const result = await checkApiHealth();
    setHealth({
      checking: false,
      ok: result.ok,
      latency: result.latency,
      error: result.error || null,
      url: result.url || getApiBase() || 'Vite Dev Proxy'
    });
  };

  useEffect(() => {
    const determinedMode = (initialMode === 'register' || initialPlan === 'register') ? 'register' : 'login';
    setMode(determinedMode);
    setError('');
    setSuccess('');
    
    if (isOpen) {
      const stored = localStorage.getItem('crazyr_api_url') || '';
      setCustomUrlInput(stored);
      runHealthCheck();
    }
  }, [initialMode, initialPlan, isOpen]);

  if (!isOpen) return null;

  const handleSaveCustomUrl = async (e) => {
    e.preventDefault();
    setApiBase(customUrlInput);
    await runHealthCheck();
  };

  const handleResetUrl = async () => {
    setApiBase('');
    setCustomUrlInput('');
    await runHealthCheck();
  };

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

        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h3>

          {/* Quick Backend Status Badge */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#141722] border border-white/[0.06] text-[10px]">
            {health.checking ? (
              <RefreshCw className="w-2.5 h-2.5 text-slate-400 animate-spin" />
            ) : health.ok ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {health.latency}ms
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                Offline
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-5">
          {mode === 'login'
            ? 'Sign in to access your Crazyr database account:'
            : 'Register a new account directly in our SQLite database:'}
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs mb-4 leading-relaxed"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1">
                <div>{error}</div>
                {(error.includes('nicht erreichbar') || error.includes('Failed to fetch') || error.includes('Sperre')) && (
                  <button
                    type="button"
                    onClick={() => setShowSettings(true)}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-300 hover:text-white underline"
                  >
                    <Settings className="w-3 h-3" />
                    Open Backend Settings
                  </button>
                )}
              </div>
            </div>
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
            className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors disabled:opacity-60 mt-2 shadow-md shadow-red-950/40"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </motion.button>
        </form>

        {/* Backend Diagnostics & Configuration Panel */}
        <div className="mt-4 pt-3 border-t border-white/[0.05]">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
            >
              <Server className="w-3.5 h-3.5 text-slate-500" />
              <span>Backend Connection</span>
            </button>
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
          </div>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-3 rounded-xl bg-[#141722]/80 border border-white/[0.06] p-3 text-[11px] space-y-2.5"
              >
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold text-slate-200">Active Target:</span>
                  <span className="font-mono text-slate-400 truncate max-w-[210px]">
                    {health.url || getApiBase() || 'Vite Dev Proxy'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span>Status:</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    {health.checking ? (
                      <span className="text-slate-400 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Checking...
                      </span>
                    ) : health.ok ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Online ({health.latency}ms)
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <WifiOff className="w-3 h-3" /> {health.error || 'Unreachable'}
                      </span>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSaveCustomUrl} className="space-y-2 pt-1">
                  <label className="block text-[10px] uppercase font-mono text-slate-400">
                    Custom Backend URL (Cloudflare Tunnel or IP):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="e.g. http://178.254.1.159:25575"
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#0E1017] border border-white/[0.08] text-white text-[11px] font-mono placeholder:text-slate-600 focus:outline-none focus:border-red-500"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-[11px] transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </form>

                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <button
                    type="button"
                    onClick={runHealthCheck}
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" /> Test Connection
                  </button>
                  <button
                    type="button"
                    onClick={handleResetUrl}
                    className="text-slate-500 hover:text-slate-300 underline"
                  >
                    Reset to Default
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
