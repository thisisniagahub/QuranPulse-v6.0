import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface LandingPageProps {
  onGetStarted: () => void;
}

// --- ASSETS: STORE BADGES (SVG) ---
const AppStoreBadge = () => (
  <svg className="h-10 sm:h-12 w-auto cursor-pointer hover:scale-105 transition-transform" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="40" rx="8" fill="black"/>
    <path d="M26.9 19.8C26.9 16.5 29.7 14.8 29.8 14.7C27.7 11.7 24.5 11.6 23.4 11.6C20.7 11.3 18.1 13.2 16.7 13.2C15.3 13.2 13.2 11.6 10.9 11.6C8 11.6 5.3 13.3 3.9 15.8C1 20.8 3.2 28.2 6 32.3C7.4 34.3 9 36.5 11.3 36.4C13.5 36.3 14.3 35 17 35C19.6 35 20.4 36.4 22.7 36.4C25.1 36.4 26.6 34.2 28 32.2C29.6 29.8 30.3 27.5 30.3 27.4C30.3 27.3 25.9 25.6 25.9 20.7C25.9 19.8 26.9 19.8 26.9 19.8Z" fill="white"/>
    <path d="M22.3 9.4C23.5 8 24.3 6 24.1 4C22.3 4.1 20.1 5.2 18.8 6.7C17.7 8 16.8 10 17.1 11.9C19 12.1 21.1 10.9 22.3 9.4Z" fill="white"/>
    <text x="40" y="26" fill="white" fontSize="14" fontFamily="sans-serif" fontWeight="bold">App Store</text>
    <text x="40" y="14" fill="#ccc" fontSize="8" fontFamily="sans-serif">Download on the</text>
  </svg>
);

const PlayStoreBadge = () => (
  <svg className="h-10 sm:h-12 w-auto cursor-pointer hover:scale-105 transition-transform" viewBox="0 0 135 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="135" height="40" rx="8" fill="black"/>
    <path d="M26.5 20.2L9.8 3.5C9.4 3.1 8.8 3.2 8.5 3.7L20.5 26.2L26.5 20.2Z" fill="#00F076"/>
    <path d="M26.5 20.2L20.5 14.2L8.5 36.7C8.8 37.2 9.4 37.3 9.8 36.9L26.5 20.2Z" fill="#FF3D00"/>
    <path d="M26.5 20.2L20.5 26.2L20.5 14.2L26.5 20.2Z" fill="#FFC107"/>
    <path d="M26.5 20.2L9.8 36.9C9.4 37.3 8.8 37.2 8.5 36.7V3.7C8.8 3.2 9.4 3.1 9.8 3.5L26.5 20.2Z" fill="#2196F3"/>
    <text x="40" y="26" fill="white" fontSize="14" fontFamily="sans-serif" fontWeight="bold">Google Play</text>
    <text x="40" y="14" fill="#ccc" fontSize="8" fontFamily="sans-serif">GET IT ON</text>
  </svg>
);

// --- PULSE WAVE VECTOR ---
const PulseWave = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-30">
    <svg viewBox="0 0 1440 320" className="w-full h-full absolute top-1/4 scale-150 opacity-50">
      <motion.path
        fill="none"
        stroke="url(#pulse-gradient)"
        strokeWidth="2"
        d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,90.7C960,85,1056,139,1152,154.7C1248,171,1344,149,1392,138.7L1440,128"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1, pathOffset: [0, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <defs>
        <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(6, 182, 212, 0)" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// --- STARFIELD BACKGROUND ---
const Starfield = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white rounded-full opacity-0"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        scale: Math.random() * 0.5 + 0.5,
                        opacity: Math.random() * 0.5 + 0.1
                    }}
                    animate={{
                        y: [null, Math.random() * window.innerHeight],
                        opacity: [null, Math.random() * 0.5 + 0.1, 0]
                    }}
                    transition={{
                        duration: Math.random() * 20 + 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        width: Math.random() * 2 + 1 + 'px',
                        height: Math.random() * 2 + 1 + 'px',
                    }}
                />
            ))}
        </div>
    );
};

// --- 3D TILT CARD COMPONENT ---
const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;
        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`perspective-1000 ${className}`}
        >
            <div style={{ transform: "translateZ(20px)" }} className="h-full">
                {children}
            </div>
        </motion.div>
    );
};

// --- WHATSAPP PULSE BUTTON ---
const WhatsAppButton = () => (
    <motion.a
        href="https://wa.me/601155559999?text=Salam%20Team%20QuranPulse,%20I'm%20interested%20in%20the%20Genesis%20Batch."
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,211,102,0.5)] cursor-pointer group"
    >
        {/* Lighting Pulse Animation */}
        <div className="absolute inset-0 rounded-full border-2 border-[#25D366] opacity-0 animate-ping-slow"></div>
        <div className="absolute inset-0 rounded-full border border-[#25D366] opacity-0 animate-ping delay-75"></div>
        
        <i className="fa-brands fa-whatsapp text-2xl sm:text-3xl text-white z-10"></i>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 bg-white text-black px-3 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
            Chat with Us
        </div>
    </motion.a>
);

// --- BUSINESS PROPOSAL SECTION ---
const BusinessSection = () => (
    <section id="business" className="py-20 bg-gradient-to-b from-black to-slate-900 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="bg-gradient-to-r from-slate-900 to-black border border-white/10 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center gap-10 shadow-2xl">
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold font-serif text-white mb-4">Partner with <span className="text-cyan-400">QuranPulse</span></h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        We are building the future of Islamic Technology. Whether you are an investor, a mosque committee, or a developer, we want to collaborate.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2">
                            <i className="fa-solid fa-file-pdf"></i>
                            Download Pitch Deck
                        </button>
                        <button className="px-6 py-3 border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors">
                            Contact CEO
                        </button>
                    </div>
                </div>
                <div className="w-full md:w-1/3">
                    <TiltCard>
                        <div className="aspect-[4/5] bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,white,transparent)]"></div>
                            <i className="fa-solid fa-handshake text-6xl text-white/50"></i>
                            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
                                <p className="text-xs text-cyan-400 font-mono mb-1">GROWTH METRIC</p>
                                <p className="text-xl font-bold text-white">+1000% <span className="text-xs font-normal text-slate-400">YoY</span></p>
                            </div>
                        </div>
                    </TiltCard>
                </div>
            </div>
        </div>
    </section>
);

// --- ADVANCED TOOLS TEASER ---
const AdvancedTools = () => (
    <section className="py-24 bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <span className="text-cyan-500 font-bold tracking-widest uppercase text-xs mb-2 block">Coming Soon</span>
                <h2 className="text-3xl md:text-5xl font-bold font-serif text-white mb-4">Future <span className="text-purple-500">Intelligence</span></h2>
                <p className="text-slate-400 max-w-2xl mx-auto">We are constantly pushing the boundaries of Islamic Tech. Here is what's next.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Tool 1: Faraid */}
                <TiltCard>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-full relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors"></div>
                        <i className="fa-solid fa-calculator text-4xl text-cyan-500 mb-6"></i>
                        <h3 className="text-xl font-bold text-white mb-2">AI Faraid Calculator</h3>
                        <p className="text-slate-400 text-sm mb-4">Complex inheritance calculations solved instantly with Shariah-compliant algorithms.</p>
                        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                            In Development
                        </div>
                    </div>
                </TiltCard>

                {/* Tool 2: Zakat AI */}
                <TiltCard>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-full relative overflow-hidden group hover:border-green-500/30 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-colors"></div>
                        <i className="fa-solid fa-hand-holding-dollar text-4xl text-green-500 mb-6"></i>
                        <h3 className="text-xl font-bold text-white mb-2">Smart Zakat AI</h3>
                        <p className="text-slate-400 text-sm mb-4">Connect your bank accounts and investment portfolios for automated Zakat purification.</p>
                        <div className="flex items-center gap-2 text-xs font-mono text-green-400">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            In Development
                        </div>
                    </div>
                </TiltCard>

                {/* Tool 3: Halal Scanner */}
                <TiltCard>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-full relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors"></div>
                        <i className="fa-solid fa-barcode text-4xl text-amber-500 mb-6"></i>
                        <h3 className="text-xl font-bold text-white mb-2">AR Halal Scanner</h3>
                        <p className="text-slate-400 text-sm mb-4">Point your camera at any product to instantly verify its Halal status and ingredients.</p>
                        <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                            In Development
                        </div>
                    </div>
                </TiltCard>
            </div>
        </div>
    </section>
);

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [spotsLeft, setSpotsLeft] = useState(47);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  
  // --- MOCKUP STATE ---
  const [activeScreen, setActiveScreen] = useState<'home' | 'quran' | 'smart-deen'>('smart-deen');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAyah, setActiveAyah] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Smart Deen State
  const [chatMessages, setChatMessages] = useState([
      { role: 'assistant', content: "Assalamu Alaikum. I am Ustaz AI. Ask me anything about your Deen." }
  ]);
  const [isTyping, setIsTyping] = useState(false);

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

  // Audio Control
  useEffect(() => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.play().catch(e => console.log("Audio play failed (user interaction needed first):", e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlaying]);

  const togglePlay = () => {
      setIsPlaying(!isPlaying);
      if (!activeAyah) setActiveAyah(1);
  };

  const handleAyahClick = (ayah: number) => {
      setActiveAyah(ayah);
      setIsPlaying(true);
  };

  const handleSmartDeenPrompt = (prompt: string) => {
      setChatMessages(prev => [...prev, { role: 'user', content: prompt }]);
      setIsTyping(true);
      setTimeout(() => {
          setIsTyping(false);
          let response = "That is a great question. According to the Shafi'i school, this is permissible under specific conditions...";
          if (prompt.includes("Prayer")) response = "The next prayer is Asr at 4:23 PM. Would you like me to notify you?";
          if (prompt.includes("Meaning")) response = "Surah Al-Mulk (The Sovereignty) emphasizes that Allah controls life and death to test who is best in deeds.";
          setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
      }, 1500);
  };

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-100 flex flex-col">
      
      {/* Hidden Audio Element for Mockup */}
      <audio ref={audioRef} src="https://server8.mp3quran.net/afs/067.mp3" onEnded={() => setIsPlaying(false)} />

      {/* --- PREMIUM ATMOSPHERE --- */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#050505] to-[#000000] z-0"></div>
      <PulseWave />
      <Starfield />
      <div className="fixed top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent blur-[120px] animate-aurora z-0 pointer-events-none mix-blend-screen"></div>
      <div className="fixed inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 mix-blend-overlay pointer-events-none"></div>
      
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

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 pt-8 sm:pt-10 pb-16 sm:pb-20 max-w-7xl mx-auto w-full gap-12 lg:gap-24">
        
        {/* LEFT: COPY */}
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex-1 text-center lg:text-left z-20 w-full"
        >
            {/* EXCLUSIVE BADGE */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 rounded-full border border-cyan-500/20 bg-cyan-950/30 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.1)] mb-6 sm:mb-8 mx-auto lg:mx-0">
                <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                    Genesis Edition • Batch 1
                </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-serif leading-[1.1] tracking-tight mb-4 sm:mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-500">The Future of</span> <br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-cyan-500 to-purple-500 animate-pulse-glow inline-block pb-2">
                    Islamic Intelligence
                </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-8 sm:mb-10 font-light leading-relaxed px-2 sm:px-0">
                Experience the <span className="text-white border-b border-cyan-500/50 pb-0.5">world's first</span> AI-powered Quran companion. 
                Designed for those who seek depth, clarity, and a premium spiritual journey.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10 sm:mb-12 w-full sm:w-auto">
                <button 
                    onClick={onGetStarted}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-lg shadow-[0_10px_30px_rgba(6,182,212,0.3)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                    <span>Get Started Free</span>
                    <i className="fa-solid fa-arrow-right"></i>
                </button>
                <div className="flex gap-3 justify-center sm:justify-start w-full sm:w-auto">
                    <div className="transform hover:scale-105 transition-transform">
                        <AppStoreBadge />
                    </div>
                    <div className="transform hover:scale-105 transition-transform">
                        <PlayStoreBadge />
                    </div>
                </div>
            </motion.div>

            {/* SOCIAL PROOF */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-slate-800 flex items-center justify-center overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover" />
                            </div>
                        ))}
                         <div className="w-8 h-8 rounded-full border-2 border-black bg-slate-800 flex items-center justify-center text-white font-bold text-[10px]">+2M</div>
                    </div>
                    <p>Trusted by Ummah</p>
                </div>
                <div className="hidden sm:block w-px h-8 bg-white/10"></div>
                <p className="animate-pulse"><span className="text-cyan-400 font-bold">{spotsLeft}</span> spots remaining for this batch</p>
            </motion.div>
        </motion.div>

        {/* RIGHT: INTERACTIVE PHONE MOCKUP */}
        <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="flex-1 relative z-10 w-full max-w-[300px] sm:max-w-[350px] lg:max-w-[400px] perspective-1000 group mx-auto"
        >
             {/* Glow Behind Phone */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-cyan-500/30 to-purple-500/30 blur-[60px] sm:blur-[80px] rounded-full animate-pulse-slow"></div>

            <div className="relative w-full aspect-[9/19] bg-black rounded-[2.5rem] sm:rounded-[3.5rem] border-[8px] sm:border-[12px] border-slate-800 shadow-2xl transform rotate-y-[-12deg] rotate-x-[5deg] group-hover:rotate-y-[-5deg] group-hover:rotate-x-[2deg] transition-transform duration-700 ease-out preserve-3d ring-1 ring-white/20">
                {/* Screen Content */}
                <div className="absolute inset-0 bg-slate-950 rounded-[2rem] sm:rounded-[2.8rem] overflow-hidden flex flex-col relative">
                    
                    {/* Dynamic Island / Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 sm:h-7 w-28 sm:w-32 bg-black rounded-b-2xl z-50 flex items-center justify-center">
                        <div className="w-14 sm:w-16 h-3 sm:h-4 bg-black rounded-full flex items-center justify-end px-2 gap-1">
                             <div className={`w-1 h-1 rounded-full bg-green-500 ${isPlaying ? 'animate-ping' : ''}`}></div>
                        </div>
                    </div>

                    {/* Status Bar */}
                    <div className="h-8 sm:h-10 w-full flex justify-between items-center px-5 sm:px-6 pt-2 sm:pt-3 z-40">
                        <span className="text-[9px] sm:text-[10px] font-bold">9:41</span>
                        <div className="flex gap-1">
                            <i className="fa-solid fa-signal text-[9px] sm:text-[10px]"></i>
                            <i className="fa-solid fa-wifi text-[9px] sm:text-[10px]"></i>
                            <i className="fa-solid fa-battery-full text-[9px] sm:text-[10px]"></i>
                        </div>
                    </div>

                    {/* --- SCREEN: HOME --- */}
                    {activeScreen === 'home' && (
                        <div className="flex-1 p-4 flex flex-col animate-fade-in">
                            <div className="flex justify-between items-center mb-6 mt-2">
                                <div>
                                    <p className="text-xs text-slate-400">Assalamu Alaikum,</p>
                                    <h3 className="text-lg font-bold text-white">Guest User</h3>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 border border-white/20"></div>
                            </div>
                            
                            {/* Prayer Time Card */}
                            <div className="bg-gradient-to-br from-cyan-900/50 to-slate-900 rounded-2xl p-4 border border-white/5 mb-4 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl"></div>
                                <div className="flex justify-between items-start mb-2 relative z-10">
                                    <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">Next Prayer</span>
                                    <i className="fa-solid fa-mosque text-slate-400 text-xs"></i>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-1">Asr</h2>
                                <p className="text-sm text-slate-300">4:23 PM <span className="text-[10px] text-slate-500 ml-2">(-0:45)</span></p>
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-4 gap-2 mb-6">
                                {['Quran', 'Prayer', 'Qibla', 'AI Chat'].map((item, i) => (
                                    <div key={i} onClick={() => {
                                        if (i === 0) setActiveScreen('quran');
                                        if (i === 3) setActiveScreen('smart-deen');
                                    }} className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
                                        <div className={`w-12 h-12 rounded-xl border border-white/5 flex items-center justify-center ${i===0 ? 'bg-cyan-500/20 text-cyan-400' : i===3 ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-slate-400'}`}>
                                            <i className={`fa-solid ${i===0?'fa-book-quran':i===1?'fa-clock':i===2?'fa-compass':'fa-robot'}`}></i>
                                        </div>
                                        <span className="text-[9px] text-slate-400">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- SCREEN: QURAN --- */}
                    {activeScreen === 'quran' && (
                        <>
                            {/* App Header */}
                            <div className="px-5 sm:px-6 pt-2 pb-3 sm:pb-4 flex justify-between items-center z-10 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
                                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveScreen('home')}>
                                    <i className="fa-solid fa-chevron-left text-slate-400 text-xs"></i>
                                    <div>
                                        <h3 className="text-xs sm:text-sm font-bold text-white">Surah Al-Mulk</h3>
                                        <p className="text-[9px] sm:text-[10px] text-slate-400">Ayah 1-5 • Meccan</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 text-slate-400">
                                    <i className="fa-solid fa-ellipsis-vertical text-xs"></i>
                                </div>
                            </div>
                            
                            {/* Content: Quran View */}
                            <div className="flex-1 p-3 sm:p-4 overflow-y-auto relative z-10 scrollbar-hide animate-fade-in">
                                {/* Bismillah */}
                                <div className="text-center mb-4 sm:mb-6 mt-2">
                                    <p className="font-amiri text-lg sm:text-xl text-white">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
                                </div>

                                {/* Ayah 1 */}
                                <div 
                                    onClick={() => handleAyahClick(1)}
                                    className={`mb-4 sm:mb-6 relative group/ayah cursor-pointer transition-all duration-300 ${activeAyah === 1 ? 'scale-[1.02]' : ''}`}
                                >
                                    {activeAyah === 1 && <div className="absolute inset-0 bg-cyan-500/10 -mx-4 py-2 rounded-lg opacity-100 blur-sm transition-all"></div>}
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border flex items-center justify-center text-[9px] sm:text-[10px] font-bold transition-colors ${activeAyah === 1 ? 'border-cyan-500 bg-cyan-500 text-black' : 'border-cyan-500/30 text-cyan-400'}`}>1</div>
                                            <div className="flex gap-2 text-slate-500 text-[10px]">
                                                <i className={`fa-solid ${activeAyah === 1 && isPlaying ? 'fa-pause' : 'fa-play'} hover:text-cyan-400`}></i>
                                                <i className="fa-solid fa-bookmark hover:text-cyan-400"></i>
                                            </div>
                                        </div>
                                        <p className="font-amiri text-right text-xl sm:text-2xl mb-2 sm:mb-3 leading-[2.2] text-white">تَبَارَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ</p>
                                        <p className="text-[10px] sm:text-xs text-cyan-100/80 mb-1">Blessed is He in whose hand is dominion, and He is over all things competent</p>
                                        <p className="text-[9px] sm:text-[10px] text-slate-500 italic">Tabaraka allathee biyadihi almulku wahuwa AAala kulli shayin qadeer</p>
                                    </div>
                                </div>

                                {/* Ayah 2 */}
                                <div 
                                    onClick={() => handleAyahClick(2)}
                                    className={`mb-4 sm:mb-6 relative group/ayah cursor-pointer transition-all duration-300 opacity-80 hover:opacity-100 ${activeAyah === 2 ? 'scale-[1.02] opacity-100' : ''}`}
                                >
                                    {activeAyah === 2 && <div className="absolute inset-0 bg-cyan-500/10 -mx-4 py-2 rounded-lg opacity-100 blur-sm transition-all"></div>}
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border flex items-center justify-center text-[9px] sm:text-[10px] font-bold transition-colors ${activeAyah === 2 ? 'border-cyan-500 bg-cyan-500 text-black' : 'border-slate-700 text-slate-500'}`}>2</div>
                                        </div>
                                        <p className="font-amiri text-right text-xl sm:text-2xl mb-2 sm:mb-3 leading-[2.2] text-white">ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًۭا ۚ</p>
                                        <p className="text-[10px] sm:text-xs text-slate-400 mb-1">[He] who created death and life to test you [as to] which of you is best in deed</p>
                                    </div>
                                </div>
                            </div>

                            {/* Player Control Bar */}
                            <div className="h-16 sm:h-20 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 px-4 flex flex-col justify-center z-20">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[9px] sm:text-[10px] text-cyan-400">Mishary Rashid Alafasy</span>
                                    <span className="text-[9px] sm:text-[10px] text-slate-400">{isPlaying ? '0:12' : '0:00'} / 3:42</span>
                                </div>
                                <div className="w-full h-1 bg-slate-800 rounded-full mb-3">
                                    <div className={`h-full bg-cyan-500 rounded-full relative transition-all duration-1000 ${isPlaying ? 'w-[15%]' : 'w-0'}`}>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center px-4 text-white">
                                    <i className="fa-solid fa-backward-step text-xs text-slate-400 cursor-pointer hover:text-white"></i>
                                    <div 
                                        onClick={togglePlay}
                                        className="w-7 h-7 sm:w-8 sm:h-8 bg-white text-black rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                                    >
                                        <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} text-xs`}></i>
                                    </div>
                                    <i className="fa-solid fa-forward-step text-xs text-slate-400 cursor-pointer hover:text-white"></i>
                                </div>
                            </div>
                        </>
                    )}

                    {/* --- SCREEN: SMART DEEN AI --- */}
                    {activeScreen === 'smart-deen' && (
                        <div className="flex-1 flex flex-col animate-fade-in bg-[#050505] relative overflow-hidden">
                            
                            {/* Maze Pattern Background */}
                            <div className="absolute top-0 left-0 w-full h-32 opacity-10 pointer-events-none z-0">
                                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="maze" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                            <path d="M0 20 L20 0 M0 0 L20 20" stroke="white" strokeWidth="1" fill="none"/>
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#maze)"/>
                                </svg>
                            </div>

                            {/* Header */}
                            <div className="px-4 pt-3 pb-2 z-10 border-b border-white/10 bg-[#050505]/90 backdrop-blur-md shadow-lg">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                                            <i className="fa-solid fa-robot text-sm"></i>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white leading-none">Smart Deen AI</h3>
                                            <span className="text-[9px] font-medium text-cyan-400 uppercase tracking-wider">Standard Mode</span>
                                        </div>
                                    </div>
                                    {/* Toggle */}
                                    <div className="flex items-center gap-1.5 bg-slate-800/50 rounded-full px-2 py-1 border border-white/5">
                                        <span className="text-[8px] text-slate-400 font-bold uppercase">Thinking</span>
                                        <div className="w-6 h-3 bg-slate-700 rounded-full relative">
                                            <div className="absolute left-0.5 top-0.5 w-2 h-2 bg-slate-400 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                    {['Tanya Ustaz', 'Jawi', 'Hadith', 'Planner'].map((tab, i) => (
                                        <button 
                                            key={i}
                                            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${i === 0 ? 'bg-slate-800 text-white border border-white/10 shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 p-3 overflow-y-auto space-y-3 relative z-10">
                                {chatMessages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                                        <div className={`max-w-[85%] rounded-2xl p-3 text-[10px] sm:text-xs leading-relaxed relative overflow-hidden ${
                                            msg.role === 'user' 
                                            ? 'bg-cyan-500/20 border border-cyan-500/30 text-white rounded-br-none' 
                                            : 'bg-white/5 text-slate-200 border border-white/10 rounded-bl-none'
                                        }`}>
                                            {msg.role === 'assistant' && (
                                                <div className="flex items-center gap-1.5 mb-1.5 opacity-70 border-b border-white/10 pb-1">
                                                    <i className="fa-solid fa-user-graduate text-[9px] text-cyan-400"></i>
                                                    <span className="text-[8px] uppercase tracking-wider font-bold text-cyan-400">Ustaz AI</span>
                                                </div>
                                            )}
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start animate-fade-in">
                                        <div className="bg-slate-800/50 rounded-2xl rounded-bl-none p-3 border border-slate-700/50 backdrop-blur-sm">
                                            <div className="flex gap-1">
                                                <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></span>
                                                <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce delay-100"></span>
                                                <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce delay-200"></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Prompts */}
                            <div className="p-3 border-t border-white/5 bg-[#050505] z-20">
                                <div className="flex gap-2 items-center bg-white/5 p-1.5 rounded-xl border border-white/10 mb-2">
                                    <input 
                                        type="text" 
                                        placeholder="Ask about Fiqh..." 
                                        disabled
                                        className="flex-1 bg-transparent text-[10px] text-white px-2 outline-none placeholder:text-slate-600"
                                    />
                                    <div className="w-7 h-7 rounded-lg bg-cyan-500 text-black flex items-center justify-center shadow-lg">
                                        <i className="fa-solid fa-paper-plane text-[10px]"></i>
                                    </div>
                                </div>
                                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                    {['Explain Surah Al-Mulk', 'Next Prayer Time?'].map((prompt, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => handleSmartDeenPrompt(prompt)}
                                            className="whitespace-nowrap px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] text-slate-400 hover:bg-cyan-500/20 hover:text-cyan-400 transition-all"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- 3D Floating Bottom Navigation (Exact Replica) --- */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-50 pointer-events-none">
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] pointer-events-auto py-2 px-1">
                            <div className="flex justify-around items-center w-full">
                                {[
                                    { id: 'home', icon: 'fa-house', label: 'Home' },
                                    { id: 'quran', icon: 'fa-book-quran', label: 'Quran' },
                                    { id: 'smart-deen', icon: 'fa-user-astronaut', label: 'Ustaz', isCenter: true },
                                    { id: 'ibadah', icon: 'fa-kaaba', label: 'Ibadah' },
                                    { id: 'iqra', icon: 'fa-microphone-lines', label: 'Iqra' }
                                ].map((item) => {
                                    const isActive = activeScreen === item.id;
                                    return (
                                        <div 
                                            key={item.id}
                                            onClick={() => setActiveScreen(item.id as any)}
                                            className={`relative group flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${item.isCenter ? '-mt-8' : ''}`}
                                        >
                                            {/* Active Glow */}
                                            {isActive && (
                                                <div className={`absolute inset-0 bg-gradient-to-tr ${item.isCenter ? 'from-amber-200 to-amber-500' : 'from-cyan-200 to-cyan-500'} blur-xl opacity-40 rounded-full`}></div>
                                            )}

                                            {/* Icon Container */}
                                            <div className={`
                                                relative rounded-full flex items-center justify-center transition-all duration-300 border
                                                ${item.isCenter ? 'w-14 h-14' : 'w-10 h-10'}
                                                ${isActive 
                                                    ? `bg-gradient-to-br ${item.isCenter ? 'from-amber-300 to-amber-500' : 'from-cyan-300 to-cyan-500'} border-white/20 shadow-lg shadow-black/30 scale-110` 
                                                    : 'bg-transparent border-transparent text-slate-500 group-hover:bg-white/5 group-hover:text-slate-300'}
                                            `}>
                                                <i className={`fa-solid ${item.icon} ${item.isCenter ? 'text-2xl' : 'text-lg'} transition-all duration-300 ${isActive ? 'text-white drop-shadow-md' : ''}`}></i>
                                            </div>

                                            {/* Active Dot */}
                                            {isActive && !item.isCenter && (
                                                <div className="absolute -bottom-2 w-1 h-1 rounded-full bg-cyan-500"></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Home Indicator */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-1 bg-white/20 rounded-full z-50"></div>
                </div>
                
                 {/* Reflection/Gloss */}
                 <div className="absolute inset-0 rounded-[2.5rem] sm:rounded-[2.8rem] bg-gradient-to-tr from-white/20 to-transparent opacity-30 pointer-events-none z-50"></div>
            </div>

            {/* Floating Badges */}
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 sm:-right-12 top-24 sm:top-32 bg-black/60 backdrop-blur-xl p-2 sm:p-3 rounded-xl border border-white/10 shadow-xl transform rotate-6 z-20"
            >
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></div>
                    <span className="text-[9px] sm:text-[10px] font-bold">Tajweed Verified</span>
                </div>
            </motion.div>
        </motion.div>
      </section>

      {/* --- TRUSTED BY SECTION --- */}
      <section className="py-8 sm:py-10 border-y border-white/5 bg-black/40 backdrop-blur-sm relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-4 text-center">
              <p className="text-slate-400 font-serif italic text-lg">"The most advanced Quran companion I've ever used."</p>
              <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-700"></div>
                  <span className="text-sm text-slate-500 font-mono">Verified User Review</span>
              </div>
          </div>
      </section>

      {/* --- MISSION SECTION (NEW) --- */}
      <section id="mission" className="relative z-10 py-24 bg-black/40 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                  <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6">Bridging <span className="text-cyan-400">Faith</span> & <span className="text-purple-400">Future</span></h2>
                  <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-8">
                      In a world of noise, finding focus for your Deen can be challenging. 
                      We built QuranPulse to be more than just an app—it's a sanctuary. 
                      By fusing timeless Islamic scholarship with cutting-edge Artificial Intelligence, 
                      we've created a companion that understands your journey, answers your questions, 
                      and helps you build a lasting connection with the Quran.
                  </p>
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto"></div>
              </motion.div>
          </div>
      </section>

      {/* --- MODULE DEEP DIVE (NEW) --- */}
      <section id="features" className="relative z-10 py-24">
         <div className="max-w-7xl mx-auto w-full px-6 space-y-32">
             
             {/* 1. SMART QURAN */}
             <div className="flex flex-col md:flex-row items-center gap-12">
                 <div className="flex-1">
                     <TiltCard>
                        <div className="bg-gradient-to-br from-cyan-900/20 to-black border border-cyan-500/20 rounded-3xl p-8 h-full relative overflow-hidden group">
                            <div className="absolute inset-0 bg-cyan-500/5 blur-3xl group-hover:bg-cyan-500/10 transition-colors"></div>
                            <i className="fa-solid fa-book-quran text-6xl text-cyan-500/50 mb-6 block"></i>
                            <img src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1000&auto=format&fit=crop" alt="Quran" className="rounded-xl opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500" />
                        </div>
                     </TiltCard>
                 </div>
                 <div className="flex-1 space-y-6">
                     <h3 className="text-4xl font-bold text-white">The Intelligent Quran</h3>
                     <p className="text-slate-400 text-lg leading-relaxed">
                         Read, listen, and reflect like never before. Our advanced Quran engine features 
                         <span className="text-cyan-400"> word-by-word analysis</span>, 
                         <span className="text-cyan-400"> dynamic transliteration</span>, and 
                         <span className="text-cyan-400"> AI-powered Tafsir</span> that explains verses in context.
                     </p>
                     <ul className="space-y-3 text-slate-300">
                         <li className="flex items-center gap-3"><i className="fa-solid fa-check text-cyan-500"></i> Uthmani & IndoPak Scripts</li>
                         <li className="flex items-center gap-3"><i className="fa-solid fa-check text-cyan-500"></i> 50+ World-Renowned Reciters</li>
                         <li className="flex items-center gap-3"><i className="fa-solid fa-check text-cyan-500"></i> Smart Bookmarking & Notes</li>
                     </ul>
                 </div>
             </div>

             {/* 2. USTAZ AI */}
             <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                 <div className="flex-1">
                     <TiltCard>
                        <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/20 rounded-3xl p-8 h-full relative overflow-hidden group">
                            <div className="absolute inset-0 bg-purple-500/5 blur-3xl group-hover:bg-purple-500/10 transition-colors"></div>
                            <i className="fa-solid fa-user-astronaut text-6xl text-purple-500/50 mb-6 block"></i>
                            <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10 font-mono text-xs text-slate-300">
                                <p className="text-purple-400 mb-2">&gt; Ustaz AI is thinking...</p>
                                <p>"Based on the Shafi'i school, the conditions for..."</p>
                            </div>
                        </div>
                     </TiltCard>
                 </div>
                 <div className="flex-1 space-y-6">
                     <h3 className="text-4xl font-bold text-white">Meet Ustaz AI</h3>
                     <p className="text-slate-400 text-lg leading-relaxed">
                         Your personal spiritual guide, available 24/7. Trained on verified Islamic sources, 
                         Ustaz AI answers your questions about Fiqh, history, and daily life with 
                         <span className="text-purple-400"> precision and empathy</span>.
                     </p>
                     <ul className="space-y-3 text-slate-300">
                         <li className="flex items-center gap-3"><i className="fa-solid fa-check text-purple-500"></i> Context-Aware Answers</li>
                         <li className="flex items-center gap-3"><i className="fa-solid fa-check text-purple-500"></i> Source Citations (Quran & Hadith)</li>
                         <li className="flex items-center gap-3"><i className="fa-solid fa-check text-purple-500"></i> Multi-Madhab Support</li>
                     </ul>
                 </div>
             </div>

             {/* 3. IQRA & IBADAH */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-amber-500/30 transition-all">
                     <i className="fa-solid fa-graduation-cap text-4xl text-amber-500 mb-4"></i>
                     <h3 className="text-2xl font-bold text-white mb-3">Iqra Academy</h3>
                     <p className="text-slate-400 mb-4">Gamified learning for all ages. Master Tajweed, memorize Surahs, and expand your Arabic vocabulary with interactive lessons.</p>
                     <span className="text-amber-500 text-sm font-bold uppercase tracking-wider">Learn More &rarr;</span>
                 </div>
                 <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-green-500/30 transition-all">
                     <i className="fa-solid fa-kaaba text-4xl text-green-500 mb-4"></i>
                     <h3 className="text-2xl font-bold text-white mb-3">Precision Ibadah</h3>
                     <p className="text-slate-400 mb-4">Never miss a prayer. Astronomical accuracy for prayer times, Qibla direction, and Islamic calendar events.</p>
                     <span className="text-green-500 text-sm font-bold uppercase tracking-wider">Explore Tools &rarr;</span>
                 </div>
             </div>

         </div>
      </section>

      <AdvancedTools />

      {/* --- FAQ SECTION (NEW) --- */}
      <section className="py-24 bg-black relative z-10 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <div className="space-y-6">
                  {[
                      { q: "Is the AI content verified?", a: "Yes. Ustaz AI is trained on a strictly curated dataset of verified Islamic texts, Tafsir, and Hadith collections. It prioritizes accuracy and provides sources." },
                      { q: "Is QuranPulse free to use?", a: "We offer a generous Free Tier that includes full Quran access, ad-free reading, and basic AI features. The Pro plan unlocks unlimited AI chats and advanced learning tools." },
                      { q: "Can I use it offline?", a: "Absolutely. You can download Surahs, audio recitations, and lesson packs for offline access anywhere." },
                      { q: "Which platforms are supported?", a: "QuranPulse is available as a Progressive Web App (PWA) for iOS, Android, Windows, and Mac. Install it directly from your browser." }
                  ].map((item, i) => (
                      <div key={i} className="border-b border-white/10 pb-6">
                          <h4 className="text-lg font-bold text-white mb-2">{item.q}</h4>
                          <p className="text-slate-400">{item.a}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      <BusinessSection />
      {/* --- FOOTER --- */}
      <footer className="bg-black py-12 sm:py-16 border-t border-white/10 relative z-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
              <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                      <img src="/logo-full.png" alt="QP" className="w-8 h-8" />
                      <span className="font-bold text-xl text-white">QuranPulse</span>
                  </div>
                  <p className="text-slate-500 max-w-sm mb-6">
                      Empowering the Ummah with technology. Built with love and precision for the modern Muslim.
                  </p>
                  <div className="flex gap-4">
                      {['twitter', 'instagram', 'facebook', 'youtube'].map(social => (
                          <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-cyan-500 hover:text-black transition-all">
                              <i className={`fa-brands fa-${social}`}></i>
                          </a>
                      ))}
                  </div>
              </div>
              
              <div>
                  <h4 className="font-bold text-white mb-6">Product</h4>
                  <ul className="space-y-4 text-slate-500 text-sm">
                      <li><a href="#" className="hover:text-cyan-400">Features</a></li>
                      <li><a href="#" className="hover:text-cyan-400">Premium</a></li>
                      <li><a href="#" className="hover:text-cyan-400">For Mosques</a></li>
                      <li><a href="#" className="hover:text-cyan-400">API Access</a></li>
                  </ul>
              </div>

              <div>
                  <h4 className="font-bold text-white mb-6">Company</h4>
                  <ul className="space-y-4 text-slate-500 text-sm">
                      <li><a href="#" className="hover:text-cyan-400">About Us</a></li>
                      <li><a href="#" className="hover:text-cyan-400">Careers</a></li>
                      <li><a href="#" className="hover:text-cyan-400">Privacy Policy</a></li>
                      <li><a href="#" className="hover:text-cyan-400">Terms of Service</a></li>
                  </ul>
              </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-slate-600 text-xs">
              &copy; 2025 QuranPulse Inc. All rights reserved.
          </div>
      </footer>

      {/* --- STICKY MOBILE CTA --- */}
      <AnimatePresence>
        {showStickyCTA && (
            <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="fixed bottom-0 left-0 w-full p-4 bg-black/80 backdrop-blur-lg border-t border-white/10 z-50 md:hidden flex items-center justify-between"
            >
                <div>
                    <p className="text-xs text-slate-400">Limited spots available</p>
                    <p className="text-sm font-bold text-white">Join Genesis Batch</p>
                </div>
                <button 
                    onClick={onGetStarted}
                    className="px-6 py-2 bg-cyan-500 text-black font-bold rounded-lg shadow-lg hover:bg-cyan-400 transition-colors"
                >
                    Get Started
                </button>
            </motion.div>
        )}
      </AnimatePresence>

      <WhatsAppButton />
    </div>
  );
};

export default LandingPage;