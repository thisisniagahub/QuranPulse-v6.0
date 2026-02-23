
import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { NavView } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { Crown, Swords, Trophy } from "lucide-react";
import kufiSplash from "@/assets/bg/kufi-splash.jpg";
import kufiHeader from "@/assets/bg/kufi-header.jpg";
import kufiFooter from "@/assets/bg/kufi-footer.jpg";
import navHomeIcon from "@/assets/icons/home-3d.png";
import navQuranIcon from "@/assets/icons/quran-3d.png";
import navUstazAiIcon from "@/assets/icons/ustaz-ai-3d.png";
import navQiblatIcon from "@/assets/icons/compass-3d.png";
import navIqraIcon from "@/assets/icons/learning-3d.png";

const Layout: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { state: game } = useGamification();
  const [imgError, setImgError] = React.useState(false);

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
    <div className="flex h-screen w-full bg-[#f0f9ff] overflow-hidden font-sans relative justify-center">
      {/* --- DESKTOP BACKDROP --- */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl hidden md:block pointer-events-none bg-[image:var(--bg-splash)]"
        style={{ '--bg-splash': `url(${kufiSplash})` } as React.CSSProperties}
      ></div>

      {/* --- MOBILE APP SHELL CONTAINER --- */}
      <div className="flex flex-col h-full w-full max-w-[480px] bg-[#031a38] relative shadow-2xl md:border-x md:border-white/10">

        {/* Header with Maze Pattern Overlay */}
        <div
          className="absolute top-0 left-0 w-full h-64 bg-top bg-no-repeat bg-contain -z-10 opacity-20 pointer-events-none mix-blend-screen bg-[image:var(--bg-header)]"
          style={{ '--bg-header': `url(${kufiHeader})` } as React.CSSProperties}
        ></div>

        {/* Global Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c224b]/50 via-[#031a38]/90 to-[#031a38] -z-10 pointer-events-none"></div>

        {/* --- PREMIUM HEADER ATAS SEKALI --- */}
        <header className="h-20 bg-[#0c224b]/60 backdrop-blur-xl border-b border-white/10 flex flex-col justify-center px-4 shrink-0 z-20 relative shadow-lg">
          <div className="flex items-center justify-between">
            {/* Left: Brand */}
            <Link to="/" className="flex flex-col">
              <div className="flex items-center gap-2 group">
                <img loading="lazy" src="/logo-primary.png" alt="QuranPulse" width="32" height="32" className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                <span className="font-black text-lg tracking-tighter text-white font-[Poppins]">
                  Quran<span className="text-raudhah-teal">Pulse</span>
                </span>
              </div>
            </Link>

            {/* Center: Gamification Stats (Floating Pill) */}
            <div className="flex items-center gap-2 bg-black/30 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md shadow-inner">
              <div className="flex items-center gap-1">
                <span className="text-xs">🔥</span>
                <span className="text-[10px] font-black text-orange-400">{game.streak}</span>
              </div>
              <div className="w-px h-3 bg-white/10 mx-0.5"></div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black text-raudhah-teal uppercase tracking-tighter">LV.{game.level}</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button aria-label="Notifications" className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#0c224b] border border-white/10 flex items-center justify-center text-raudhah-teal shadow-[0_4px_10px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:scale-105 transition-all group">
                <i className="fa-regular fa-bell text-sm group-hover:animate-swing"></i>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0c224b] animate-pulse"></span>
              </button>

              <Link to="/profile" className="w-9 h-9 rounded-full border-2 border-raudhah-teal/20 p-0.5 bg-[#0c224b] shadow-lg">
                <img loading="lazy"
                  src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                  alt="User"
                  width="36"
                  height="36"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => { e.currentTarget.src = '/assets/icons/nabdh/nav-profile.png'; }}
                />
              </Link>
            </div>
          </div>
        </header>

        <div className="px-4 py-2 border-b border-white/10 bg-[#0c224b]/30 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Link
            to="/quest"
            className={`group px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-300 flex items-center gap-1.5 ${isQuestRoute
              ? "bg-raudhah-teal/10 text-raudhah-teal border-raudhah-teal/40 shadow-[0_0_16px_rgba(34,211,238,0.2)]"
              : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white hover:-translate-y-0.5"
              }`}
          >
            <Swords className={`w-3.5 h-3.5 transition-transform duration-300 ${isQuestRoute ? "text-raudhah-teal" : "text-slate-400 group-hover:text-raudhah-teal group-hover:scale-110"}`} />
            <span>SurahQuest</span>
          </Link>
          <Link
            to="/leaderboard"
            className={`group px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-300 flex items-center gap-1.5 ${isLeaderboardRoute
              ? "bg-raudhah-teal/10 text-raudhah-teal border-raudhah-teal/40 shadow-[0_0_16px_rgba(34,211,238,0.2)]"
              : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white hover:-translate-y-0.5"
              }`}
          >
            <Trophy className={`w-3.5 h-3.5 transition-transform duration-300 ${isLeaderboardRoute ? "text-raudhah-teal" : "text-slate-400 group-hover:text-amber-300 group-hover:scale-110"}`} />
            <span>Leaderboard</span>
          </Link>
          <Link
            to="/subscribe"
            className={`group px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-300 flex items-center gap-1.5 ${isSubscribeRoute
              ? "bg-raudhah-teal/10 text-raudhah-teal border-raudhah-teal/40 shadow-[0_0_16px_rgba(34,211,238,0.2)]"
              : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white hover:-translate-y-0.5"
              }`}
          >
            <Crown className={`w-3.5 h-3.5 transition-transform duration-300 ${isSubscribeRoute ? "text-raudhah-teal" : "text-slate-400 group-hover:text-emerald-300 group-hover:scale-110"}`} />
            <span>Pro</span>
            <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] leading-none font-black tracking-wide text-white bg-gradient-to-r from-raudhah-teal to-emerald-500 shadow-[0_0_10px_rgba(139,92,246,0.4)]">
              PRO
            </span>
          </Link>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 overflow-y-auto scrollbar-hide relative z-0">
          <Outlet />
        </main>

        {/* --- BOTTOM NAVIGATION BAR: FLOATING RAUDHAH DOCK --- */}
        <div className="fixed bottom-6 inset-x-4 z-50 flex justify-center pointer-events-none">
          <nav className="w-full max-w-md h-[76px] bg-[#1e3a8a]/60 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center justify-between px-2 relative pointer-events-auto ring-1 ring-white/10">

            {/* Glass Shine Effect */}
            <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* 1. HOME */}
            <Link
              to="/"
              className="relative flex flex-col items-center justify-center w-16 h-full group"
            >
              {currentView === NavView.DASHBOARD && (
                <div className="absolute -top-[1px] w-8 h-1 bg-raudhah-teal blur-sm rounded-b-full"></div>
              )}
              <div className={`w-12 h-12 transition-all duration-300 ${currentView === NavView.DASHBOARD ? '-translate-y-1 scale-110' : 'opacity-60 group-hover:opacity-100'}`}>
                <img loading="lazy" src="/assets/icons/nabdh/nav-home.png" alt="Home" width="48" height="48" className="w-full h-full object-contain filter drop-shadow-lg" />
              </div>
            </Link>

            {/* 2. AL-QURAN */}
            <Link
              to="/quran"
              className="relative flex flex-col items-center justify-center w-16 h-full group"
            >
              {currentView === NavView.QURAN && (
                <div className="absolute -top-[1px] w-8 h-1 bg-raudhah-teal blur-sm rounded-b-full"></div>
              )}
              <div className={`w-12 h-12 transition-all duration-300 ${currentView === NavView.QURAN ? '-translate-y-1 scale-110' : 'opacity-60 group-hover:opacity-100'}`}>
                <img loading="lazy" src="/assets/icons/nabdh/nav-quran.png" alt="Quran" width="48" height="48" className="w-full h-full object-contain filter drop-shadow-lg" />
              </div>
            </Link>

            {/* 3. USTAZ AI (LEVITATING ORB) */}
            <div className="relative w-20 flex justify-center">
              <Link
                to="/smart-deen"
                className="absolute -top-10"
              >
                <div className={`w-[72px] h-[72px] rounded-full p-1 transition-all duration-300 ${currentView === NavView.SMART_DEEN ? 'scale-110' : 'hover:scale-105'}`}
                  style={{
                    background: 'linear-gradient(135deg, #0c224b 0%, #031a38 100%)',
                    boxShadow: currentView === NavView.SMART_DEEN
                      ? '0 0 30px rgba(8,145,178,0.6), inset 0 0 20px rgba(8,145,178,0.2)'
                      : '0 10px 25px rgba(0,0,0,0.5), inset 0 0 10px rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <div className="w-full h-full rounded-full bg-[#031a38] flex items-center justify-center relative overflow-hidden">
                    {/* Inner Noise */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                    {/* Ring Glow */}
                    <div className={`absolute inset-0 rounded-full border-2 ${currentView === NavView.SMART_DEEN ? 'border-raudhah-teal/50' : 'border-white/5'}`}></div>

                    <img loading="lazy"
                      src="/assets/icons/nabdh/nav-ustaz.png"
                      alt="Ustaz AI"
                      width="40"
                      height="40"
                      className={`w-10 h-10 object-contain relative z-10 ${currentView === NavView.SMART_DEEN ? 'animate-pulse-slow drop-shadow-[0_0_15px_rgba(34,211,238,1)]' : 'brightness-75'}`}
                    />
                  </div>
                </div>
                {/* Reflection below the floating button */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-2 bg-black/50 blur-md rounded-full"></div>
              </Link>
            </div>

            {/* 4. QIBLAT */}
            <Link
              to="/ibadah"
              className="relative flex flex-col items-center justify-center w-16 h-full group"
            >
              {currentView === NavView.IBADAH && (
                <div className="absolute -top-[1px] w-8 h-1 bg-raudhah-teal blur-sm rounded-b-full"></div>
              )}
              <div className={`w-12 h-12 transition-all duration-300 ${currentView === NavView.IBADAH ? '-translate-y-1 scale-110' : 'opacity-60 group-hover:opacity-100'}`}>
                <img loading="lazy" src="/assets/icons/nabdh/nav-qiblat.png" alt="Qiblat" width="48" height="48" className="w-full h-full object-contain filter drop-shadow-lg" />
              </div>
            </Link>

            {/* 5. IQRA */}
            <Link
              to="/iqra"
              className="relative flex flex-col items-center justify-center w-16 h-full group"
            >
              {currentView === NavView.IQRA && (
                <div className="absolute -top-[1px] w-8 h-1 bg-raudhah-teal blur-sm rounded-b-full"></div>
              )}
              <div className={`w-12 h-12 transition-all duration-300 ${currentView === NavView.IQRA ? '-translate-y-1 scale-110' : 'opacity-60 group-hover:opacity-100'}`}>
                <img loading="lazy" src="/assets/icons/nabdh/nav-iqra.png" alt="Iqra" width="48" height="48" className="w-full h-full object-contain filter drop-shadow-lg" />
              </div>
            </Link>

          </nav>
        </div>
      </div>
    </div>
  );
};

export default Layout;

