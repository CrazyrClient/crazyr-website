import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import UserModal from './components/UserModal';
import { fetchUserProfile } from './services/authApi';

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 1. Initial cached state
    const savedUser = localStorage.getItem('crazyr_user');
    const token = localStorage.getItem('crazyr_token');

    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {}
    }

    // 2. Fetch live profile from SQLite backend if token exists
    if (token) {
      fetchUserProfile(token)
        .then((liveProfile) => {
          if (liveProfile) {
            setCurrentUser(liveProfile);
            localStorage.setItem('crazyr_user', JSON.stringify(liveProfile));
          } else {
            // Token expired or invalid
            localStorage.removeItem('crazyr_token');
            localStorage.removeItem('crazyr_user');
            setCurrentUser(null);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode === 'register' ? 'register' : 'login');
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('crazyr_user');
    localStorage.removeItem('crazyr_token');
    setCurrentUser(null);
    setUserModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 flex flex-col font-sans selection:bg-red-600/30 selection:text-white">
      {/* Navbar */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        currentUser={currentUser}
        onOpenUserModal={() => setUserModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <Hero onOpenAuth={handleOpenAuth} />
        <Features />
        <Pricing />
        <FAQ />
      </main>

      {/* Footer */}
      <Footer onOpenAuth={handleOpenAuth} />

      {/* Auth Modal (Sign In / Register) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authMode}
      />

      {/* User Account & License Details Modal */}
      <UserModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        user={currentUser}
        onLogout={handleLogout}
        onUserUpdate={(updatedUser) => {
          setCurrentUser(updatedUser);
          if (updatedUser) {
            localStorage.setItem('crazyr_user', JSON.stringify(updatedUser));
          } else {
            localStorage.removeItem('crazyr_user');
          }
        }}
      />
    </div>
  );
}
