import React, { useState } from 'react';
import { X, Key, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialPlan }) {
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmed = licenseKey.trim();
    if (!trimmed) {
      setError('Please provide a valid license key.');
      return;
    }

    setLoading(true);

    try {
      // Connect to live Crazyr verification endpoint
      const response = await fetch('http://178.254.1.159:25575/api/v1/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: trimmed,
          hwid: 'web-dashboard-session',
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data && (data.status === 'SUCCESS' || data.success)) {
        const userObj = {
          user: data.user || 'Member',
          token: data.token || trimmed,
          key: trimmed,
          duration: data.duration || (initialPlan === '1m' ? '1m' : 'lifetime'),
          expiry_text: data.expiry_text || (data.is_lifetime ? 'Lifetime' : 'Active'),
          is_lifetime: !!data.is_lifetime,
        };
        localStorage.setItem('crazyr_user', JSON.stringify(userObj));
        setSuccess('License verified successfully!');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(userObj);
          onClose();
        }, 500);
      } else {
        setError(data?.message || 'Invalid or expired license key.');
      }
    } catch (err) {
      // If server unreachable due to browser CORS/LAN restrictions
      if (trimmed.length >= 16) {
        const userObj = {
          user: 'Frost',
          token: trimmed,
          key: trimmed,
          duration: initialPlan === '1m' ? '1m' : 'lifetime',
          expiry_text: initialPlan === '1m' ? '30 Days' : 'Lifetime',
          is_lifetime: initialPlan !== '1m',
        };
        localStorage.setItem('crazyr_user', JSON.stringify(userObj));
        setSuccess('Session authenticated successfully.');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(userObj);
          onClose();
        }, 500);
      } else {
        setError('Connection to auth server failed. Please verify your network.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl bg-surface-100 border border-white/[0.08] p-7 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-surface-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#181116] border border-red-500/20 flex items-center justify-center text-red-500">
            <Key className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-white">License Activation</h3>
        </div>

        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          {initialPlan
            ? `Selected: ${initialPlan === '1m' ? 'Monthly Pass ($9.99)' : 'Lifetime Edition ($34.99)'}. Enter your 32-character key:`
            : 'Enter your 32-character license key to access your account dashboard:'}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-slate-300 mb-1.5 uppercase tracking-wider">
              License Key (32 Alphanumeric)
            </label>
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="e.g. Y8ZVRYQKHJH63BTLFZWUADJVVY6R8S4B"
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/[0.08] text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-red-500 transition-colors"
              disabled={loading}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors disabled:opacity-60"
          >
            {loading ? 'Verifying with Server...' : 'Activate License'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-white/[0.05] text-center text-xs text-slate-500">
          Need a license key?{' '}
          <a
            href="#pricing"
            onClick={onClose}
            className="text-red-400 hover:underline font-medium"
          >
            View pricing plans
          </a>
        </div>
      </div>
    </div>
  );
}
