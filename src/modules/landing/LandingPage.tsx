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
import QwerDemoSection from '@/components/landing/QwerDemoSection';
import FeatureQuickGrid from '../../components/landing/FeatureQuickGrid';
import FeatureShowcase from '../../components/landing/FeatureShowcase';
import PainTransformation from '../../components/landing/PainTransformation';
import FeaturesBento from '../../components/landing/FeaturesBento';
import Testimonials from '@/components/landing/Testimonials';
import PricingTable from '@/components/landing/PricingTable';
import FinalCta from '@/components/landing/FinalCta';
import Footer from '@/components/landing/Footer';
import ParticlesBackground from '@/components/landing/ParticlesBackground';
import { HeroSection } from './components/HeroSection';
import { ComparisonSection } from './components/ComparisonSection';
import { FAQSection } from './components/FAQSection';
import { WhatsAppButton } from './components/WhatsAppButton';
import { OpenClawShowcase } from './components/OpenClawShowcase';

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
    <div className={`min-h-screen antigravity-mesh text-raudhah-ink font-sans overflow-x-hidden selection:bg-raudhah-teal/10 selection:text-raudhah-teal relative`}>
      {/* Global Grain Texture Overlay (The Antigravity Secret) */}
      <div className="grain-texture"></div>

      {/* Static Pattern Overlay (Reduced Opacity for Airiness) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-pattern-grid bg-[size:100px_100px]"></div>

      {/* 1. NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-2xl border-b border-raudhah-teal/10 py-3 shadow-xl shadow-raudhah-teal/5' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative">
              <div className="absolute inset-0 bg-raudhah-teal/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img loading="lazy" src="/logo-primary.png" alt="Logo" className="w-14 h-14 object-contain scale-110 relative z-10" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block font-raudhah text-raudhah-teal">Quran<span className="text-raudhah-gold">Pulse</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-raudhah-ink/60">
            {[
              { label: 'Home', href: 'home' },
              { label: 'Products', href: 'features' },
              { label: 'Pricing', href: 'pricing' },
              { label: 'Ebhat', href: 'ebhat' }
            ].map((item) => (
              <a
                key={item.href}
                href={`#${item.href}`}
                className="hover:text-raudhah-teal transition-colors relative group"
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
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-raudhah-gold transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onGetStarted}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-raudhah-ivory text-raudhah-teal border border-raudhah-teal/20 transition-all hover:bg-raudhah-teal hover:text-white"
            >
              Log In
            </button>
            <button
              onClick={onGetStarted}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-raudhah-teal text-white shadow-lg shadow-raudhah-teal/20 transition-all hover:scale-[1.05]"
            >
              Mula Sekarang
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-raudhah-ink p-2"
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
              className="md:hidden bg-white/95 backdrop-blur-xl border-b border-raudhah-teal/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 space-y-4">
                {[
                  { label: 'Home', href: 'home' },
                  { label: 'Products', href: 'features' },
                  { label: 'Pricing', href: 'pricing' },
                  { label: 'Ebhat', href: 'ebhat' }
                ].map((item) => (
                  <a
                    key={item.href}
                    href={`#${item.href}`}
                    className="text-lg font-medium text-raudhah-ink/80 hover:text-raudhah-teal py-2 border-b border-raudhah-teal/5"
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
                  type="button"
                  onClick={() => {
                    const element = document.getElementById('pricing');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl bg-raudhah-gold text-white font-bold shadow-lg shadow-raudhah-gold/20 hover:scale-105 transition-all"
                >
                  Mulai Mengaji Sekarang
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. HERO SECTION */}
      <HeroSection onGetStarted={onGetStarted} spotsLeft={42} />

      {/* 3. FEATURE QUICK GRID */}
      <FeatureQuickGrid />

      {/* 4. PAIN TRANSFORMATION (The "WOW" Factor Problem Solver) */}
      <PainTransformation />

      {/* 5. DETAILED FEATURE SHOWCASE (Actual Design) - Tafsir, Hafalan, Komuniti */}
      <FeatureShowcase />

      {/* 6. FEATURES BENTO GRID - The Solution */}
      <FeaturesBento />

      {/* 6B. OPENCLAW SHOWCASE - The Omnichannel WOW Factor */}
      <OpenClawShowcase />

      {/* 7. Q-WER INTELLIGENCE DEMO */}
      <QwerDemoSection />

      {/* 7. COMPARISON - vs Competitors */}
      <ComparisonSection />

      {/* 8. TESTIMONIALS - Social Proof */}
      <Testimonials />

      {/* 9. PRICING TABLE (RM) */}
      <PricingTable />

      {/* 10. FAQ - Handle Objections */}
      <FAQSection />

      {/* 11. FINAL CTA */}
      <FinalCta onGetStarted={onGetStarted} />

      {/* 12. FOOTER */}
      <Footer />

      {/* FLOATING WHATSAPP BUTTON */}
      <WhatsAppButton />

    </div>
  );
};

export default LandingPage;
