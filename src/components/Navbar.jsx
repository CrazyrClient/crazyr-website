import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, User, LogOut, Key } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Navbar({ onOpenAuth, currentUser, onOpenUserModal, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Access', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  const getTierDisplay = (tier) => {
    if (!tier) return 'Member';
    const t = tier.toLowerCase();
    if (t.includes('lifetime')) return 'Lifetime';
    if (t.includes('1m') || t.includes('booster')) return 'Booster 30D';
    if (t.includes('admin')) return 'Admin';
    return 'Member';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#08090D]/95 backdrop-blur-md border-b border-white/[0.08] py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2.5 group text-decoration-none">
            <img
              src={logoImg}
              alt="CRAZYR Logo"
              className="w-8 h-8 rounded-lg object-contain shadow-sm group-hover:scale-105 transition-transform"
            />
            <span className="font-black text-xl tracking-tight text-white uppercase">
              CRAZYR
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs uppercase tracking-wider font-semibold text-slate-400 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="https://discord.gg/8BH7TBYKEz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-wider font-semibold text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1.5"
            >
              <span>Discord</span>
            </a>
          </nav>

          {/* User & CTA Area */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={onOpenUserModal}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141722] hover:bg-[#1A1E2C] border border-white/[0.08] text-xs transition-colors group cursor-pointer"
                  title="View Account & License Details"
                >
                  <User className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200">{currentUser.username || currentUser.user}</span>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {getTierDisplay(currentUser.tier)}
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#141722] transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white transition-colors px-2 py-1"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors px-2 py-1"
                >
                  Register
                </button>
              </div>
            )}

            <a
              href="https://discord.gg/8BH7TBYKEz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Boost to Unlock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#141722] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-5 rounded-xl bg-[#0E1017] border border-white/[0.08] space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-slate-300 hover:text-white py-1.5"
              >
                {link.name}
              </a>
            ))}
            <a
              href="https://discord.gg/8BH7TBYKEz"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm font-medium text-red-400 py-1.5"
            >
              Discord Server
            </a>
            <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-2">
              {currentUser ? (
                <div className="flex items-center justify-between text-xs py-1 text-slate-300">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenUserModal) onOpenUserModal();
                    }}
                    className="flex items-center gap-1.5 font-medium text-white hover:text-red-400"
                  >
                    <User className="w-3.5 h-3.5 text-red-500" />
                    <span>{currentUser.username || currentUser.user}</span>
                  </button>
                  <button onClick={onLogout} className="text-rose-400 font-medium">Logout</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                    className="flex-1 text-center text-xs font-medium text-slate-300 py-2 rounded-lg bg-[#141722]"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { onOpenAuth('register'); setMobileMenuOpen(false); }}
                    className="flex-1 text-center text-xs font-medium text-red-400 py-2 rounded-lg bg-[#141722]"
                  >
                    Register
                  </button>
                </div>
              )}
              <a
                href="https://discord.gg/8BH7TBYKEz"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-xs font-semibold text-white bg-red-600 hover:bg-red-700 py-2.5 rounded-lg transition-colors"
              >
                Boost Discord Server
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
