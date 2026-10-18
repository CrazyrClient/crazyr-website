import React from 'react';
import { Crosshair, Zap, Compass, ShieldCheck, Share2, Headphones, ArrowRight } from 'lucide-react';

export default function Features() {
  const cards = [
    {
      icon: Crosshair,
      title: 'Authentic aim mechanics',
      desc: 'Operates strictly within natural mouse sensitivity quantization curves. Retain full cursor control with zero unnatural snap vectors.',
    },
    {
      icon: Zap,
      title: 'Sub-tick execution',
      desc: 'Direct integration into the client render cycle ensures immediate weapon and action response without packet anomalies.',
    },
    {
      icon: Compass,
      title: 'Dynamic velocity & knockback',
      desc: 'Fine-tune horizontal and vertical velocity reduction while preserving your natural forward sprinting momentum.',
    },
    {
      icon: ShieldCheck,
      title: 'Memory cleanup & panic',
      desc: 'Clean runtime memory structure. An emergency panic key completely unhooks modules and clears traces from memory instantly.',
    },
    {
      icon: Share2,
      title: 'Cloud profiles',
      desc: 'Effortlessly save, share, and synchronize configurations tailored for different playstyles and practice servers.',
    },
    {
      icon: Headphones,
      title: 'Active updates & support',
      desc: 'Engineered by competitive players. Constant updates for new game patches and prompt technical assistance.',
    },
  ];

  return (
    <section id="features" className="py-24 border-t border-white/[0.06] bg-[#08090D]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Title matching Vape's Take a Closer Look structure */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase mb-2 block">
            CRAZYR
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            Take a closer look.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            A few key advantages Crazyr has to offer
          </p>
        </div>

        {/* 3x2 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-[#0E1017] border border-white/[0.06] hover:border-white/[0.14] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#171216] border border-white/[0.08] flex items-center justify-center text-red-500 mb-6">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                    {card.desc}
                  </p>
                </div>

                <div>
                  <a
                    href="#pricing"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
