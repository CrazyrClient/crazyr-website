import React from 'react';
import { Check } from 'lucide-react';

export default function Pricing({ onOpenAuth }) {
  const plans = [
    {
      name: '1 Month Pass',
      price: '$9.99',
      period: 'Billed once · No auto-renew',
      desc: 'Full unrestricted access for 30 days. Perfect for competitive tournament seasons and scrims.',
      features: [
        'Full ghost combat suite',
        'Authentic GCD aim smoothing',
        'JumpReset & velocity tuning',
        'Cloud profile synchronization',
        'Full visual indicators and ESP',
        'Discord community support',
      ],
      buttonText: 'Buy 30-day pass',
      featured: false,
      planId: '1m',
    },
    {
      name: 'Lifetime License',
      price: '$34.99',
      period: 'One-time payment · Permanent access',
      desc: 'The definitive package. Pay once and receive every future update and feature indefinitely.',
      features: [
        'Everything included in 1 Month Pass',
        'Permanent access with zero renewal fees',
        'All future game version updates included',
        'Automated self-service HWID reset dashboard',
        'Priority 1-on-1 technical ticket support',
        'Early access to new features and presets',
      ],
      buttonText: 'Buy now',
      featured: true,
      planId: 'lifetime',
    },
  ];

  return (
    <section id="pricing" className="py-24 border-t border-white/[0.06] bg-[#08090D]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase mb-2 block">
            CRAZYR
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Pricing
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Instant automated key delivery · No recurring subscription surprises
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
          {plans.map((plan, idx) => (
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
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    {plan.price}
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

              <button
                onClick={() => onOpenAuth(plan.planId)}
                className={`w-full py-3 px-4 rounded-lg text-xs font-semibold transition-all ${
                  plan.featured
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                    : 'bg-[#181B27] hover:bg-[#202434] text-slate-200 border border-white/[0.08]'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-xs text-slate-500">
          Keys are delivered immediately via email upon payment completion.
        </div>
      </div>
    </section>
  );
}
