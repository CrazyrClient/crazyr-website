import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function Hero({ onOpenAuth }) {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-24 overflow-hidden bg-[#090A0F]">
      {/* Animated Ambient Glow Orbs in Background */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-red-600/25 blur-[120px] rounded-full"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Subtle Top Pill Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-mono uppercase tracking-wider mb-6 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span>Fabric 1.21+ • Competitive Ghost Suite</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08] mb-6"
          >
            Surgical precision. <br />
            <span className="text-slate-400 bg-gradient-to-r from-slate-200 via-slate-400 to-slate-500 bg-clip-text text-transparent">
              Undetected execution.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Get an unfair advantage over your opponents, while remaining completely undetected. Engineered specifically for competitive duels and practice servers.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full sm:w-auto"
          >
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.04, boxShadow: '0 0 25px rgba(220, 38, 38, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-950/50"
            >
              <span>Unlock with Boost</span>
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <motion.a
              href="#features"
              whileHover={{ scale: 1.03, borderColor: 'rgba(255, 255, 255, 0.25)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-medium text-slate-300 bg-[#12141D] hover:bg-[#181B27] border border-white/[0.08] hover:text-white transition-all flex items-center justify-center"
            >
              Explore Features
            </motion.a>
          </motion.div>

          {/* 4 Clean Metric Blocks with Hover Float */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left w-full">
            {specs.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  backgroundColor: '#131622',
                  transition: { duration: 0.2 },
                }}
                className="p-5 rounded-2xl bg-[#0F1118] border border-white/[0.06] transition-colors relative group overflow-hidden"
              >
                <div className="text-2xl font-mono font-bold text-white mb-1 group-hover:text-red-400 transition-colors">
                  {item.val}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  {item.label}
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
