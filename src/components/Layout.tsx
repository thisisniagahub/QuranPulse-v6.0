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
    <div className="flex h-screen w-full bg-[#f0f9ff] overflow-hidden font-sans relative justify-center">
      {/* --- DESKTOP BACKDROP (Visible only on large screens) --- */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl hidden md:block pointer-events-none bg-[image:var(--bg-splash)]"
        // eslint-disable-next-line
        style={{ '--bg-splash': `url(${kufiSplash})` } as React.CSSProperties}
      ></div>

      {/* --- MOBILE APP SHELL CONTAINER --- */}
      <div className="flex flex-col h-full w-full max-w-[480px] bg-[#031a38] relative shadow-2xl md:border-x md:border-white/10">
        {/* --- VISUAL IDENTITY v5.0 GLOBAL BACKGROUNDS --- */}
        {/* Top Header Pattern */}
        <div
          className="absolute top-0 left-0 w-full h-64 bg-top bg-no-repeat bg-contain -z-10 opacity-20 pointer-events-none mix-blend-screen bg-[image:var(--bg-header)]"
          // eslint-disable-next-line
          style={{ '--bg-header': `url(${kufiHeader})` } as React.CSSProperties}
        ></div>

        {/* Global Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c224b]/50 via-[#031a38]/90 to-[#031a38] -z-10 pointer-events-none"></div>

        {/* Header with Glass Effect */}
        <header className="h-16 bg-[#0c224b]/60 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 shrink-0 z-20 relative overflow-hidden shadow-lg">
          <Link
            to="/"
            className="flex items-center gap-3 cursor-pointer group relative z-10"
            aria-label="Go to Dashboard"
          >
            <img src="/logo-primary.png" alt="Logo" className="w-10 h-10 object-contain scale-110 transition-transform hover:scale-125 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
            <span className="font-bold text-xl tracking-tight text-white font-[Poppins] drop-shadow-md">Quran<span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">Pulse</span></span>
          </Link>

          {/* Header Actions */}
          <div className="flex items-center gap-3 relative z-10">
            <button aria-label="Notifications" className="relative w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 hover:scale-105 transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)] group">
              <i className="fa-regular fa-bell text-lg group-hover:animate-swing"></i>
              <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border border-[#0c224b] animate-pulse"></span>
            </button>
          </div>
        </header>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 overflow-y-auto scrollbar-hide relative z-0">
          <Outlet />
        </main>

        {/* --- BOTTOM NAVIGATION BAR: FLOATING CYBER DOCK --- */}
        <div className="fixed bottom-6 inset-x-4 z-50 flex justify-center pointer-events-none">
          <nav className="w-full max-w-md h-[76px] bg-[#0c224b]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between px-2 relative pointer-events-auto ring-1 ring-white/5">
            
            {/* Glass Shine Effect */}
            <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* 1. HOME */}
            <Link
              to="/"
              className="relative flex flex-col items-center justify-center w-16 h-full group"
            >
              {currentView === NavView.DASHBOARD && (
                <div className="absolute -top-[1px] w-8 h-1 bg-cyan-400 blur-sm rounded-b-full"></div>
              )}
              <div className={`w-12 h-12 transition-all duration-300 ${currentView === NavView.DASHBOARD ? '-translate-y-1 scale-110' : 'opacity-60 group-hover:opacity-100'}`}>
                <img src="/assets/icons/nabdh/nav-home.png" alt="Home" className="w-full h-full object-contain filter drop-shadow-lg" />
              </div>
            </Link>

            {/* 2. AL-QURAN */}
            <Link
              to="/quran"
              className="relative flex flex-col items-center justify-center w-16 h-full group"
            >
              {currentView === NavView.QURAN && (
                <div className="absolute -top-[1px] w-8 h-1 bg-cyan-400 blur-sm rounded-b-full"></div>
              )}
              <div className={`w-12 h-12 transition-all duration-300 ${currentView === NavView.QURAN ? '-translate-y-1 scale-110' : 'opacity-60 group-hover:opacity-100'}`}>
                <img src="/assets/icons/nabdh/nav-quran.png" alt="Quran" className="w-full h-full object-contain filter drop-shadow-lg" />
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
                    <div className={`absolute inset-0 rounded-full border-2 ${currentView === NavView.SMART_DEEN ? 'border-cyan-400/50' : 'border-white/5'}`}></div>
                    
                    <img
                      src="/assets/icons/nabdh/nav-ustaz.png"
                      alt="Ustaz AI"
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
                <div className="absolute -top-[1px] w-8 h-1 bg-cyan-400 blur-sm rounded-b-full"></div>
              )}
              <div className={`w-12 h-12 transition-all duration-300 ${currentView === NavView.IBADAH ? '-translate-y-1 scale-110' : 'opacity-60 group-hover:opacity-100'}`}>
                <img src="/assets/icons/nabdh/nav-qiblat.png" alt="Qiblat" className="w-full h-full object-contain filter drop-shadow-lg" />
              </div>
            </Link>

            {/* 5. IQRA */}
            <Link
              to="/iqra"
              className="relative flex flex-col items-center justify-center w-16 h-full group"
            >
              {currentView === NavView.IQRA && (
                <div className="absolute -top-[1px] w-8 h-1 bg-cyan-400 blur-sm rounded-b-full"></div>
              )}
              <div className={`w-12 h-12 transition-all duration-300 ${currentView === NavView.IQRA ? '-translate-y-1 scale-110' : 'opacity-60 group-hover:opacity-100'}`}>
                <img src="/assets/icons/nabdh/nav-iqra.png" alt="Iqra" className="w-full h-full object-contain filter drop-shadow-lg" />
              </div>
            </Link>

          </nav>
        </div>
      </div>
    </div>
  );
};

export default Layout;