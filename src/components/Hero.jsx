import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const specs = [
    {
      label: 'Sub-Tick Latency',
      val: '< 1ms',
      desc: 'Synchronous client tick execution with zero packet delay',
    },
    {
      label: 'GCD Delta Alignment',
      val: '100%',
      desc: 'Matches hardware mouse sensitivity quantization curves',
    },
    {
      label: 'Memory Footprint',
      val: '0 KB',
      desc: 'Instant emergency panic trigger unloads modules cleanly',
    },
    {
      label: 'Interface Performance',
      val: '240+ FPS',
      desc: 'Hardware-accelerated rendering with zero framerate impact',
    },
  ];

  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-24 overflow-hidden bg-[#090A0F]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Title - Mature, Clean, Powerful */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08] mb-6">
          Surgical precision. <br />
          <span className="text-slate-400">Undetected execution.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Get an unfair advantage over your opponents, while remaining completely undetected. Engineered specifically for competitive duels and practice servers.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <a
            href="#pricing"
            className="w-full sm:w-auto px-7 py-3.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Unlock with Boost</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#features"
            className="w-full sm:w-auto px-7 py-3.5 rounded-lg text-sm font-medium text-slate-300 bg-[#12141D] hover:bg-[#181B27] border border-white/[0.08] hover:border-white/[0.15] hover:text-white transition-all flex items-center justify-center"
          >
            Learn more
          </a>
        </div>

        {/* 4 Clean Metric Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {specs.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#0F1118] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
            >
              <div className="text-2xl font-mono font-bold text-white mb-1">
                {item.val}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                {item.label}
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
