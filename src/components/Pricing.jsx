import React from 'react';
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
    <section id="pricing" className="py-24 border-t border-white/[0.06] bg-[#08090D]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase mb-2 block">
            CRAZYR ACCESS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Unlock with Server Boosts
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            No subscriptions, no hidden payments. Support our official Discord server to claim your instant license key.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
          {boostPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-2xl flex flex-col justify-between text-left transition-all ${
                plan.featured
                  ? 'bg-[#140E12] border-2 border-red-500/50 shadow-lg'
                  : 'bg-[#0E1017] border border-white/[0.06]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  {plan.featured && (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                      Best Value
                    </span>
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

              <a
                href="https://discord.gg/8BH7TBYKEz"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3.5 px-4 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                  plan.featured
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                    : 'bg-[#181B27] hover:bg-[#202434] text-slate-200 border border-white/[0.08]'
                }`}
              >
                <span>{plan.buttonText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          How to claim: Boost our Discord server, then visit the <strong className="text-slate-300">#claim-license</strong> channel or open a support ticket to receive your instant key.
        </div>
      </div>
    </section>
  );
}
