import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { NavView } from "../types";
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
  const [imgError, setImgError] = React.useState(false);

  // Map paths to NavView for highlighting
  const getActiveView = (pathname: string): NavView => {
    if (pathname === "/") return NavView.DASHBOARD;
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

  // Optimized to 5 Core Items for cleaner UI
  const navItems = [
    {
      id: NavView.DASHBOARD,
      path: "/",
      icon: navHomeIcon,
      label: "Home",
      color: "from-cyan-400 to-blue-500",
    },
    {
      id: NavView.QURAN,
      path: "/quran",
      icon: navQuranIcon,
      label: "Al-Quran",
      color: "from-cyan-400 to-blue-500", // Changed to Blue/Cyan
    },
    // Center Highlighted Item (Ustaz AI)
    {
      id: NavView.SMART_DEEN,
      path: "/smart-deen",
      icon: navUstazAiIcon,
      label: "Ustaz AI",
      color: "from-cyan-400 to-amber-400", // Changed to Cyan/Gold
      highlight: true,
    },
    {
      id: NavView.IBADAH,
      path: "/ibadah",
      icon: navQiblatIcon, // Changed to Compass for Qiblat
      label: "Qiblat",
      color: "from-amber-400 to-cyan-500", // Changed to Gold/Blue
    },
    {
      id: NavView.IQRA,
      path: "/iqra",
      icon: navIqraIcon,
      label: "Iqra Digital",
      color: "from-cyan-400 to-blue-500",
    },
  ];

  return (
    <div className="flex h-screen w-full bg-background-dark overflow-hidden font-sans relative justify-center">
      {/* --- DESKTOP BACKDROP (Visible only on large screens) --- */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl hidden md:block pointer-events-none bg-[image:var(--bg-splash)]"
        // eslint-disable-next-line
        style={{ '--bg-splash': `url(${kufiSplash})` } as React.CSSProperties}
      ></div>

      {/* --- MOBILE APP SHELL CONTAINER --- */}
      <div className="flex flex-col h-full w-full max-w-[480px] bg-background-dark relative shadow-2xl md:border-x md:border-white">
        {/* --- VISUAL IDENTITY v5.0 GLOBAL BACKGROUNDS --- */}
        {/* Top Header Pattern */}
        <div
          className="absolute top-0 left-0 w-full h-64 bg-top bg-no-repeat bg-contain -z-10 opacity-30 pointer-events-none mix-blend-screen bg-[image:var(--bg-header)]"
          // eslint-disable-next-line
          style={{ '--bg-header': `url(${kufiHeader})` } as React.CSSProperties}
        ></div>

        {/* Bottom Footer Pattern */}
        <div
          className="absolute bottom-0 left-0 w-full h-64 bg-bottom bg-no-repeat bg-contain -z-10 opacity-20 pointer-events-none mix-blend-screen bg-[image:var(--bg-footer)]"
          // eslint-disable-next-line
          style={{ '--bg-footer': `url(${kufiFooter})` } as React.CSSProperties}
        ></div>

        {/* Global Gradient Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-[#020617]/90 to-[#020617]/80 -z-10 pointer-events-none"></div>

        {/* Header with Maze Pattern */}
        <header className="h-16 bg-sheet/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 shrink-0 z-20 relative overflow-hidden">
          <Link
            to="/"
            className="flex items-center gap-3 relative z-10 cursor-pointer group"
            aria-label="Go to Dashboard"
          >
            {/* Kufic Logo */}
            <div className="w-12 h-12 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-primary blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              {!imgError ? (
                <img
                  src="/logo-full.png"
                  alt="Quran Pulse Logo"
                  className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(90,185,255,0.5)] z-10 group-hover:scale-105 transition-transform"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div
                  id="nav-logo-fallback"
                  className="w-full h-full rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-black text-lg"
                >
                  QP
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white leading-none">
                Quran <span className="text-primary">Pulse</span>
              </h1>
              <p className="text-[10px] text-primary/70 font-bold tracking-[0.2em] uppercase">Your Digital Companion</p>
            </div>
          </Link>

          {/* Header Actions */}
          <div className="flex items-center gap-3 relative z-10">
            <button aria-label="Notifications" className="w-9 h-9 rounded-full bg-slate-800/50 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
              <i className="fa-regular fa-bell"></i>
            </button>
          </div>
        </header>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 overflow-y-auto scrollbar-hide relative z-0 pb-32">
          <Outlet />
        </main>

        {/* --- BOTTOM NAVIGATION BAR --- */}
        {/* --- BOTTOM NAVIGATION BAR (Restored 5-Items: Home, Quran, Ustaz, Qiblat, Iqra) --- */}
        <nav className="h-[88px] bg-[#020617]/90 backdrop-blur-xl border-t border-cyan-500/20 relative z-50 shrink-0 pb-5">
          <div className="flex items-center justify-around h-full px-2">

            {/* 1. HOME */}
            <Link
              to="/"
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 w-16 ${currentView === NavView.DASHBOARD ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
            >
              <div className={`w-8 h-8 ${currentView === NavView.DASHBOARD ? '' : 'grayscale'}`}>
                <img src="/assets/icons/nabdh/nav-home.png" alt="Home" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(0,191,255,0.6)]" />
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider ${currentView === NavView.DASHBOARD ? 'text-cyan-400' : 'text-slate-500'}`}>Home</span>
            </Link>

            {/* 2. AL-QURAN */}
            <Link
              to="/quran"
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 w-16 ${currentView === NavView.QURAN ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
            >
              <div className={`w-8 h-8 ${currentView === NavView.QURAN ? '' : 'grayscale'}`}>
                <img src="/assets/icons/nabdh/nav-quran.png" alt="Quran" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(0,191,255,0.6)]" />
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider ${currentView === NavView.QURAN ? 'text-cyan-400' : 'text-slate-500'}`}>Quran</span>
            </Link>

            {/* 3. USTAZ AI (CENTER HIGHLIGHT) */}
            <Link
              to="/smart-deen"
              className={`flex flex-col items-center justify-center relative -mt-8 transition-all duration-300 w-20 group`}
            >
              <div className={`w-20 h-20 rounded-full bg-[#020617] p-2 border-4 border-[#020617] shadow-[0_-5px_20px_rgba(0,191,255,0.2)] ${currentView === NavView.SMART_DEEN ? 'scale-110' : 'hover:scale-105'}`}>
                <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-900/50 to-slate-900 flex items-center justify-center border border-cyan-500/30 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                  <img
                    src="/assets/icons/nabdh/nav-ustaz.png"
                    alt="Ustaz AI"
                    className={`w-full h-full object-contain p-1 drop-shadow-[0_0_15px_rgba(0,191,255,0.8)] ${currentView === NavView.SMART_DEEN ? 'animate-pulse-slow' : 'grayscale brightness-75'}`}
                  />
                </div>
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider mt-1 ${currentView === NavView.SMART_DEEN ? 'text-cyan-400' : 'text-slate-500'}`}>Ustaz AI</span>
            </Link>

            {/* 4. QIBLAT */}
            <Link
              to="/ibadah"
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 w-16 ${currentView === NavView.IBADAH ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
            >
              <div className={`w-8 h-8 ${currentView === NavView.IBADAH ? '' : 'grayscale'}`}>
                <img src="/assets/icons/nabdh/nav-qiblat.png" alt="Qiblat" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(0,191,255,0.6)]" />
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider ${currentView === NavView.IBADAH ? 'text-cyan-400' : 'text-slate-500'}`}>Qiblat</span>
            </Link>

            {/* 5. IQRA */}
            <Link
              to="/iqra"
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 w-16 ${currentView === NavView.IQRA ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
            >
              <div className={`w-8 h-8 ${currentView === NavView.IQRA ? '' : 'grayscale'}`}>
                <img src="/assets/icons/nabdh/nav-iqra.png" alt="Iqra" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(0,191,255,0.6)]" />
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider ${currentView === NavView.IQRA ? 'text-cyan-400' : 'text-slate-500'}`}>Iqra</span>
            </Link>

          </div>
        </nav>
      </div>
    </div>
  );
};

export default Layout;