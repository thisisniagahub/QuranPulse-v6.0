import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { NavView } from "../types";
import kufiSplash from "@/assets/bg/kufi-splash.jpg";
import kufiHeader from "@/assets/bg/kufi-header.jpg";
import kufiFooter from "@/assets/bg/kufi-footer.jpg";
import navHomeIcon from "@/assets/icons/nav-home-neon.png";
import navQuranIcon from "@/assets/icons/nav-quran-neon.png";
import navUstazAiIcon from "@/assets/icons/nav-ustaz-ai.png";
import navQiblatIcon from "@/assets/icons/nav-qiblat-neon.png";
import navIqraIcon from "@/assets/icons/nav-iqra-neon.png";

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
        <nav className="h-[88px] bg-sheet/80 backdrop-blur-xl border-t border-white relative z-50 shrink-0 pb-5">
            <div className="flex items-center justify-around h-full px-2">
                {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    const isCenter = item.id === NavView.SMART_DEEN;

                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className="flex flex-col items-center justify-center relative group w-16"
                        >
                            <div
                                className={`
                                    relative rounded-full flex items-center justify-center transition-all duration-300 border
                                    ${isCenter ? "w-16 h-16 -mt-8" : "w-10 h-10"}
                                    ${
                                      isActive && !isCenter
                                        ? `bg-gradient-to-br ${item.color} border-white/20 shadow-lg shadow-cyan-500/20 scale-110`
                                        : isActive && isCenter
                                        ? "bg-transparent border-transparent scale-110"
                                        : "bg-transparent border-transparent text-slate-500 group-hover:bg-white/5 group-hover:text-slate-300"
                                    }
                                `}
                            >
                                {/* Inner Glass Reflection for Active State */}
                                {isActive && !isCenter && (
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
                                )}

                                {/* ICON (IMAGE BASED) */}
                                {item.id === NavView.SMART_DEEN ? (
                                    // CENTER BUTTON (USTAZ AI)
                                    <div className="relative flex items-center justify-center w-full h-full -mt-8">
                                        <div className="relative w-20 h-20 flex items-center justify-center bg-[#020617] rounded-full">
                                            <img 
                                                src={item.icon} 
                                                alt={item.label}
                                                className="w-full h-full object-contain scale-125 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    // STANDARD BUTTONS
                                    <div className="relative flex items-center justify-center w-full h-full p-2">
                                        <img 
                                            src={item.icon} 
                                            alt={item.label}
                                            className={`w-full h-full object-contain transition-all duration-300 ${isActive ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] brightness-110" : "opacity-60 grayscale"}`}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Label (Visible on Active or Hover) - Hidden for Ustaz AI */}
                            {item.id !== NavView.SMART_DEEN && (
                                <span className={`text-[10px] font-bold mt-1 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-400'}`}>
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
      </div>
    </div>
  );
};

export default Layout;