import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AppStoreBadge, PlayStoreBadge } from './StoreBadges';

interface HeroSectionProps {
  onGetStarted: () => void;
  spotsLeft: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, spotsLeft }) => {
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
    <section className="relative z-10 min-h-[90vh] flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-20 max-w-7xl mx-auto w-full gap-12 lg:gap-24 overflow-visible">
        
        {/* Hidden Audio Element for Mockup */}
        <audio ref={audioRef} src="https://verses.quran.com/Alafasy/mp3/067001.mp3" onEnded={() => setIsPlaying(false)} />

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
                    className="group relative w-full sm:w-auto px-8 py-4 bg-transparent overflow-hidden rounded-xl transition-all hover:scale-105 active:scale-95"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 group-hover:from-cyan-500 group-hover:to-blue-500 transition-colors"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="relative flex items-center justify-center gap-3 text-white font-bold text-lg">
                        <span>Get Started Free</span>
                        <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </div>
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                </button>
                <div className="flex gap-3 justify-center sm:justify-start w-full sm:w-auto text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-medium items-center">
                    <i className="fa-solid fa-play-circle text-xl"></i>
                    <span>Watch Demo</span>
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
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 relative z-10 w-full max-w-[300px] sm:max-w-[350px] lg:max-w-[400px] perspective-1000 group mx-auto"
        >
             {/* Glow Behind Phone */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-cyan-500/30 to-purple-500/30 blur-[60px] sm:blur-[80px] rounded-full animate-pulse-slow"></div>

            <motion.div 
                animate={{ y: [0, -15, 0], rotateY: [-12, -8, -12] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full aspect-[9/19] bg-black rounded-[2.5rem] sm:rounded-[3.5rem] border-[8px] sm:border-[12px] border-slate-800 shadow-2xl transform transition-transform duration-700 ease-out preserve-3d ring-1 ring-white/20"
            >
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
                                    <h3 className="text-lg font-bold text-white">Megat Shazree Zainal</h3>
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
                    <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-[88%] z-50 pointer-events-none">
                        <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] pointer-events-auto py-1.5 px-1">
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
                                            className={`relative group flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${item.isCenter ? '-mt-6' : ''}`}
                                        >
                                            {/* Active Glow */}
                                            {isActive && (
                                                <div className={`absolute inset-0 bg-gradient-to-tr ${item.isCenter ? 'from-amber-200 to-amber-500' : 'from-cyan-200 to-cyan-500'} blur-xl opacity-40 rounded-full`}></div>
                                            )}

                                            {/* Icon Container */}
                                            <div className={`
                                                relative rounded-full flex items-center justify-center transition-all duration-300 border
                                                ${item.isCenter ? 'w-12 h-12' : 'w-9 h-9'}
                                                ${isActive 
                                                    ? `bg-gradient-to-br ${item.isCenter ? 'from-amber-300 to-amber-500' : 'from-cyan-300 to-cyan-500'} border-white/20 shadow-lg shadow-black/30 scale-110` 
                                                    : 'bg-transparent border-transparent text-slate-500 group-hover:bg-white/5 group-hover:text-slate-300'}
                                            `}>
                                                <i className={`fa-solid ${item.icon} ${item.isCenter ? 'text-xl' : 'text-base'} transition-all duration-300 ${isActive ? 'text-white drop-shadow-md' : ''}`}></i>
                                            </div>

                                            {/* Active Dot */}
                                            {isActive && !item.isCenter && (
                                                <div className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-cyan-500"></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-1 bg-white/30 rounded-full z-50"></div>
                </div>
                
                 {/* Reflection/Gloss */}
                 <div className="absolute inset-0 rounded-[2.5rem] sm:rounded-[2.8rem] bg-gradient-to-tr from-white/20 to-transparent opacity-30 pointer-events-none z-50"></div>
            </motion.div>

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
  );
};
