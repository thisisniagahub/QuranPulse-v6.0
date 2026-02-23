import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NavView } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { Crown, Swords, Trophy, Bell, User as UserIcon, Sparkles } from "lucide-react";
import kufiSplash from "@/assets/bg/quranpulse-green.jpg";
import kufiHeader from "@/assets/bg/kufi-header.jpg";
import kufiFooter from "@/assets/bg/kufi-footer.jpg";

const Layout: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { state: game } = useGamification();

  // Map paths to NavView for highlighting
  const getActiveView = (pathname: string): NavView => {
    if (pathname === "/") return NavView.DASHBOARD;
    if (pathname.startsWith("/quest") || pathname.startsWith("/surah-quest")) return NavView.QURAN;
    if (pathname.startsWith("/quran")) return NavView.QURAN;
    if (pathname.startsWith("/smart-deen")) return NavView.SMART_DEEN;
    if (pathname.startsWith("/ibadah")) return NavView.IBADAH;
    if (pathname.startsWith("/iqra")) return NavView.IQRA;
    if (pathname.startsWith("/souq")) return NavView.SOUQ;
    if (pathname.startsWith("/media")) return NavView.MEDIA_STUDIO;
    if (pathname.startsWith("/profile")) return NavView.PROFILE;
    if (pathname.startsWith("/admin")) return NavView.ADMIN;
    return NavView.DASHBOARD;
  };

  const currentView = getActiveView(location.pathname);
  const isQuestRoute = location.pathname.startsWith("/quest") || location.pathname.startsWith("/surah-quest");
  const isLeaderboardRoute = location.pathname.startsWith("/leaderboard");
  const isSubscribeRoute = location.pathname.startsWith("/subscribe") || location.pathname.startsWith("/pro");

  return (
    <div className="flex h-screen w-full bg-raudhah-ivory overflow-hidden font-sans relative justify-center">
      {/* --- DESKTOP BACKDROP --- */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 blur-2xl hidden md:block pointer-events-none bg-[image:var(--bg-splash)]"
        style={{ '--bg-splash': `url(${kufiSplash})` } as React.CSSProperties}
      ></div>

      {/* --- MOBILE APP SHELL CONTAINER --- */}
      <div className="flex flex-col h-full w-full max-w-[480px] bg-raudhah-ivory relative shadow-2xl md:border-x md:border-raudhah-teal/10 overflow-hidden">

        {/* Header with Pattern Overlay */}
        <div
          className="absolute top-0 left-0 w-full h-64 bg-top bg-no-repeat bg-contain -z-10 opacity-5 pointer-events-none mix-blend-multiply bg-[image:var(--bg-header)]"
          style={{ '--bg-header': `url(${kufiHeader})` } as React.CSSProperties}
        ></div>

        {/* Global Light Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white/90 -z-10 pointer-events-none"></div>

        {/* --- PREMIUM HEADER --- */}
        <header className="h-24 bg-white/60 backdrop-blur-xl border-b border-raudhah-teal/5 flex flex-col justify-center px-6 shrink-0 z-20 relative shadow-sm glass-v7">
          <div className="flex items-center justify-between">
            {/* Left: Brand */}
            <Link to="/" className="flex flex-col group">
              <div className="flex items-center gap-3">
                <img loading="lazy" src="/logo-primary.png" alt="QuranPulse" width="36" height="36" className="w-9 h-9 object-contain drop-shadow-sm group-hover:scale-110 transition-transform" />
                <div className="flex flex-col leading-none">
                  <span className="font-black text-xl tracking-tighter text-raudhah-ink font-raudhah">
                    QURAN<span className="text-raudhah-teal">PULSE</span>
                  </span>
                  <span className="text-[8px] font-black text-raudhah-teal/40 tracking-[0.3em] uppercase mt-1">Teknologi untuk Taqwa</span>
                </div>
              </div>
            </Link>

            {/* Right: Actions & User */}
            <div className="flex items-center gap-4">
              {/* Gamification Stats */}
              <div className="hidden sm:flex items-center gap-2 bg-raudhah-teal/5 border border-raudhah-teal/10 px-3 py-1.5 rounded-full backdrop-blur-md shadow-inner">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] filter saturate-0 group-hover:saturate-100 transition-all">🔥</span>
                  <span className="text-[10px] font-bold text-raudhah-ink">{game.streak}</span>
                </div>
                <div className="w-px h-3 bg-raudhah-teal/10 mx-1"></div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-black text-raudhah-teal uppercase tracking-tighter">LV.{game.level}</span>
                </div>
              </div>

              <Link to="/profile" className="w-11 h-11 rounded-2xl border-2 border-raudhah-teal/10 p-0.5 bg-white shadow-lg overflow-hidden transition-all hover:scale-105 active:scale-95 group">
                <img loading="lazy"
                  src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                  alt="User"
                  width="44"
                  height="44"
                  className="w-full h-full rounded-xl object-cover"
                  onError={(e) => { e.currentTarget.src = '/assets/icons/nabdh/nav-profile.png'; }}
                />
              </Link>
            </div>
          </div>
        </header>

        {/* Quick Tabs Scrolling Nav */}
        <div className="px-6 py-3 border-b border-raudhah-teal/5 bg-white/40 flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth">
          <Link
            to="/quest"
            className={`group px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all duration-300 flex items-center gap-2 ${isQuestRoute
              ? "bg-raudhah-teal text-white border-raudhah-ink shadow-lg shadow-raudhah-teal/20"
              : "bg-white/50 text-raudhah-teal/60 border-raudhah-teal/10 hover:bg-white hover:text-raudhah-ink hover:border-raudhah-teal/30 shadow-sm"
              }`}
          >
            <Swords size={14} className={isQuestRoute ? "text-white" : "text-raudhah-teal/30 group-hover:text-raudhah-teal"} />
            <span>SurahQuest</span>
          </Link>

          <Link
            to="/leaderboard"
            className={`group px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all duration-300 flex items-center gap-2 ${isLeaderboardRoute
              ? "bg-raudhah-gold text-white border-raudhah-ink shadow-lg shadow-raudhah-gold/20"
              : "bg-white/50 text-raudhah-teal/60 border-raudhah-teal/10 hover:bg-white hover:text-raudhah-ink hover:border-raudhah-teal/30 shadow-sm"
              }`}
          >
            <Trophy size={14} className={isLeaderboardRoute ? "text-white" : "text-raudhah-gold/30 group-hover:text-raudhah-gold"} />
            <span>Hulubalang</span>
          </Link>

          <Link
            to="/subscribe"
            className={`group px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all duration-300 flex items-center gap-2 ${isSubscribeRoute
              ? "bg-raudhah-ink text-white border-raudhah-gold/50 shadow-lg shadow-raudhah-ink/20"
              : "bg-white/50 text-raudhah-teal/60 border-raudhah-teal/10 hover:bg-white hover:text-raudhah-ink hover:border-raudhah-teal/30 shadow-sm"
              }`}
          >
            <Crown size={14} className={isSubscribeRoute ? "text-raudhah-gold" : "text-raudhah-teal/30 group-hover:text-raudhah-gold"} />
            <span>Pakej Premium</span>
          </Link>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative z-0 bg-transparent">
          <Outlet />
        </main>

        {/* --- BOTTOM NAVIGATION BAR: FLOATING RAUDHAH DOCK --- */}
        <div className="fixed bottom-6 inset-x-4 z-50 flex justify-center pointer-events-none px-2 max-w-[480px] mx-auto">
          <nav className="w-full h-[84px] bg-white/95 backdrop-blur-2xl border-2 border-raudhah-teal/10 rounded-[2.5rem] shadow-[0_25px_60px_rgba(27,107,90,0.15)] flex items-center justify-between px-3 relative pointer-events-auto glass-v7 overflow-visible">

            {/* Glass Shine Effect */}
            <div className="absolute inset-x-10 top-0 h-[2px] bg-gradient-to-r from-transparent via-raudhah-teal/10 to-transparent"></div>

            {/* 1. HOME */}
            <Link
              to="/"
              className="relative flex flex-col items-center justify-center w-16 h-full group"
            >
              {currentView === NavView.DASHBOARD && (
                <motion.div layoutId="nav-pill" className="absolute -top-1 w-8 h-1 bg-raudhah-teal rounded-full shadow-[0_0_10px_#1B6B5A]"></motion.div>
              )}
              <div className={`w-12 h-12 transition-all duration-500 scale-100 ${currentView === NavView.DASHBOARD ? '-translate-y-1 scale-110' : 'opacity-40 group-hover:opacity-100'}`}>
                <img loading="lazy" src="/assets/icons/nabdh/nav-home.png" alt="Home" width="48" height="48" className={`w-full h-full object-contain filter ${currentView === NavView.DASHBOARD ? 'drop-shadow-lg' : 'grayscale brightness-125'}`} />
              </div>
            </Link>

            {/* 2. AL-QURAN */}
            <Link
              to="/quran"
              className="relative flex flex-col items-center justify-center w-16 h-full group"
            >
              {currentView === NavView.QURAN && (
                <motion.div layoutId="nav-pill" className="absolute -top-1 w-8 h-1 bg-raudhah-teal rounded-full shadow-[0_0_10px_#1B6B5A]"></motion.div>
              )}
              <div className={`w-12 h-12 transition-all duration-500 ${currentView === NavView.QURAN ? '-translate-y-1 scale-110' : 'opacity-40 group-hover:opacity-100'}`}>
                <img loading="lazy" src="/assets/icons/nabdh/nav-quran.png" alt="Quran" width="48" height="48" className={`w-full h-full object-contain filter ${currentView === NavView.QURAN ? 'drop-shadow-lg' : 'grayscale brightness-125'}`} />
              </div>
            </Link>

            {/* 3. USTAZ AI (LEVITATING ORB) */}
            <div className="relative w-20 flex justify-center overflow-visible">
              <Link
                to="/smart-deen"
                className="absolute -top-12 z-50 active:scale-90 transition-transform"
              >
                <div className={`w-[80px] h-[80px] rounded-3xl p-1 transition-all duration-500 shadow-xl ${currentView === NavView.SMART_DEEN ? 'scale-110 rotate-3 shadow-raudhah-teal/30' : 'hover:scale-105 hover:-rotate-3 shadow-black/10'}`}
                  style={{
                    background: 'white',
                    border: '3px solid #1B6B5A1A',
                    boxShadow: currentView === NavView.SMART_DEEN
                      ? '0 15px 40px rgba(27,107,90,0.25), inset 0 0 20px rgba(27,107,90,0.05)'
                      : '0 10px 30px rgba(0,0,0,0.1), inset 0 0 10px rgba(255,255,255,0.8)',
                  }}
                >
                  <div className="w-full h-full rounded-2xl bg-raudhah-teal flex items-center justify-center relative overflow-hidden border-b-4 border-raudhah-ink group">
                    <Sparkles className="absolute top-1 right-1 w-3 h-3 text-white/20 animate-pulse" />
                    <img loading="lazy"
                      src="/assets/icons/nabdh/nav-ustaz.png"
                      alt="Ustaz AI"
                      width="48"
                      height="48"
                      className={`w-12 h-12 object-contain relative z-10 transition-all duration-500 ${currentView === NavView.SMART_DEEN ? 'scale-110 brightness-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'brightness-90 group-hover:scale-110'}`}
                    />
                  </div>
                </div>
                {/* Spiritual Pulse reflection below */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-12 h-3 bg-raudhah-teal blur-lg rounded-full" />
              </Link>
            </div>

            {/* 4. IBADAH */}
            <Link
              to="/ibadah"
              className="relative flex flex-col items-center justify-center w-16 h-full group"
            >
              {currentView === NavView.IBADAH && (
                <motion.div layoutId="nav-pill" className="absolute -top-1 w-8 h-1 bg-raudhah-teal rounded-full shadow-[0_0_10px_#1B6B5A]"></motion.div>
              )}
              <div className={`w-12 h-12 transition-all duration-500 ${currentView === NavView.IBADAH ? '-translate-y-1 scale-110' : 'opacity-40 group-hover:opacity-100'}`}>
                <img loading="lazy" src="/assets/icons/nabdh/nav-qiblat.png" alt="Ibadah" width="48" height="48" className={`w-full h-full object-contain filter ${currentView === NavView.IBADAH ? 'drop-shadow-lg' : 'grayscale brightness-125'}`} />
              </div>
            </Link>

            {/* 5. IQRA */}
            <Link
              to="/iqra"
              className="relative flex flex-col items-center justify-center w-16 h-full group"
            >
              {currentView === NavView.IQRA && (
                <motion.div layoutId="nav-pill" className="absolute -top-1 w-8 h-1 bg-raudhah-teal rounded-full shadow-[0_0_10px_#1B6B5A]"></motion.div>
              )}
              <div className={`w-12 h-12 transition-all duration-500 ${currentView === NavView.IQRA ? '-translate-y-1 scale-110' : 'opacity-40 group-hover:opacity-100'}`}>
                <img loading="lazy" src="/assets/icons/nabdh/nav-iqra.png" alt="Iqra" width="48" height="48" className={`w-full h-full object-contain filter ${currentView === NavView.IQRA ? 'drop-shadow-lg' : 'grayscale brightness-125'}`} />
              </div>
            </Link>

          </nav>
        </div>
      </div>
    </div>
  );
};

export default Layout;
