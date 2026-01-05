import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

// Icons
import {
  Play, Quote, Check, ArrowRight, Star,
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
import ThreePhoneMockup from '@/components/landing/ThreePhoneMockup';

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
      <section className="relative min-h-[90vh] flex items-center pt-20 md:pt-24 pb-12 md:pb-16 overflow-hidden">
        {/* Background removed - clean look */}

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-6 md:gap-16 items-center relative z-10">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              #1 App Mengaji AI di Malaysia
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-[Poppins] font-extrabold leading-[1.1] mb-4 md:mb-8 tracking-tight text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">Mengaji Jadi Mudah</span>
              <br />
              <span className="text-cyan-400 drop-shadow-sm">
                dengan AI Ustaz
              </span>
            </h1>

            <p className="text-base md:text-xl text-slate-300 mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto md:ml-0 font-medium">
              Satu-satunya app dengan <span className="text-cyan-400 font-bold underline decoration-cyan-700">Iqra 1-6 lengkap</span>,
              bimbingan AI 24/7, dan 15+ tool ibadah dalam satu platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {/* Primary CTA */}
              <button
                onClick={onGetStarted}
                className="relative inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-300 overflow-hidden group bg-cyan-600 text-white px-10 py-4 text-base shadow-xl shadow-cyan-600/30 hover:shadow-cyan-600/50 border border-cyan-500"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out skew-x-12"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <Zap size={18} className="fill-current" />
                  Mula Percuma
                </span>
              </button>

              {/* Secondary CTA */}
              <a
                href="#intelligence"
                className="inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-300 px-10 py-4 text-base border border-white/10 text-slate-200 hover:bg-white/5 hover:border-cyan-500/50 gap-2 shadow-sm"
              >
                <Play size={18} className="text-cyan-400" />
                Tonton Demo
              </a>
            </div>

            <div className="mt-12 flex items-center gap-4 text-xs font-mono text-slate-500 justify-center md:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0c224b] bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                    {i * 2}k
                  </div>
                ))}
              </div>
              <p className="font-semibold text-slate-400">Dipercayai 50,000+ Keluarga Muslim</p>
            </div>
          </motion.div>

          {/* PREMIUM HERO VISUAL - 3 Floating iPhone Mockups */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className="relative flex items-center justify-center mt-10 md:mt-0"
          >
            {/* Scale down on mobile to prevent overflow */}
            <div className="transform scale-75 md:scale-100 origin-center">
              <ThreePhoneMockup />
            </div>
          </motion.div>
        </div>
      </section>

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