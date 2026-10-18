import React from 'react';
import { motion } from 'framer-motion';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="features" className="py-24 border-t border-white/[0.06] bg-[#08090D] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with animated entrance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-mono font-bold tracking-widest text-red-500 uppercase mb-2 block">
            CRAZYR ADVANTAGE
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            Take a closer look.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Engineered from the ground up for maximum discretion and surgical combat output
          </p>
        </motion.div>

        {/* 3x2 Grid Cards with Framer Motion stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
        >
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{
                  y: -6,
                  borderColor: 'rgba(239, 68, 68, 0.35)',
                  boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.7), 0 0 20px -5px rgba(220, 38, 38, 0.15)',
                  transition: { duration: 0.2 },
                }}
                className="p-8 rounded-2xl bg-[#0E1017] border border-white/[0.06] transition-all flex flex-col justify-between group cursor-default"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#171216] border border-white/[0.08] group-hover:border-red-500/30 group-hover:bg-red-500/10 flex items-center justify-center text-red-500 mb-6 transition-all duration-300">
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                    {card.desc}
                  </p>
                </div>

                <div>
                  <a
                    href="#pricing"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors group-hover:translate-x-1 duration-200"
                  >
                    <span>Get Access</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
