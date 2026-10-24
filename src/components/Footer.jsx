import React from 'react';
import { Disc as Discord } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Footer({ onOpenAuth, onOpenLegal }) {
  return (
    <footer className="border-t border-white/[0.06] bg-[#07080B] pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 text-left">
          {/* Brand Info with Logo */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src={logoImg}
                alt="CRAZYR"
                className="w-7 h-7 rounded-lg object-contain"
              />
              <span className="font-extrabold text-xl tracking-tight text-white uppercase">
                CRAZYR
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The premier Minecraft ghost combat utility. Engineered for competitive players who demand sub-tick responsiveness, GCD sensitivity accuracy, and total peace of mind.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#features" className="hover:text-red-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-red-400 transition-colors">
                  Get Access (Boost)
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-red-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Community & Legal */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Community &amp; Support
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a
                  href="https://discord.gg/8BH7TBYKEz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 transition-colors flex items-center gap-2"
                >
                  <Discord className="w-4 h-4 text-[#5865F2]" />
                  <span>Discord Community</span>
                </a>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  Account Login / Register
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal && onOpenLegal('tos')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal && onOpenLegal('privacy')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Crazyr. All rights reserved.
          </div>
          <div className="text-xs text-slate-500">
            Undetected Competitive Ghost Client
          </div>
        </div>
      </div>
    </footer>
  );
}
