import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { NavView } from "../types";
import kufiSplash from "../src/assets/bg/kufi-splash.jpg";
import kufiHeader from "../src/assets/bg/kufi-header.jpg";
import kufiFooter from "../src/assets/bg/kufi-footer.jpg";
import navHomeIcon from "../src/assets/icons/nav-home.jpg";
import navQuranIcon from "../src/assets/icons/nav-quran.jpg";
import navUstazAiIcon from "../src/assets/icons/nav-ustaz-ai.png";
import navQiblatIcon from "../src/assets/icons/nav-qiblat.jpg";
import navIqraIcon from "../src/assets/icons/nav-iqra.jpg";

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
      icon: "fa-house",
      label: "Home",
      color: "from-cyan-400 to-blue-500",
    },
    {
      id: NavView.QURAN,
      path: "/quran",
      icon: "fa-book-quran",
      label: "Al-Quran",
      color: "from-cyan-400 to-blue-500", // Changed to Blue/Cyan
    },
    // Center Highlighted Item (Ustaz AI)
    {
      id: NavView.SMART_DEEN,
      path: "/smart-deen",
      icon: "fa-user-astronaut",
      label: "Ustaz AI",
      color: "from-cyan-400 to-amber-400", // Changed to Cyan/Gold
      highlight: true,
    },
    {
      id: NavView.IBADAH,
      path: "/ibadah",
      icon: "fa-compass", // Changed to Compass for Qiblat
      label: "Qiblat",
      color: "from-amber-400 to-cyan-500", // Changed to Gold/Blue
    },
    {
      id: NavView.IQRA,
      path: "/iqra",
      icon: "fa-tablet-screen-button",
      label: "Iqra Digital",
      color: "from-cyan-400 to-blue-500",
    },
  ];

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden font-sans relative justify-center">
      {/* --- DESKTOP BACKDROP (Visible only on large screens) --- */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl hidden md:block pointer-events-none bg-[image:var(--bg-splash)]"
        // eslint-disable-next-line
        style={{ '--bg-splash': `url(${kufiSplash})` } as React.CSSProperties}
      ></div>

      {/* --- MOBILE APP SHELL CONTAINER --- */}
      <div className="flex flex-col h-full w-full max-w-[480px] bg-[#020617] relative shadow-2xl md:border-x md:border-white/10">
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
        <header className="h-16 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 shrink-0 z-20 relative overflow-hidden">
          <Link
            to="/"
            className="flex items-center gap-3 relative z-10 cursor-pointer group"
            aria-label="Go to Dashboard"
          >
            {/* 3D Logo Concept */}
            <div className="w-10 h-10 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-white/10 shadow-inner flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                {!imgError ? (
                  <img
                    src="/logo-full.png"
                    alt="App Logo"
                    className="w-7 h-7 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-10"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div
                    id="nav-logo-fallback"
                    className="absolute inset-0 flex items-center justify-center text-cyan-500 font-black text-sm tracking-tighter"
                  >
                    QP
                  </div>
                )}
              </div>
            </div>
            <div>
                <h1 className="text-lg font-black tracking-tighter text-white leading-none">
                    QURAN<span className="text-cyan-500">PULSE</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Cyber Edition</p>
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
        <main className="flex-1 overflow-hidden relative z-0">
            <Outlet />
        </main>

        {/* --- BOTTOM NAVIGATION BAR --- */}
        <nav className="h-[88px] bg-[#020617]/80 backdrop-blur-xl border-t border-white/5 relative z-50 shrink-0 pb-5">
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

                                {/* HOME ICON - Image Replacement */}
                                {item.id === NavView.DASHBOARD && (
                                    <div className="relative flex items-center justify-center w-8 h-8">
                                        <img 
                                            src={navHomeIcon} 
                                            alt="Home" 
                                            className={`w-full h-full object-contain mix-blend-screen ${isActive ? "contrast-125 brightness-110 saturate-150" : "opacity-70 grayscale contrast-125"}`}
                                        />
                                    </div>
                                )}

                                {/* QURAN ICON - Image Replacement */}
                                {item.id === NavView.QURAN && (
                                    <div className="relative flex items-center justify-center w-9 h-9">
                                        <img 
                                            src={navQuranIcon} 
                                            alt="Quran" 
                                            className={`w-full h-full object-contain mix-blend-screen ${isActive ? "contrast-125 brightness-110 saturate-150" : "opacity-70 grayscale contrast-125"}`}
                                        />
                                    </div>
                                )}

                                {/* USTAZ AI ICON (CENTER) - Image Replacement */}
                                {item.id === NavView.SMART_DEEN && (
                                    <div className="relative flex items-center justify-center w-full h-full -mt-8">
                                        <div className="relative w-20 h-20 flex items-center justify-center bg-[#020617] rounded-full">
                                            <img 
                                                src={navUstazAiIcon} 
                                                alt="Ustaz AI" 
                                                className="w-full h-full object-contain scale-125 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* QIBLAT ICON - Image Replacement */}
                                {item.id === NavView.IBADAH && (
                                    <div className="relative flex items-center justify-center w-8 h-8">
                                        <img 
                                            src={navQiblatIcon} 
                                            alt="Qiblat" 
                                            className={`w-full h-full object-contain mix-blend-screen ${isActive ? "contrast-125 brightness-110 saturate-150" : "opacity-70 grayscale contrast-125"}`}
                                        />
                                    </div>
                                )}

                                {/* IQRA DIGITAL ICON - Image Replacement */}
                                {item.id === NavView.IQRA && (
                                    <div className="relative flex items-center justify-center w-8 h-8">
                                        <img 
                                            src={navIqraIcon} 
                                            alt="Iqra" 
                                            className={`w-full h-full object-contain mix-blend-screen ${isActive ? "contrast-125 brightness-110 saturate-150" : "opacity-70 grayscale contrast-125"}`}
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
