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

  // Design DNA: "Noor-e-Cyber" Palette
  const colors = {
    bg: "#020617",       // Midnight Blue
    primary: "#22d3ee",  // Electric Cyan
    secondary: "#14b8a6", // Teal
    text: "#ffffff",
    glass: "bg-white/5 border border-white/10 backdrop-blur-md"
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans overflow-x-hidden selection:bg-[#22d3ee] selection:text-[#020617]">

      {/* 1. NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img src="/logo-primary.png" alt="Logo" className="w-14 h-14 object-contain scale-110 relative z-10" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block font-[Montserrat]">Quran<span className="text-[#22d3ee]">Pulse</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            {[
              { label: 'Ekosistem', href: 'features' },
              { label: 'AI Ustaz', href: 'intelligence' },
              { label: 'Testimoni', href: 'testimonials' },
              { label: 'Harga', href: 'pricing' }
            ].map((item) => (
              <a
                key={item.href}
                href={`#${item.href}`}
                className="hover:text-[#22d3ee] transition-colors relative group"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.href);
                  if (element) {
                    const offset = 100; // navbar height + padding
                    const top = element.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                  }
                }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#22d3ee] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
          <button
            onClick={onGetStarted}
            className="relative inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-300 disabled:opacity-50 active:scale-95 overflow-hidden group bg-[#22d3ee] text-[#020617] px-6 py-2.5 text-sm shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_35px_rgba(34,211,238,0.5)] border border-cyan-300/50"
          >
            <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out skew-x-12"></div>
            <span className="relative z-10 flex items-center gap-2"><Zap size={14} className="fill-current" /> Launch App</span>
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden perspective-container">
        {/* PARTICLE NETWORK ANIMATION - MagicUI style */}
        <ParticlesBackground particleCount={60} speed={0.3} />

        {/* Deep Lighting Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#22d3ee]/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 mix-blend-screen"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#14b8a6]/10 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4 mix-blend-screen"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

          {/* Aesthetic Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#22d3ee] text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md shadow-lg shadow-cyan-900/20">
              <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse"></span>
              App Mengaji AI Pertama Malaysia
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-[Montserrat] font-extrabold leading-[1.1] mb-8 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">Mengaji Jadi Mudah</span>
              <br />
              <span className="text-[#22d3ee] drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                dengan AI Ustaz
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-xl font-light">
              Satu-satunya app dengan <span className="text-[#22d3ee] font-semibold">Iqra 1-6 lengkap</span>,
              bimbingan AI 24/7, dan 15+ tool ibadah dalam satu platform.
              <span className="text-amber-400 font-semibold"> Dibina khas untuk Muslim Malaysia.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Primary CTA */}
              <button
                onClick={onGetStarted}
                className="relative inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-300 overflow-hidden group bg-[#22d3ee] text-[#020617] px-8 py-4 text-base shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_50px_rgba(34,211,238,0.6)] border border-cyan-300/50"
              >
                <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out skew-x-12"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <Zap size={18} className="fill-current" />
                  Mula Percuma
                </span>
              </button>

              {/* Secondary CTA */}
              <a
                href="#intelligence"
                className="inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-300 px-8 py-4 text-base border border-white/20 text-white hover:bg-white/10 hover:border-white/40 gap-2"
              >
                <Play size={18} />
                Tonton Demo
              </a>
            </div>

            <div className="mt-12 flex items-center gap-4 text-xs font-mono text-slate-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border border-[#020617] bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold">
                    {i * 2}k
                  </div>
                ))}
              </div>
              <p>Dipercayai 50,000+ Keluarga Muslim</p>
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