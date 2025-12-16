import React from "react";
import { Link, Outlet } from "react-router-dom";
import kufiSplash from "@/assets/bg/kufi-splash.jpg";
import kufiHeader from "@/assets/bg/kufi-header.jpg";
import kufiFooter from "@/assets/bg/kufi-footer.jpg";
import BottomNav from "./BottomNav";

const Layout: React.FC = () => {
  const [imgError, setImgError] = React.useState(false);

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
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
