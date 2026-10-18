import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
      a: 'Upon checkout, an authentic 32-character license key is generated and emailed to you instantly. When you launch the client, an activation dialog will prompt you for your key on first start. Once verified, it is permanently saved locally.',
    },
    {
      q: 'Can I transfer my license if I upgrade my PC hardware?',
      a: 'Yes. Our authentication backend supports automated self-service HWID resets. Whenever you upgrade parts or switch computers, you can reset your hardware binding easily.',
    },
    {
      q: 'What payment methods are supported?',
      a: 'We accept major Credit & Debit cards (Stripe), PayPal, and popular Cryptocurrencies (Bitcoin, Ethereum, Litecoin, Solana, USDT) with instant automated order fulfillment.',
    },
  ];

  return (
    <section id="faq" className="py-24 border-t border-white/[0.06]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase mb-2 block">
            CRAZYR
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Have questions before getting started? Here are answers to the most common inquiries.
          </p>
        </div>

        <div className="space-y-3 text-left">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-surface-100 border border-white/[0.06] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 flex items-center justify-between gap-4 text-left font-medium text-sm text-white hover:text-slate-200 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-red-500' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-white/[0.04] pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
