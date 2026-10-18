import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Is Crazyr really undetectable on competitive servers?',
      a: 'Yes. Crazyr is engineered from the ground up exclusively for ghost PvP and closet cheating. All combat routines strictly abide by hardware mouse GCD quantization, sub-pixel micro-jitter, and natural cursor interpolation. Packets are executed synchronously within the client tick loop, generating zero anomalous telemetry.',
    },
    {
      q: 'Which Minecraft versions and launchers are supported?',
      a: 'Crazyr runs natively on modern Minecraft Fabric (1.21.x). It is compatible with the official Minecraft Launcher, Prism Launcher, Modrinth App, CurseForge, and Feather Launcher with zero extra configuration.',
    },
    {
      q: 'How does the license key activation work?',
      a: 'When you boost our Discord server, a unique 32-character license key is issued in our #claim-license channel. Paste it into the client when launching or into your website account dashboard to activate your hardware lock.',
    },
    {
      q: 'Can I transfer my license if I upgrade my PC hardware?',
      a: 'Yes. Our authentication backend supports automated self-service HWID resets. Whenever you upgrade parts or switch computers, your hardware binding can be reset via support ticket or dashboard.',
    },
    {
      q: 'How do I unlock access?',
      a: 'Crazyr is completely free of subscription fees! You gain full access simply by boosting our official Discord server. 1 boost grants a 30-Day Pass, and 2 boosts (or Nitro Server Boost) grant Permanent Lifetime VIP Access.',
    },
  ];

  return (
    <section id="faq" className="py-24 border-t border-white/[0.06] bg-[#08090D] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="text-xs font-mono font-bold tracking-widest text-red-500 uppercase mb-2 block">
            KNOWLEDGE BASE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Everything you need to know about Crazyr client security, installation, and server boosts.
          </p>
        </motion.div>

        <div className="space-y-3 text-left">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="rounded-2xl bg-[#0E1017] border border-white/[0.06] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 flex items-center justify-between gap-4 text-left font-medium text-sm text-white hover:text-slate-200 transition-colors"
                >
                  <span className="font-semibold">{item.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="shrink-0"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-colors ${
                        isOpen ? 'text-red-500' : 'text-slate-400'
                      }`}
                    />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-white/[0.04] pt-4">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
