import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PulseWave, Starfield } from './components/BackgroundElements';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AdvancedTools } from './components/AdvancedTools';
import { FloatingOrbs } from './components/FloatingOrbs';
import { AnimatedStats } from './components/AnimatedStats';
import { ComparisonSection } from './components/ComparisonSection';
import { GlowFooter } from './components/GlowFooter';

// New Components
import { HeroSection } from './components/HeroSection';
import { BentoGridFeatures } from './components/BentoGridFeatures';
import { TrustSection } from './components/TrustSection';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [spotsLeft, setSpotsLeft] = useState(47);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  // Fake live counter to create urgency
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsLeft((prev) => (prev > 12 ? prev - 1 : 12)); // Stops at 12
    }, 45000); // Decreases every 45 seconds
    return () => clearInterval(interval);
  }, []);

  // Sticky CTA Logic
  useEffect(() => {
      const handleScroll = () => {
          if (window.scrollY > 600) {
              setShowStickyCTA(true);
          } else {
              setShowStickyCTA(false);
          }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-100 flex flex-col">
      
      {/* --- BACKGROUND ATMOSPHERE --- */}
      <div className="landing-bg fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#050505] to-[#000000] z-0"></div>
      <FloatingOrbs />
      <PulseWave />
      <Starfield />
      <div className="landing-bg fixed top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent blur-[120px] animate-aurora z-0 pointer-events-none mix-blend-screen"></div>
      <div className="landing-bg fixed inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 mix-blend-overlay pointer-events-none"></div>
      
      {/* --- NAVBAR --- */}
      <nav className="relative z-50 px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-800 to-black rounded-xl border border-white/10 flex items-center justify-center shadow-lg shadow-cyan-900/20 group cursor-pointer overflow-hidden relative">
                <img src="/logo-full.png" alt="QP" className="w-full h-full object-contain p-1 relative z-10" />
                <div className="absolute inset-0 bg-cyan-500/20 blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
            </div>
            <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-200">QuranPulse</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
              <a href="#mission" className="hover:text-white transition-colors">Mission</a>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#premium" className="hover:text-white transition-colors">Premium</a>
          </div>

          <button 
            onClick={onGetStarted}
            className="group relative px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden transition-all hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shimmer"></div>
              <span className="relative flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">
                  <i className="fa-solid fa-right-to-bracket"></i>
                  <span className="hidden sm:inline">Member</span> Login
              </span>
          </button>
      </nav>

      {/* --- NEW HERO SECTION --- */}
      <HeroSection onGetStarted={onGetStarted} spotsLeft={spotsLeft} />

      {/* --- ANIMATED STATS SECTION --- */}
      <AnimatedStats />

      {/* --- BENTO GRID FEATURES --- */}
      <div id="features">
         <BentoGridFeatures />
      </div>

      {/* --- TRUST SECTION --- */}
      <TrustSection />

      {/* --- COMPARISON SECTION --- */}
      <div id="premium">
         <ComparisonSection />
      </div>

      {/* --- ADVANCED TOOLS --- */}
      <AdvancedTools />

      {/* --- GLOW FOOTER --- */}
      <GlowFooter />
      
      {/* Sticky CTA */}
      <AnimatePresence>
          {showStickyCTA && (
              <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  className="fixed bottom-6 left-6 right-6 z-40 flex justify-center pointer-events-none"
              >
                  <button 
                      onClick={onGetStarted}
                      className="pointer-events-auto px-8 py-3 bg-cyan-600 text-white font-bold rounded-full shadow-2xl shadow-cyan-500/20 hover:bg-cyan-500 transition-colors flex items-center gap-2"
                  >
                      <span>Join Genesis Batch</span>
                      <i className="fa-solid fa-arrow-right"></i>
                  </button>
              </motion.div>
          )}
      </AnimatePresence>

      <WhatsAppButton />
    </div>
  );
};

export default LandingPage;