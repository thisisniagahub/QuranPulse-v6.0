import React, { useState, useEffect } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [spotsLeft, setSpotsLeft] = useState(47);

  // Fake live counter to create urgency
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsLeft((prev) => (prev > 12 ? prev - 1 : 12)); // Stops at 12
    }, 45000); // Decreases every 45 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-islamic-dark text-white font-sans relative overflow-x-hidden selection:bg-secondary selection:text-black flex flex-col">
      
      {/* --- PREMIUM ATMOSPHERE --- */}
      {/* SPLASH BACKGROUND: Kufi Pattern */}
      <div className="fixed inset-0 bg-[url('src/assets/bg/kufi-splash.jpg')] bg-cover bg-center z-0 pointer-events-none opacity-40 mix-blend-screen"></div>
      
      {/* Deep gradient overlay to ensure text legibility */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-islamic-panel/80 via-islamic-dark to-black opacity-90 z-0 pointer-events-none"></div>
      
      {/* Gold Ambient Glows */}
      <div className="fixed top-[-20%] left-[20%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none animate-pulse-slow"></div>
      
      {/* --- TOP NAVIGATION --- */}
      <nav className="relative z-50 px-6 py-6 flex justify-end items-center w-full">
          {/* Login Button for Admins/Users */}
          <button 
            onClick={onGetStarted}
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all group hover:border-secondary/50"
          >
              <i className="fa-solid fa-right-to-bracket text-secondary opacity-70 group-hover:opacity-100"></i>
              Member Login
          </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-4 pb-12">
        
        {/* EXCLUSIVE BADGE */}
        <div className="animate-slide-up mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/5 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-light">
                    Genesis Edition • Batch 1
                </span>
            </div>
        </div>

        {/* LOGO & BRANDING */}
        <div className="mb-6 relative group cursor-default animate-fade-in">
            <div className="w-28 h-28 mx-auto relative z-10 bg-gradient-to-br from-[#0f172a] to-black rounded-3xl border border-secondary/20 shadow-[0_0_50px_rgba(234,179,8,0.1)] flex items-center justify-center p-5 transform transition-transform group-hover:scale-105 duration-700">
                 {/* Inner Gold Border */}
                 <div className="absolute inset-2 border border-secondary/10 rounded-2xl"></div>
                 <img 
                   src="src/assets/branding/logo-full.png" 
                   alt="QuranPulse Logo" 
                   className="w-full h-full object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] animate-pulse-glow"
                   onError={(e) => {
                     e.currentTarget.style.display = 'none';
                     document.getElementById('lp-logo-fallback')!.style.display = 'flex';
                   }}
                 />
                 <div id="lp-logo-fallback" className="hidden w-16 h-16 bg-gradient-to-br from-secondary to-secondary-hover rounded-xl items-center justify-center text-black font-bold text-2xl shadow-inner animate-pulse-glow">QP</div>
            </div>
        </div>

        {/* LUXURY HEADLINES */}
        <h1 className="text-4xl md:text-7xl font-bold font-serif leading-tight tracking-tight mb-6 animate-slide-up bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-500 drop-shadow-sm">
          The Future of <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-light via-secondary to-secondary-light">
            Islamic Intelligence
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed animate-slide-up tracking-wide" style={{ animationDelay: '100ms' }}>
          Experience the <span className="text-white border-b border-secondary/50 pb-0.5">world's first</span> AI-powered Quran companion. 
          Limited access for founding members only.
        </p>

        {/* --- THE "GOLDEN TICKET" ACCESS CARD --- */}
        <div className="relative w-full max-w-md mx-auto animate-slide-up group" style={{ animationDelay: '200ms' }}>
            {/* Glow Behind Card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-secondary-hover to-primary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-[#0b101b] border border-white/10 rounded-2xl p-1 shadow-2xl overflow-hidden">
                {/* Shine Effect */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />

                <div className="bg-slate-950/80 backdrop-blur-xl rounded-xl p-6 flex flex-col items-center text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">Official Invitation</p>
                    
                    <a 
                        href="https://chat.whatsapp.com/YOUR_INVITE_LINK" 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full group/btn relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#25D366] to-[#1ebc57] hover:from-[#2bf174] hover:to-[#25D366] text-white font-bold rounded-xl text-lg shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] transition-all transform hover:-translate-y-1"
                    >
                        <i className="fa-brands fa-whatsapp text-2xl"></i>
                        <span>Claim Access Pass</span>
                        <i className="fa-solid fa-arrow-right text-xs opacity-50 group-hover/btn:translate-x-1 transition-transform"></i>
                    </a>

                    <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-secondary">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                        </span>
                        <span>Only {spotsLeft} spots remaining in this batch</span>
                    </div>
                </div>
            </div>

            {/* Demo Link */}
            <div className="mt-6 text-center">
                <button 
                    onClick={onGetStarted}
                    className="text-xs text-slate-600 hover:text-slate-300 transition-colors uppercase tracking-widest font-bold border-b border-transparent hover:border-slate-500 pb-0.5"
                >
                    Continue to App
                </button>
            </div>
        </div>
      </div>

      {/* --- ELITE FEATURES (Horizontal Scroll on Mobile) --- */}
      <div className="relative z-10 pb-16 border-t border-white/5 bg-black/20 backdrop-blur-lg">
         <div className="max-w-6xl mx-auto w-full px-6 pt-12">
             <div className="flex flex-col md:flex-row gap-6 justify-center">
                 
                 {/* Feature 1 */}
                 <div className="flex-1 bg-gradient-to-b from-slate-900 to-black border border-white/5 rounded-2xl p-6 hover:border-secondary/30 transition-colors group">
                     <i className="fa-solid fa-fingerprint text-3xl text-slate-700 group-hover:text-secondary transition-colors mb-4"></i>
                     <h3 className="text-white font-serif font-bold text-lg mb-2">Personalized AI</h3>
                     <p className="text-sm text-slate-500">Adaptive learning algorithms that tailor the Quranic experience to your pace.</p>
                 </div>

                 {/* Feature 2 */}
                 <div className="flex-1 bg-gradient-to-b from-slate-900 to-black border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-colors group">
                     <i className="fa-solid fa-shield-halved text-3xl text-slate-700 group-hover:text-primary transition-colors mb-4"></i>
                     <h3 className="text-white font-serif font-bold text-lg mb-2">Syariah Compliant</h3>
                     <p className="text-sm text-slate-500">Verified content backed by Ahli Sunnah Wal Jamaah sources and scholars.</p>
                 </div>

                 {/* Feature 3 */}
                 <div className="flex-1 bg-gradient-to-b from-slate-900 to-black border border-white/5 rounded-2xl p-6 hover:border-purple-500/30 transition-colors group">
                     <i className="fa-solid fa-infinity text-3xl text-slate-700 group-hover:text-purple-400 transition-colors mb-4"></i>
                     <h3 className="text-white font-serif font-bold text-lg mb-2">Lifetime Legacy</h3>
                     <p className="text-sm text-slate-500">Join now to secure founding member status and locked-in benefits.</p>
                 </div>

             </div>
         </div>
         
         <div className="text-center mt-12 pb-4">
             <p className="text-[10px] text-slate-600 font-mono">SECURED BY BARAKAH ENGINE™ • EST 2025</p>
         </div>
      </div>

    </div>
  );
};

export default LandingPage;