import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, ExternalLink } from 'lucide-react';

export default function Pricing() {
  const boostPlans = [
    {
      name: '30-Day Pass',
      requirement: '1x Server Boost',
      period: 'Active while boost is active',
      desc: 'Boost our Discord server once to claim a 30-day competitive ghost license key.',
      features: [
        'Full ghost combat & movement suite',
        'Authentic GCD aim smoothing',
        'JumpReset & velocity tuning',
        'Cloud profile presets',
        'Full visual indicators and ESP',
        'Discord booster role & private channels',
      ],
      buttonText: 'Boost Discord Server',
      featured: false,
    },
    {
      name: 'Lifetime License',
      requirement: '2x Server Boosts',
      period: 'Permanent VIP Access',
      desc: 'Double-boost our Discord server or use Nitro Boost to receive permanent lifetime access.',
      features: [
        'Everything included in 30-Day Pass',
        'Permanent lifetime license with zero renewals',
        'All future game version updates included',
        'Automated self-service HWID reset dashboard',
        'Priority 1-on-1 technical ticket support',
        'Early access to new features and presets',
      ],
      buttonText: 'Boost for Lifetime Access',
      featured: true,
    },
  ];

  return (
    <section id="pricing" className="py-24 border-t border-white/[0.06] bg-[#08090D] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="text-xs font-mono font-bold tracking-widest text-red-500 uppercase mb-2 block">
            CRAZYR ACCESS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Unlock with Server Boosts
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            No subscriptions, no hidden payments. Support our official Discord server to claim your instant license key.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
          {boostPlans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{
                y: -6,
                boxShadow: plan.featured
                  ? '0 15px 35px -10px rgba(220, 38, 38, 0.3), 0 0 25px rgba(220, 38, 38, 0.2)'
                  : '0 15px 35px -10px rgba(0, 0, 0, 0.8)',
                transition: { duration: 0.2 },
              }}
              className={`p-8 rounded-3xl flex flex-col justify-between text-left transition-all ${
                plan.featured
                  ? 'bg-gradient-to-b from-[#180E14] to-[#0E1017] border-2 border-red-500/60 shadow-xl'
                  : 'bg-[#0E1017] border border-white/[0.08]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  {plan.featured && (
                    <motion.span
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1 shadow-sm"
                    >
                      <Sparkles className="w-3 h-3 text-red-400" />
                      <span>Best Value</span>
                    </motion.span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  {plan.desc}
                </p>

                <div className="mb-6">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {plan.requirement}
                  </span>
                  <div className="text-xs text-slate-400 mt-1 font-mono">
                    {plan.period}
                  </div>
                </div>

                <div className="space-y-3 mb-8 pt-6 border-t border-white/[0.06]">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <motion.a
                href="https://discord.gg/8BH7TBYKEz"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                  plan.featured
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/50'
                    : 'bg-[#181B27] hover:bg-[#202434] text-slate-200 border border-white/[0.08]'
                }`}
              >
                <span>{plan.buttonText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </motion.a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12 text-xs text-slate-400 max-w-xl mx-auto leading-relaxed"
        >
          How to claim: Boost our Discord server, then visit the <strong className="text-slate-300">#claim-license</strong> channel or open a support ticket to receive your instant key.
        </motion.div>
      </div>
    </section>
  );
}
