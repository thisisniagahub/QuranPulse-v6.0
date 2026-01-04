import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

// Icons
import {
  Play, Quote, Check, ArrowRight, Star,
  Smartphone, Globe, Palette, Zap, Cpu, Heart,
  BrainCircuit, ShieldCheck, Layers, BookOpen
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

  // Scroll Handler
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Design DNA: "Modern Light" (Bright Blue V2)
  const colors = {
    bg: "bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-200",
    primary: "#0891b2",  // Cyan 600
    secondary: "#0d9488", // Teal 600
    text: "#1e293b",     // Slate 800
    glass: "bg-white/70 border border-white/40 backdrop-blur-xl"
  };

  return (
    <div className={`min-h-screen ${colors.bg} text-slate-900 font-sans overflow-x-hidden selection:bg-cyan-200 selection:text-cyan-900 relative`}>
      {/* Global Background Pattern Mask */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#0891b2_1px,transparent_1px),linear-gradient(to_bottom,#0891b2_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* 1. NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/70 backdrop-blur-xl border-b border-cyan-100 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img src="/logo-primary.png" alt="Logo" className="w-14 h-14 object-contain scale-110 relative z-10" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block font-[Montserrat] text-slate-900">Quran<span className="text-cyan-600">Pulse</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            {[
              { label: 'Ekosistem', href: 'features' },
              { label: 'AI Ustaz', href: 'intelligence' },
              { label: 'Testimoni', href: 'testimonials' },
              { label: 'Harga', href: 'pricing' }
            ].map((item) => (
              <a
                key={item.href}
                href={`#${item.href}`}
                className="hover:text-cyan-600 transition-colors relative group"
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
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
          <button
            onClick={onGetStarted}
            className="relative inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-300 disabled:opacity-50 active:scale-95 overflow-hidden group bg-cyan-600 text-white px-5 py-2 text-sm shadow-lg shadow-cyan-600/20 hover:shadow-cyan-600/40 border border-cyan-500"
          >
            <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out skew-x-12"></div>
            <span className="relative z-10 flex items-center gap-2"><Zap size={14} className="fill-current" /> Launch App</span>
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden">
        {/* Background removed - clean look */}

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse"></span>
              #1 App Mengaji AI di Malaysia
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-[Montserrat] font-extrabold leading-[1.1] mb-6 md:mb-8 tracking-tight text-slate-900">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-600">Mengaji Jadi Mudah</span>
              <br />
              <span className="text-cyan-600 drop-shadow-sm">
                dengan AI Ustaz
              </span>
            </h1>

            <p className="text-base md:text-xl text-slate-600 mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto md:ml-0 font-medium">
              Satu-satunya app dengan <span className="text-cyan-700 font-bold underline decoration-cyan-300">Iqra 1-6 lengkap</span>,
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
                className="inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-300 px-10 py-4 text-base border border-slate-200 text-slate-700 hover:bg-white hover:border-cyan-300 gap-2 shadow-sm"
              >
                <Play size={18} className="text-cyan-600" />
                Tonton Demo
              </a>
            </div>

            <div className="mt-12 flex items-center gap-4 text-xs font-mono text-slate-400 justify-center md:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] text-slate-600 font-bold shadow-sm">
                    {i * 2}k
                  </div>
                ))}
              </div>
              <p className="font-semibold">Dipercayai 50,000+ Keluarga Muslim</p>
            </div>
          </motion.div>

          {/* PREMIUM HERO VISUAL - 3 Floating iPhone Mockups */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className="relative flex items-center justify-center"
          >
            <ThreePhoneMockup />
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