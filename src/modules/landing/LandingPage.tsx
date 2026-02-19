import React, { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';

// === Core Sections (eagerly loaded) ===
import { HeroSection } from './components/HeroSection';
import PainTransformation from '../../components/landing/PainTransformation';
import FeatureShowcase from '../../components/landing/FeatureShowcase';
import { AIAgentShowcase } from '@/components/landing/AIAgentShowcase';
import { WhatsAppProactiveSection } from '@/components/landing/WhatsAppProactiveSection';
import PricingTable from '@/components/landing/PricingTable';
import { ComparisonSection } from './components/ComparisonSection';
import { FAQSection } from './components/FAQSection';
import FinalCta from '@/components/landing/FinalCta';
import { WhatsAppButton } from './components/WhatsAppButton';

// === Heavy Sections (lazy loaded) ===
const QwerDemoSection = lazy(() => import('@/components/landing/QwerDemoSection'));
const OpenClawShowcase = lazy(() => import('./components/OpenClawShowcase').then(m => ({ default: m.OpenClawShowcase })));
const PremiumTestimonials = lazy(() => import('./components/PremiumTestimonials').then(m => ({ default: m.PremiumTestimonials })));
const GlowFooter = lazy(() => import('./components/GlowFooter').then(m => ({ default: m.GlowFooter })));

// === Nav Links (DRY — used for both desktop & mobile) ===
const NAV_LINKS = [
  { label: 'Home', href: 'home' },
  { label: 'Ciri-ciri', href: 'features' },
  { label: 'Harga', href: 'pricing' },
  { label: 'Tentang', href: 'about' },
] as const;

const scrollToSection = (id: string, callback?: () => void) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 80;
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
  callback?.();
};

// === Lazy Loader Fallback ===
const SectionFallback = () => (
  <div className="flex items-center justify-center py-32">
    <div className="w-8 h-8 border-2 border-raudhah-teal/30 border-t-raudhah-teal rounded-full animate-spin" />
  </div>
);

// === Scroll Progress Bar ===
const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-raudhah-teal via-raudhah-gold to-raudhah-teal origin-left z-[60]"
      style={{ scaleX }}
    />
  );
};

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen antigravity-mesh text-raudhah-ink font-sans overflow-x-hidden selection:bg-raudhah-teal/10 selection:text-raudhah-teal relative">
      {/* Scroll Progress */}
      <ScrollProgressBar />

      {/* Grain Texture */}
      <div className="grain-texture" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-pattern-grid bg-[size:100px_100px]" />

      {/* ═══════════════════════════════════════════════════
          1. NAVBAR
      ═══════════════════════════════════════════════════ */}
      <nav
        className={`fixed top-[3px] left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-white/90 backdrop-blur-2xl border-b border-raudhah-teal/10 py-3 shadow-xl shadow-raudhah-teal/5'
          : 'bg-transparent py-6'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-raudhah-teal/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <img
                src="/logo-primary.png"
                alt="QuranPulse"
                width={56}
                height={56}
                className="w-14 h-14 object-contain scale-110 relative z-10"
              />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block font-raudhah text-raudhah-teal">
              Quran<span className="text-raudhah-gold">Pulse</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-raudhah-ink/60">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={`#${item.href}`}
                className="hover:text-raudhah-teal transition-colors relative group"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-raudhah-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onGetStarted}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-raudhah-ivory text-raudhah-teal border border-raudhah-teal/20 transition-all hover:bg-raudhah-teal hover:text-white"
            >
              Log Masuk
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
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-b border-raudhah-teal/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 space-y-4">
                {NAV_LINKS.map((item) => (
                  <a
                    key={item.href}
                    href={`#${item.href}`}
                    className="text-lg font-medium text-raudhah-ink/80 hover:text-raudhah-teal py-2 border-b border-raudhah-teal/5"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.href, () => setIsMobileMenuOpen(false));
                    }}
                  >
                    {item.label}
                  </a>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    scrollToSection('pricing', () => setIsMobileMenuOpen(false));
                  }}
                  className="px-6 py-2.5 rounded-xl bg-raudhah-teal text-white font-bold shadow-lg shadow-raudhah-teal/20 hover:scale-105 transition-all"
                >
                  Mula Sekarang
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══════════════════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════════════════ */}
      <main>
        {/* 1. HERO */}
        <div id="home">
          <HeroSection onGetStarted={onGetStarted} spotsLeft={42} />
        </div>

        {/* 2. PAIN → SOLUTION TRANSFORMATION */}
        <div id="about">
          <PainTransformation />
        </div>

        {/* 3. DETAILED FEATURE SHOWCASE */}
        <div id="features">
          <FeatureShowcase />
        </div>

        {/* 4. AI AGENTS — Dark Section */}
        <AIAgentShowcase />

        {/* 5. WHATSAPP PROACTIVE — Killer Feature */}
        <WhatsAppProactiveSection />

        {/* 6. OMNICHANNEL SHOWCASE */}
        <Suspense fallback={<SectionFallback />}>
          <OpenClawShowcase />
        </Suspense>

        {/* 7. Q-WER INTELLIGENCE DEMO */}
        <Suspense fallback={<SectionFallback />}>
          <QwerDemoSection />
        </Suspense>

        {/* 8. COMPARISON — vs Competitors */}
        <ComparisonSection />

        {/* 9. TESTIMONIALS — Premium 3D Cards */}
        <Suspense fallback={<SectionFallback />}>
          <PremiumTestimonials />
        </Suspense>

        {/* 10. PRICING TABLE */}
        <div id="pricing">
          <PricingTable />
        </div>

        {/* 11. FAQ */}
        <FAQSection />

        {/* 12. FINAL CTA */}
        <FinalCta onGetStarted={onGetStarted} />
      </main>

      {/* 13. FOOTER — Premium Glow */}
      <Suspense fallback={<SectionFallback />}>
        <GlowFooter />
      </Suspense>

      {/* FLOATING WHATSAPP */}
      <WhatsAppButton />
    </div>
  );
};

export default LandingPage;
