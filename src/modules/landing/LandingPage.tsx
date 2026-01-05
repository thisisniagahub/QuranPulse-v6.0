import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

// Icons
import {
  Quote, Check, ArrowRight, Star,
  Smartphone, Globe, Palette, Zap, Cpu, Heart,
  BrainCircuit, ShieldCheck, Layers, BookOpen, Menu, X
} from 'lucide-react';
import { AppStoreButton, GooglePlayButton } from '@/components/DownloadButtons';
import QwerDemoSection from '@/components/landing/QwerDemoSection';
import TrustBar from '@/components/landing/TrustBar';
import FeaturesBento from '@/components/landing/FeaturesBento';
import Testimonials from '@/components/landing/Testimonials';
import PricingTable from '@/components/landing/PricingTable';
import FinalCta from '@/components/landing/FinalCta';
import Footer from '@/components/landing/Footer';
import ParticlesBackground from '@/components/landing/ParticlesBackground';
import { NumberCounter } from '@/components/landing/TextAnimations';
import { ShimmerButton } from '@/components/landing/PremiumEffects';
import { HeroSection } from './components/HeroSection';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll Handler
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen bg-midnight-gradient text-white font-sans overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200 relative`}>
      {/* Global Background Pattern Mask */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[url('/assets/patterns/cyber-islamic-grid.svg')] bg-[size:60px_60px]"></div>

      {/* 1. NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0c224b]/80 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img src="/logo-primary.png" alt="Logo" className="w-14 h-14 object-contain scale-110 relative z-10" />     
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block font-[Poppins] text-white">Quran<span className="text-cyan-400">Pulse</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
            {[
              { label: 'Ekosistem', href: 'features' },
              { label: 'AI Ustaz', href: 'intelligence' },
              { label: 'Testimoni', href: 'testimonials' },
              { label: 'Harga', href: 'pricing' }
            ].map((item) => (
              <a
                key={item.href}
                href={`#${item.href}`}
                className="hover:text-cyan-400 transition-colors relative group"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.href);
                  if (element) {
                    const offset = 80; // navbar height
                    const top = element.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                  }
                }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onGetStarted}
              className="relative inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-300 disabled:opacity-50 active:scale-95 overflow-hidden group bg-cyan-600 text-white px-5 py-2 text-sm shadow-lg shadow-cyan-600/20 hover:shadow-cyan-600/40 border border-cyan-500"
            >
              <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out skew-x-12"></div>
              <span className="relative z-10 flex items-center gap-2"><Zap size={14} className="fill-current" /> Launch App</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0c224b]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 space-y-4">
                {[
                  { label: 'Ekosistem', href: 'features' },
                  { label: 'AI Ustaz', href: 'intelligence' },
                  { label: 'Testimoni', href: 'testimonials' },
                  { label: 'Harga', href: 'pricing' }
                ].map((item) => (
                  <a
                    key={item.href}
                    href={`#${item.href}`}
                    className="text-lg font-medium text-slate-300 hover:text-cyan-400 py-2 border-b border-white/5"       
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      const element = document.getElementById(item.href);
                      if (element) {
                        const offset = 80;
                        const top = element.getBoundingClientRect().top + window.scrollY - offset;
                        window.scrollTo({ top, behavior: 'smooth' });
                      }
                    }}
                  >
                    {item.label}
                  </a>
                ))}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onGetStarted();
                  }}
                  className="w-full mt-4 bg-cyan-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-600/20"   
                >
                  Launch App
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. HERO SECTION */}
      <HeroSection onGetStarted={onGetStarted} spotsLeft={42} />

      {/* TRUST BAR - Social Proof */}
      <TrustBar />

      {/* FEATURES BENTO GRID */}
      <FeaturesBento />

      {/* Q-WER INTELLIGENCE DEMO */}
      <QwerDemoSection />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* PRICING TABLE (RM) */}
      <PricingTable />

      {/* FINAL CTA */}
      <FinalCta onGetStarted={onGetStarted} />

      {/* FOOTER */}
      <Footer />

    </div>
  );
};

export default LandingPage;