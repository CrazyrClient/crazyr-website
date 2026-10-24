import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Key, Shield, Check, Copy, ExternalLink, LogOut, Clock, Cpu, 
  Trash2, AlertTriangle, RefreshCw 
} from 'lucide-react';
import { deleteLicenseKey, redeemLicenseKey } from '../services/authApi';

export default function UserModal({ isOpen, onClose, user, onLogout, onUserUpdate }) {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [redeemInput, setRedeemInput] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemFeedback, setRedeemFeedback] = useState(null);

  if (!isOpen || !user) return null;

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTierDisplay = (tier) => {
    if (!tier) return { text: 'Member', color: 'bg-slate-800 text-slate-300 border-slate-700' };
    const t = tier.toLowerCase();
    if (t.includes('lifetime')) {
      return { text: 'Booster Lifetime', color: 'bg-red-500/20 text-red-400 border-red-500/40' };
    }
    if (t.includes('1m') || t.includes('booster')) {
      return { text: 'Booster 30-Day', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
    }
    if (t.includes('admin')) {
      return { text: 'Administrator', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' };
    }
    return { text: 'Member', color: 'bg-slate-800 text-slate-300 border-slate-700' };
  };

  // 1. Delete linked license key
  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('crazyr_token');
    if (!token) {
      setDeleteError('Not signed in or session expired.');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await deleteLicenseKey(token);
      if (onUserUpdate) {
        onUserUpdate(res.user || {
          ...user,
          license_key: null,
          tier: 'member',
          expiry_text: null,
          expires_at: null,
          is_lifetime: false,
          hwid_bound: false,
        });
      }
      setShowDeleteConfirm(false);
    } catch (err) {
      setDeleteError(err.message || 'Failed to revoke license key.');
    } finally {
      setIsDeleting(false);
    }
  };

  // 2. Redeem / Activate a key
  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!redeemInput.trim()) return;
    const token = localStorage.getItem('crazyr_token');
    if (!token) {
      setRedeemFeedback({ type: 'error', message: 'Not signed in.' });
      return;
    }

    setIsRedeeming(true);
    setRedeemFeedback(null);
    try {
      const res = await redeemLicenseKey(redeemInput.trim(), token);
      setRedeemFeedback({ type: 'success', message: res.message || 'License successfully activated!' });
      setRedeemInput('');
      const updated = {
        ...user,
        license_key: res.license_key || redeemInput.trim(),
        tier: res.tier || 'booster_1m',
        expiry_text: res.expiry_text || 'Active • 30 Days',
        expires_at: res.expires_at || (Date.now() + 30 * 24 * 60 * 60 * 1000),
        is_lifetime: res.is_lifetime || false
      };
      if (onUserUpdate) onUserUpdate(updated);
    } catch (err) {
      setRedeemFeedback({ type: 'error', message: err.message || 'Activation failed. Please check your key.' });
    } finally {
      setIsRedeeming(false);
    }
  };

  const hasLicense = Boolean(user.license_key && user.license_key.trim());
  const tierInfo = getTierDisplay(hasLicense ? user.tier : 'member');

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
        className="relative w-full max-w-md rounded-2xl bg-[#0E1017] border border-white/[0.08] p-7 shadow-2xl text-left max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#141722] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 font-bold text-lg">
            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {user.username}
              </h3>
              <span
                className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${tierInfo.color}`}
              >
                {tierInfo.text}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {user.email || 'Registered User'}
            </p>
          </div>
        </div>

        {/* License Key Section */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-red-500" />
              <span>Crazyr License Key</span>
            </label>

            {hasLicense ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#141722] border border-white/[0.08]">
                  <code className="text-xs font-mono text-emerald-400 flex-1 truncate select-all">
                    {user.license_key}
                  </code>

                  {/* Copy Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopy(user.license_key)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Copy Key"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </motion.button>

                  {/* Delete Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                    disabled={isDeleting}
                    className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-500/20"
                    title="Revoke Key"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Revoke</span>
                  </motion.button>
                </div>

                {/* Inline Confirmation for Key Deletion */}
                <AnimatePresence>
                  {showDeleteConfirm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 space-y-2.5 overflow-hidden"
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <p className="font-semibold text-white">
                          Revoke License Key?
                        </p>
                      </div>
                      <p className="text-[11px] text-red-300/80 leading-relaxed">
                        Your booster rank will be revoked and reset to Member. The license key will be permanently removed.
                      </p>
                      {deleteError && (
                        <p className="text-[11px] text-red-400 font-mono">{deleteError}</p>
                      )}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleConfirmDelete}
                          disabled={isDeleting}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {isDeleting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                          <span>Yes, Revoke Key</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={isDeleting}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-xs transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#141722] border border-dashed border-white/[0.1] text-xs text-slate-400 space-y-3">
                <p>No active license key linked to this account.</p>
                <form onSubmit={handleRedeem} className="flex gap-2">
                  <input
                    type="text"
                    value={redeemInput}
                    onChange={(e) => setRedeemInput(e.target.value)}
                    placeholder="Enter license key (e.g. CRZ-XXXX)..."
                    className="flex-1 bg-[#0E1017] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="submit"
                    disabled={isRedeeming || !redeemInput.trim()}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    {isRedeeming ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Key className="w-3 h-3" />}
                    <span>Activate</span>
                  </button>
                </form>
                {redeemFeedback && (
                  <p className={`text-[11px] ${redeemFeedback.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {redeemFeedback.message}
                  </p>
                )}
                <div className="pt-1">
                  <a
                    href="https://discord.gg/8BH7TBYKEz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 hover:underline font-medium inline-flex items-center gap-1 text-[11px]"
                  >
                    Boost Discord server to get a key <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Status Details Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#141722] border border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Validity</span>
              </div>
              <div className="text-xs font-semibold text-white">
                {hasLicense ? (user.is_lifetime ? 'Lifetime VIP' : (user.expiry_text || 'Active')) : 'No Active License'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#141722] border border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-1">
                <Cpu className="w-3.5 h-3.5 text-slate-400" />
                <span>Hardware ID</span>
              </div>
              <div className={`text-xs font-semibold ${hasLicense ? (user.hwid_bound ? 'text-emerald-400' : 'text-amber-400') : 'text-slate-500'}`}>
                {hasLicense ? (user.hwid_bound ? 'Locked to Device' : 'Unbound (Ready)') : 'Unlinked'}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <p className="text-[11px] text-slate-400 mb-6 leading-relaxed bg-[#141722]/60 p-3 rounded-xl border border-white/[0.04]">
          💡 Launch the Crazyr Client and enter your license key to bind your hardware fingerprint (HWID).
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <button
            onClick={() => {
              if (onLogout) onLogout();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1A1D2A] hover:bg-[#232738] rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
