import React, { useState } from 'react';
import { X, User, Key, Shield, Check, Copy, ExternalLink, LogOut, Clock, Cpu } from 'lucide-react';

export default function UserModal({ isOpen, onClose, user, onLogout }) {
  const [copied, setCopied] = useState(false);

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

  const tierInfo = getTierDisplay(user.tier);

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
                className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${tierInfo.color}`}
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

            {user.license_key ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#141722] border border-white/[0.08]">
                <code className="text-xs font-mono text-emerald-400 flex-1 truncate select-all">
                  {user.license_key}
                </code>
                <button
                  onClick={() => handleCopy(user.license_key)}
                  className="px-2.5 py-1.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-lg bg-[#141722] border border-dashed border-white/[0.1] text-xs text-slate-400">
                <p className="mb-2">No license key linked yet.</p>
                <a
                  href="https://discord.gg/8BH7TBYKEz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:underline font-medium inline-flex items-center gap-1"
                >
                  Boost Discord server to get a key <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Status Details Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-[#141722] border border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Validity</span>
              </div>
              <div className="text-xs font-semibold text-white">
                {user.is_lifetime ? 'Lifetime VIP' : (user.expiry_text || 'Active')}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#141722] border border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-1">
                <Cpu className="w-3.5 h-3.5 text-slate-400" />
                <span>Hardware ID</span>
              </div>
              <div className="text-xs font-semibold text-emerald-400">
                {user.hwid_bound ? 'Locked to Device' : 'Unbound (Ready)'}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <p className="text-[11px] text-slate-400 mb-6 leading-relaxed bg-[#141722]/60 p-3 rounded-lg border border-white/[0.04]">
          💡 Launch the Crazyr Client and paste your license key into the prompt to activate your hardware lock and begin playing.
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
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1A1D2A] hover:bg-[#232738] rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
