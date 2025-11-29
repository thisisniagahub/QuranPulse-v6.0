import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { NavView } from "../types";
import kufiSplash from "../src/assets/bg/kufi-splash.jpg";
import kufiHeader from "../src/assets/bg/kufi-header.jpg";
import kufiFooter from "../src/assets/bg/kufi-footer.jpg";

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
      color: "from-primary-light to-primary",
    },
    {
      id: NavView.QURAN,
      path: "/quran",
      icon: "fa-book-quran",
      label: "Quran",
      color: "from-primary-light to-primary",
    },
    // Center Highlighted Item (Ustaz AI)
    {
      id: NavView.SMART_DEEN,
      path: "/smart-deen",
      icon: "fa-user-astronaut",
      label: "Ustaz",
      color: "from-secondary-light to-secondary",
      highlight: true,
    },
    {
      id: NavView.IBADAH,
      path: "/ibadah",
      icon: "fa-kaaba",
      label: "Ibadah",
      color: "from-primary-light to-primary",
    },
    {
      id: NavView.IQRA,
      path: "/iqra",
      icon: "fa-microphone-lines",
      label: "Iqra",
      color: "from-primary-light to-primary",
    },
  ];

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden font-sans relative justify-center">
      {/* --- DESKTOP BACKDROP (Visible only on large screens) --- */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl hidden md:block pointer-events-none"
        // eslint-disable-next-line
        style={{ backgroundImage: `url(${kufiSplash})` }}
      ></div>

      {/* --- MOBILE APP SHELL CONTAINER --- */}
      <div className="flex flex-col h-full w-full max-w-[480px] bg-islamic-dark relative shadow-2xl md:border-x md:border-white/10">
        {/* --- VISUAL IDENTITY v5.0 GLOBAL BACKGROUNDS --- */}
        {/* Top Header Pattern */}
        <div 
            className="absolute top-0 left-0 w-full h-64 bg-top bg-no-repeat bg-contain -z-10 opacity-30 pointer-events-none mix-blend-screen"
            // eslint-disable-next-line
            style={{ backgroundImage: `url(${kufiHeader})` }}
        ></div>

        {/* Bottom Footer Pattern */}
        <div 
            className="absolute bottom-0 left-0 w-full h-64 bg-bottom bg-no-repeat bg-contain -z-10 opacity-20 pointer-events-none mix-blend-screen"
            // eslint-disable-next-line
            style={{ backgroundImage: `url(${kufiFooter})` }}
        ></div>

        {/* Global Gradient Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-islamic-dark/50 via-islamic-dark/90 to-islamic-dark/80 -z-10 pointer-events-none"></div>

        {/* Header with Maze Pattern */}
        <header className="h-16 bg-islamic-panel/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 shrink-0 z-20 relative overflow-hidden">
          <Link
            to="/"
            className="flex items-center gap-3 relative z-10 cursor-pointer group"
            aria-label="Go to Dashboard"
          >
            {/* 3D Logo Concept */}
            <div className="w-10 h-10 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-primary blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
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
                    className="absolute inset-0 flex items-center justify-center text-primary font-black text-sm tracking-tighter"
                  >
                    <i className="fa-solid fa-cube text-lg"></i>
                  </div>
                )}
              </div>
            </div>

            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight hidden sm:block">
              QuranPulse
            </h1>
          </Link>

          <div className="flex gap-3 relative z-10">
            <Link
              to="/admin"
              aria-label="Admin Dashboard"
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border shadow-lg ${
                currentView === NavView.ADMIN
                  ? "bg-gradient-to-br from-primary to-primary-dark border-primary/50 text-white shadow-primary/20"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
              }`}
            >
              <i className="fa-solid fa-shield-halved text-xs drop-shadow-md"></i>
            </Link>
            <Link
              to="/profile"
              aria-label="User Profile"
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border shadow-lg ${
                currentView === NavView.PROFILE
                  ? "bg-gradient-to-br from-primary to-primary-dark border-primary/50 text-white shadow-primary/20"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
              }`}
            >
              <i className="fa-solid fa-user text-xs drop-shadow-md"></i>
            </Link>
          </div>
        </header>

        {/* Main Content Area (Scrollable) */}
        <main className="flex-1 overflow-y-auto pb-28 relative no-scrollbar bg-transparent w-full">
          <Outlet />
        </main>

        {/* 3D Floating Bottom Navigation - Floating Island Design */}
        <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-50 pointer-events-none">
          {/* Glass Container */}
          <div className="bg-islamic-panel/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] pointer-events-auto py-2 px-1">
            <div className="flex justify-around items-center w-full">
              {navItems.map((item, index) => {
                const isActive = currentView === item.id;
                // Center item is larger and lifted
                const isCenter = index === 2;

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    aria-label={item.label}
                    className={`relative group flex flex-col items-center justify-center transition-all duration-300 ${
                      isCenter ? "-mt-8" : ""
                    }`}
                  >
                    {/* Active Background Glow */}
                    {isActive && (
                      <div
                        className={`absolute inset-0 bg-gradient-to-tr ${item.color} blur-xl opacity-40 rounded-full`}
                      ></div>
                    )}

                    {/* 3D Icon Container */}
                    <div
                      className={`
                            relative rounded-full flex items-center justify-center transition-all duration-300 border
                            ${isCenter ? "w-14 h-14" : "w-10 h-10"}
                            ${
                              isActive
                                ? `bg-gradient-to-br ${
                                    item.color
                                  } border-white/20 shadow-lg shadow-black/30 scale-110 ${
                                    isCenter ? "rotate-0" : "rotate-3"
                                  }`
                                : "bg-transparent border-transparent text-slate-500 group-hover:bg-white/5 group-hover:text-slate-300"
                            }
                        `}
                    >
                      {/* Inner Glass Reflection for Active State */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
                      )}

                      <i
                        className={`fa-solid ${item.icon} ${
                          isCenter ? "text-2xl" : "text-lg"
                        } transition-all duration-300 ${
                          isActive
                            ? "text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
                            : ""
                        }`}
                      ></i>
                    </div>

                    {/* Active Indicator Dot (Bottom) */}
                    {isActive && !isCenter && (
                      <div
                        className={`absolute -bottom-2 w-1 h-1 rounded-full bg-gradient-to-r ${item.color}`}
                      ></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
