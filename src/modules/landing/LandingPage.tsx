import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

// Assets
// Using the uploaded logo-primary.jpg as the main visual anchor
// Note: In a real scenario, this should ideally be a transparent PNG, but we'll style it to blend.

// Icons
import {
  Play, Quote, Check, ArrowRight, Star,
  Smartphone, Globe, Palette, Zap, Cpu, Heart,
  BrainCircuit, ShieldCheck, Layers, BookOpen
} from 'lucide-react';

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

  // Theme Colors (Derived from image)
  const colors = {
    dark: "#0A1E42",     // Deep Navy Blue
    cyan: "#00BFFF",     // Electric Cyan
    sky: "#87CEEB",      // Sky Blue Highlight
    medium: "#1E3A5F",   // Medium Blue Shadow
    white: "#FFFFFF"
  };

  return (
    <div className="min-h-screen bg-[#0A1E42] text-white font-sans overflow-x-hidden selection:bg-[#00BFFF] selection:text-[#0A1E42]">

      {/* 1. NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A1E42]/90 backdrop-blur-lg border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/logo-primary.png" alt="Logo" className="w-16 h-16 object-contain scale-110 transition-transform hover:scale-125" />
            <span className="font-bold text-xl tracking-tight hidden sm:block font-[Montserrat]">Quran<span className="text-[#00BFFF]">Pulse</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-[#00BFFF] transition-colors relative group">Features<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00BFFF] transition-all group-hover:w-full"></span></a>
            <a href="#intelligence" className="hover:text-[#00BFFF] transition-colors relative group">Intelligence<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00BFFF] transition-all group-hover:w-full"></span></a>
            <a href="#testimonials" className="hover:text-[#00BFFF] transition-colors relative group">Testimonials<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00BFFF] transition-all group-hover:w-full"></span></a>
            <a href="#pricing" className="hover:text-[#00BFFF] transition-colors relative group">Pricing<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00BFFF] transition-all group-hover:w-full"></span></a>
          </div>
          <button
            onClick={onGetStarted}
            className="relative inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-95 overflow-hidden group bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] border border-cyan-400/50 px-6 py-2.5 text-sm rounded-full bg-[#00BFFF] hover:bg-[#00BFFF]/80 text-[#0A1E42] font-bold px-6 shadow-[0_0_20px_rgba(0,191,255,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
            <span className="relative z-10">Launch App</span>
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden perspective-container">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-[#1E3A5F]/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#00BFFF]/10 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4"></div>
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 animate-noise"></div>
          {/* Neon Ribbons (New) */}
          <div className="absolute top-10 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00BFFF]/30 to-transparent blur-md"></div>
          <div className="absolute bottom-20 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00BFFF]/20 to-transparent blur-md rotate-3"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="preserve-3d"
          >
            <div className="inline-block px-4 py-1 rounded-full bg-[#1E3A5F]/50 border border-[#00BFFF]/30 text-[#00BFFF] text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm neon-border-cyan">
              Dimensi Baru Ketaqwaan Digital
            </div>
            <h1 className="text-5xl md:text-7xl font-[Montserrat] font-extrabold leading-tight mb-6 tracking-tight">
              Teknologi untuk <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] via-[#87CEEB] to-[#ffffff] animate-shimmer-fast bg-[length:200%_auto]">
                Taqwa & Syukur
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl font-light">
              "Menjadi aplikasi super-Islamik pilihan ummah. Menghubungkan hati dengan pencipta melalui <span className="text-[#00BFFF] font-semibold">AI Generasi Baharu</span>."
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGetStarted}
                className="px-8 py-4 bg-[#00BFFF] text-[#0A1E42] font-bold rounded-2xl shadow-[0_0_20px_rgba(0,191,255,0.4)] flex items-center gap-3 relative overflow-hidden group neon-box-pulse"
              >
                <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out skew-x-12"></div>
                <Play className="fill-current w-5 h-5 relative z-10" />
                <span className="relative z-10">Enter the Pulse</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, borderColor: '#00BFFF', color: '#00BFFF' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-2xl backdrop-blur-sm transition-colors glass-premium"
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>

          {/* Visual Anchor (Levitating 3D Phone Concept) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative flex items-center justify-center p-10 perspective-1000"
          >
            {/* 3D Glass Card Container */}
            <div className="relative w-full aspect-[4/5] max-w-[400px] rounded-[3rem] bg-gradient-to-br from-[#1E3A5F]/20 to-[#0A1E42]/60 backdrop-blur-2xl border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden rotate-3d-hover levitate glass-premium group neon-border-cyan">

              {/* Inner Glow Mesh */}
              <div className="absolute inset-0 bg-gradient-radial from-[#00BFFF]/20 via-transparent to-transparent opacity-50 text-center"></div>

              {/* The Logo Image (Acting as Screen Content) */}
              <motion.img
                src="/logo-primary.png"
                alt="QuranPulse Logo"
                className="w-48 h-48 object-contain drop-shadow-[0_0_30px_rgba(0,191,255,0.6)] z-10"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Holographic Overlays */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#00BFFF]/10 to-transparent"></div>

              {/* Floating Badge 1 (Top Right) */}
              <motion.div
                className="absolute top-8 right-8 bg-[#0A1E42]/80 backdrop-blur-md p-3 rounded-xl border border-[#00BFFF]/30 shadow-xl z-20"
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <div className="text-xs font-bold text-white">AI Active</div>
                </div>
              </motion.div>

              {/* Floating Badge 2 (Bottom Left) */}
              <motion.div
                className="absolute bottom-8 left-8 glass-premium p-4 rounded-2xl z-20"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
              >
                <div className="text-xs text-slate-300 uppercase tracking-widest mb-1">Status</div>
                <div className="text-[#00BFFF] font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Online
                </div>
              </motion.div>

            </div>

            {/* Floor Reflection */}
            <div className="absolute -bottom-10 w-[80%] h-4 bg-[#00BFFF] blur-2xl opacity-30 rounded-[100%]"></div>
          </motion.div>
        </div>
      </section>

      {/* 2.5 PHILOSOPHY SECTION (Premium Glass) */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-[#00BFFF] font-bold tracking-[0.5em] uppercase mb-4 text-sm">Falsafah Kami</h2>
          <h3 className="text-4xl md:text-5xl font-[Montserrat] font-bold text-white mb-16">Kerangka Ulul Albab</h3>

          <div className="grid md:grid-cols-3 gap-8 perspective-container">
            {[
              { icon: Heart, title: "Heartware", desc: "Kompas dalaman dan penapis moral. Memastikan teknologi digunakan dengan niat yang lurus." },
              { icon: BrainCircuit, title: "Fikr & Zikir", desc: "Penyatuan pemikiran kritis (Fikr) dan ingatan kepada Allah (Zikir) dalam setiap interaksi." },
              { icon: Globe, title: "Iqra' & Al-Qalam", desc: "Mudemokrasikan ilmu melalui 'Pena Digital' (AI) untuk melahirkan masyarakat berhikmah." }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10, rotateX: 5 }}
                className="glass-premium p-10 rounded-3xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00BFFF]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#00BFFF]/10 transition-colors"></div>
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#1E3A5F] to-transparent rounded-2xl flex items-center justify-center mb-6 text-[#00BFFF] shadow-lg border border-white/5">
                  <item.icon className="w-8 h-8 drop-shadow-[0_0_10px_rgba(0,191,255,0.5)]" />
                </div>
                <h4 className="text-xl font-bold mb-4 font-heading">{item.title}</h4>
                <p className="text-slate-400 font-light leading-relaxed group-hover:text-slate-200 transition-colors">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE ECOSYSTEM (Was Services) */}
      <section id="features" className="py-32 bg-[#050b18] relative">
        {/* Ambient Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#00BFFF]/5 to-transparent blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-[#00BFFF] font-bold tracking-[0.5em] uppercase mb-4 text-sm">Core Modules</h2>
            <h3 className="text-4xl md:text-6xl font-[Montserrat] font-bold text-white mb-6">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#ffffff]">Ecosystem</span></h3>
            <p className="text-slate-400 max-w-2xl mx-auto">Satu platform integrasi untuk gaya hidup Muslim moden, dikuasakan oleh kecerdasan buatan dan reka bentuk futuristik.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Iqra Digital", desc: "Perpustakaan 3D interaktif. Transformasi Data → Maklumat → Ilmu → Hikmah.", color: "#00BFFF" },
              { icon: ShieldCheck, title: "Ustaz AI (Safe)", desc: "Enjin fatwa hibrid. Berpegang teguh kepada Mazhab Syafi'i dengan semakan ketat.", color: "#10B981" },
              { icon: Layers, title: "Prinsip MADANI", desc: "Reka bentuk mampan yang memupuk kesejahteraan dan ihsan dalam komuniti.", color: "#FBBF24" },
              { icon: Smartphone, title: "Smart Deen Hub", desc: "Pusat arahan ibadah: Waktu Solat tepat, Arah Kiblat AR, dan Integrasi Masjid.", color: "#87CEEB" },
              { icon: Palette, title: "Immersive Reader", desc: "Antaramuka 'Glassmorphism' dengan tipografi premium untuk fokus yang mendalam.", color: "#EC4899" },
              { icon: Cpu, title: "Supabase Power", desc: "Infrastruktur 'Edge' pantas untuk pengalaman tanpa lengah (Zero Latency).", color: "#6366F1" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2rem] bg-[#0A1E42]/40 backdrop-blur-sm border border-white/5 hover:border-[#00BFFF]/50 hover:bg-[#1E3A5F]/40 transition-all group relative overflow-hidden"
                style={{ '--feature-color': feature.color } as React.CSSProperties}
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--feature-color)]/0 to-[var(--feature-color)]/0 group-hover:from-[var(--feature-color)]/10 group-hover:to-transparent transition-all duration-500"></div>

                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-[var(--feature-color)] border border-white/5 group-hover:border-[var(--feature-color)]/30 transition-colors shadow-lg">
                  <feature.icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                </div>

                <h4 className="text-xl font-bold mb-3 font-[Montserrat] text-white group-hover:text-[var(--feature-color)] transition-colors">{feature.title}</h4>
                <p className="text-slate-400 leading-relaxed font-light group-hover:text-slate-300">{feature.desc}</p>

                <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 text-[var(--feature-color)]">
                  Explore Module <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS */}
      <section id="testimonials" className="py-24 relative overflow-hidden">
        {/* BG Decoration */}
        <div className="absolute top-1/2 left-0 w-full h-[500px] bg-[#00BFFF]/5 -skew-y-3 -translate-y-1/2 z-0"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-[#00BFFF] font-bold tracking-widest uppercase mb-4">Trusted By Community</h2>
              <h3 className="text-4xl font-[Montserrat] font-bold text-white">Voices of the Ummah</h3>
            </div>
            <div className="flex gap-4">
              <button aria-label="Previous Testimonial" className="w-12 h-12 rounded-full border border-white/10 hover:bg-white/10 flex items-center justify-center transition-colors">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <button aria-label="Next Testimonial" className="w-12 h-12 rounded-full bg-[#00BFFF] text-[#0A1E42] hover:bg-[#87CEEB] flex items-center justify-center transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, i) => (
              <motion.div
                key={i}
                className="bg-[#1E3A5F]/20 backdrop-blur-md p-8 rounded-3xl border border-white/5"
              >
                <div className="flex gap-1 text-amber-400 mb-6">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                </div>
                <Quote className="w-8 h-8 text-[#00BFFF]/30 mb-4" />
                <p className="text-slate-300 mb-6 leading-relaxed">
                  "This app completely transformed how I learn Quran. The AI feedback is spot on and the design is just beautiful."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-700"></div>
                  <div>
                    <div className="font-bold text-white">Ahmad Z.</div>
                    <div className="text-xs text-slate-500">Student</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRICING aka INFAQ */}
      <section id="pricing" className="py-24 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[#00BFFF] font-bold tracking-widest uppercase mb-4">Support The Mission</h2>
            <h3 className="text-4xl font-[Montserrat] font-bold text-white">Infaq Plans</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic */}
            <div className="p-8 rounded-[2rem] bg-[#0A1E42] border border-white/5 flex flex-col items-center text-center">
              <div className="text-xl font-bold text-slate-400 mb-2">Supporter</div>
              <div className="text-4xl font-[Montserrat] font-bold text-white mb-6">$10<span className="text-lg font-normal text-slate-500">/mo</span></div>
              <ul className="w-full space-y-4 mb-8 text-left">
                {['Support Server Costs', 'Unlock Digital Badge', 'Ad-Free Experience'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Check className="w-3 h-3" /></div>
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full rounded-2xl border-white/20 hover:bg-white/5" aria-label="Select Supporter plan">Select Plan</Button>
            </div>

            {/* Pro (Highlighted) */}
            <div className="p-8 rounded-[2rem] bg-gradient-to-b from-[#00BFFF]/20 to-[#0A1E42] border border-[#00BFFF] flex flex-col items-center text-center relative shadow-2xl shadow-[#00BFFF]/10 scale-105 z-10">
              <div className="absolute top-0 -translate-y-1/2 bg-[#00BFFF] text-[#0A1E42] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">Most Popular</div>
              <div className="text-xl font-bold text-[#00BFFF] mb-2">Guardian</div>
              <div className="text-5xl font-[Montserrat] font-bold text-white mb-6">$50<span className="text-lg font-normal text-slate-500">/mo</span></div>
              <ul className="w-full space-y-4 mb-8 text-left">
                {['All Supporter Features', 'Early Access to Beta AI', 'Direct Request Line', 'Family Account (5 Pax)'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-white">
                    <div className="w-5 h-5 rounded-full bg-[#00BFFF] text-[#0A1E42] flex items-center justify-center shrink-0"><Check className="w-3 h-3 font-bold" /></div>
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="w-full rounded-2xl bg-[#00BFFF] text-[#0A1E42] hover:bg-[#00BFFF]/90 font-bold shadow-lg shadow-[#00BFFF]/20" aria-label="Become a Guardian, most popular plan">Become a Guardian</Button>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-[2rem] bg-[#0A1E42] border border-white/5 flex flex-col items-center text-center">
              <div className="text-xl font-bold text-slate-400 mb-2">Visionary</div>
              <div className="text-4xl font-[Montserrat] font-bold text-white mb-6">$200<span className="text-lg font-normal text-slate-500">/mo</span></div>
              <ul className="w-full space-y-4 mb-8 text-left">
                {['All Guardian Features', 'Sponsor Development', 'Dedication in App Credits', 'Custom Feature Request'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Check className="w-3 h-3" /></div>
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full rounded-2xl border-white/20 hover:bg-white/5" aria-label="Contact us for the Visionary plan">Contact Us</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACT / FOOTER */}
      <footer className="bg-[#050b18] pt-24 pb-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl overflow-hidden">
                  <img src="/logo-primary.png" alt="Logo" className="w-full h-full object-cover scale-150" />
                </div>
                <span className="font-bold text-2xl font-[Montserrat]">Quran<span className="text-[#00BFFF]">Pulse</span></span>
              </div>
              <p className="text-slate-400 max-w-sm mb-8">
                Bridging the gap between timeless divine wisdom and modern technology. Join us in building the digital future of the Ummah.
              </p>
              <div className="flex gap-4">
                {['twitter', 'instagram', 'linkedin', 'github'].map(icon => (
                  <a key={icon} href="#" aria-label={`Visit our ${icon} page`} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[#00BFFF] hover:text-[#0A1E42] transition-all">
                    <i className={`fa-brands fa-${icon}`}></i>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Platform</h4>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#" className="hover:text-[#00BFFF]">Pricing</a></li>
                <li><a href="#" className="hover:text-[#00BFFF]">Login</a></li>
                <li><a href="#" className="hover:text-[#00BFFF]">Request Demo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Legal</h4>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#" className="hover:text-[#00BFFF]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#00BFFF]">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#00BFFF]">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
            &copy; 2024 QuranPulse. Dibangunkan dengan prinsip <span className="text-[#00BFFF]">Teknologi untuk Syukur</span>.
            <br className="md:hidden" /> Selaras dengan Aspirasi Malaysia MADANI.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;