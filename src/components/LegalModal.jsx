import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Shield, AlertTriangle, RefreshCw, Key, ShieldAlert } from 'lucide-react';

export default function LegalModal({ isOpen, onClose, initialTab = 'tos' }) {
  const [activeTab, setActiveTab] = useState('tos'); // 'tos' or 'privacy'

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-[#0E1017] border border-white/[0.08] shadow-2xl text-left overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/[0.06] bg-[#0E1017]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400">
              {activeTab === 'tos' ? <FileText className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {activeTab === 'tos' ? 'Terms of Service' : 'Privacy Policy'}
              </h3>
              <p className="text-xs text-slate-400">
                Official Crazyr Client Legal Agreement • 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#141722] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-3 pb-2 bg-[#0E1017]">
          <div className="flex rounded-xl bg-[#141722] p-1 border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setActiveTab('tos')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'tos'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Terms of Service
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'privacy'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Privacy Policy
            </button>
          </div>
        </div>

        {/* Scrollable Document Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300 leading-relaxed font-sans">
          {activeTab === 'tos' ? (
            // ==========================================
            // TERMS OF SERVICE (Exact User Specification)
            // ==========================================
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-red-300 space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm text-red-400">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>Acceptance of Terms</span>
                </div>
                <p className="text-xs text-slate-300">
                  By purchasing or using Crazyr Client, you agree to these Terms. If you disagree, do not use the client.
                </p>
              </div>

              {/* Section 1 */}
              <div className="p-4 rounded-xl bg-[#141722] border border-white/[0.06] space-y-2">
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>🔴 Use at Your Own Risk 🔴</span>
                </div>
                <p className="text-slate-300">
                  Crazyr Client is a modified/cheat client. You are responsible for any bans, suspensions, or penalties caused by its use.
                </p>
              </div>

              {/* Section 2: Exchange & Refund */}
              <div className="p-4 rounded-xl bg-[#141722] border border-white/[0.06] space-y-2.5">
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-red-400" />
                  <span>🔃 Exchange &amp; Refund Policy 🔃</span>
                </div>
                <p className="text-slate-300">
                  All purchases are <strong>FINAL</strong>. No refunds are provided for bans, detection, dissatisfaction, mistakes, or feature changes.
                </p>
                <div className="pt-1 text-slate-300">
                  <p className="font-semibold text-slate-200 mb-1">Exchanges are only available if:</p>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-slate-400">
                    <li>The key is unused.</li>
                    <li>The wrong product was provided.</li>
                    <li>A verified technical issue prevents activation.</li>
                  </ul>
                </div>
                <p className="text-red-400/90 font-medium pt-1">
                  Once a key is activated or used, it cannot be exchanged or refunded.
                </p>
              </div>

              {/* Section 3: License Rules */}
              <div className="p-4 rounded-xl bg-[#141722] border border-white/[0.06] space-y-1.5">
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-red-400" />
                  <span>License Rules</span>
                </div>
                <p className="text-slate-300">
                  Your license is for personal use only. Sharing, reselling, redistributing, cracking, or bypassing Crazyr Client is prohibited.
                </p>
              </div>

              {/* Section 4: Anti-Leak Policy */}
              <div className="p-4 rounded-xl bg-[#141722] border border-white/[0.06] space-y-1.5">
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>Anti-Leak Policy</span>
                </div>
                <p className="text-slate-300">
                  Leaking, sharing, or distributing Crazyr Client/loader files, source code, or private builds may result in a permanent blacklist and loss of access.
                </p>
              </div>

              {/* Section 5: Updates */}
              <div className="p-4 rounded-xl bg-[#141722] border border-white/[0.06] space-y-1.5">
                <div className="font-bold text-sm text-white">
                  <span>Updates</span>
                </div>
                <p className="text-slate-300">
                  We may update, modify, suspend, or discontinue features at any time. We do not guarantee permanent compatibility or undetected status.
                </p>
              </div>

              {/* Section 6: Right to Refuse */}
              <div className="p-4 rounded-xl bg-[#141722] border border-white/[0.06] space-y-1.5">
                <div className="font-bold text-sm text-white">
                  <span>Right to Refuse Service</span>
                </div>
                <p className="text-slate-300">
                  We may terminate access for leaks, license abuse, chargebacks, scams, or serious harassment. Termination does not qualify for a refund.
                </p>
              </div>

              {/* Section 7: Changes to Terms */}
              <div className="p-4 rounded-xl bg-[#141722] border border-white/[0.06] space-y-1.5">
                <div className="font-bold text-sm text-white">
                  <span>Changes to Terms</span>
                </div>
                <p className="text-slate-300">
                  We may update these Terms at any time. Continued use of Crazyr Client means you accept the updated Terms.
                </p>
              </div>

              <div className="text-center pt-2 text-[11px] font-mono text-slate-500">
                &copy; Crazyr Client &bull; 2026
              </div>
            </div>
          ) : (
            // ==========================================
            // PRIVACY POLICY
            // ==========================================
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#141722] border border-white/[0.06] space-y-2">
                <h4 className="font-bold text-sm text-white">1. Information We Collect</h4>
                <p className="text-slate-300">
                  Crazyr Client prioritizes user privacy and minimizes telemetry. When you create an account or verify a license, we collect only:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-slate-400">
                  <li><strong>Account Credentials:</strong> Username, email address, and one-way cryptographic password representations.</li>
                  <li><strong>License Tokens:</strong> Assigned product tier, license keys, and activation status.</li>
                  <li><strong>Hardware Identifiers:</strong> A deterministic, one-way SHA-256 fingerprint generated from non-reversible hardware attributes, used strictly for single-seat license validation.</li>
                </ul>
                <p className="text-slate-400 pt-1">
                  We <strong>never</strong> scan personal files, inspect browser histories, log keystrokes outside Minecraft, or read private communications.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141722] border border-white/[0.06] space-y-2">
                <h4 className="font-bold text-sm text-white">2. How We Use Information</h4>
                <p className="text-slate-300">Collected data is used solely for the following operational purposes:</p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-slate-400">
                  <li>Authorizing client sessions and delivering software updates.</li>
                  <li>Synchronizing Cloud Configs shared via 6-character share codes.</li>
                  <li>Preventing license fraud, unauthorized reselling, and account cracking.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#141722] border border-white/[0.06] space-y-2">
                <h4 className="font-bold text-sm text-white">3. Data Protection &amp; Confidentiality</h4>
                <p className="text-slate-300">
                  All communication between the client, web dashboard, and authentication infrastructure is encrypted using industry-standard TLS protocols. We do not sell, rent, or distribute your account details to third parties under any circumstances.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141722] border border-white/[0.06] space-y-2">
                <h4 className="font-bold text-sm text-white">4. Your Rights &amp; Data Deletion</h4>
                <p className="text-slate-300">
                  You have full authority over your data. You may revoke license keys, modify your profile, or request complete account erasure at any time directly through your user dashboard or via our official support team.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141722] border border-white/[0.06] space-y-2">
                <h4 className="font-bold text-sm text-white">5. Cookies &amp; Local Storage</h4>
                <p className="text-slate-300">
                  The website utilizes browser Local Storage strictly to maintain active login sessions and cached preferences. No marketing trackers or third-party advertising cookies are used.
                </p>
              </div>

              <div className="text-center pt-2 text-[11px] font-mono text-slate-500">
                &copy; Crazyr Client &bull; 2026
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-4 border-t border-white/[0.06] bg-[#0E1017] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            I Understand
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
