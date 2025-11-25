
import React from 'react';
import { NavView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: NavView;
  onNavigate: (view: NavView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  
  // IF ADMIN VIEW: Render children directly without the Mobile App Shell (Header/Nav)
  if (currentView === (NavView.ADMIN as NavView)) {
      return (
          <div className="h-screen w-full bg-islamic-dark text-slate-200 overflow-hidden font-sans">
              {children}
          </div>
      );
  }

  // Optimized to 5 Core Items for cleaner UI
  const navItems = [
    { id: NavView.DASHBOARD, icon: 'fa-house', label: 'Home', color: 'from-blue-400 to-indigo-600' },
    { id: NavView.QURAN, icon: 'fa-book-quran', label: 'Quran', color: 'from-primary-light to-primary' },
    // Center Highlighted Item (Ustaz AI)
    { id: NavView.SMART_DEEN, icon: 'fa-user-astronaut', label: 'Ustaz', color: 'from-purple-400 to-pink-600', highlight: true },
    { id: NavView.IBADAH, icon: 'fa-kaaba', label: 'Ibadah', color: 'from-secondary-light to-secondary' },
    { id: NavView.IQRA, icon: 'fa-microphone-lines', label: 'Iqra', color: 'from-cyan-400 to-blue-500' },
  ];

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden font-sans relative justify-center">
      
      {/* --- DESKTOP BACKDROP (Visible only on large screens) --- */}
      <div className="absolute inset-0 bg-[url('src/assets/bg/kufi-splash.jpg')] bg-cover bg-center opacity-20 blur-xl hidden md:block pointer-events-none"></div>
      
      {/* --- MOBILE APP SHELL CONTAINER --- */}
      <div className="flex flex-col h-full w-full max-w-[480px] bg-islamic-dark relative shadow-2xl md:border-x md:border-white/10">
          
          {/* --- BACKGROUND PATTERN IMPLEMENTATION --- */}
          <div className="absolute inset-0 bg-pattern-main opacity-25 pointer-events-none z-0"></div>

          {/* --- VISUAL IDENTITY v5.0 GLOBAL BACKGROUNDS --- */}
          {/* Top Header Pattern (Layered over main pattern) */}
          <div className="absolute top-0 left-0 w-full h-64 bg-[url('src/assets/bg/kufi-header.jpg')] bg-top bg-no-repeat bg-contain -z-10 opacity-30 pointer-events-none mix-blend-screen"></div>
          
          {/* Bottom Footer Pattern */}
          <div className="absolute bottom-0 left-0 w-full h-64 bg-[url('src/assets/bg/kufi-footer.jpg')] bg-bottom bg-no-repeat bg-contain -z-10 opacity-20 pointer-events-none mix-blend-screen"></div>

          {/* Global Gradient Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-islamic-dark/50 via-islamic-dark/90 to-islamic-dark/80 -z-10 pointer-events-none"></div>


          {/* Header */}
          <header className="h-16 bg-islamic-panel/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 shrink-0 z-20 relative overflow-hidden">
            
            <div 
                className="flex items-center gap-3 relative z-10 cursor-pointer group" 
                onClick={() => onNavigate(NavView.DASHBOARD)}
                aria-label="Go to Dashboard"
                role="button"
            >
              {/* --- HEADER LOGO IMPLEMENTATION --- */}
              <div className="w-10 h-10 relative flex items-center justify-center">
                 <div className="absolute inset-0 bg-primary blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                 <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-white/10 shadow-inner flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                    <img 
                       src="/logo.png" 
                       alt="App Logo" 
                       className="w-8 h-8 object-contain logo-glow z-10"
                       onError={(e) => {
                         e.currentTarget.style.display = 'none';
                         document.getElementById('nav-logo-fallback')!.style.display = 'flex';
                       }}
                     />
                     <div id="nav-logo-fallback" className="hidden absolute inset-0 items-center justify-center text-primary font-black text-sm tracking-tighter">QP</div>
                 </div>
              </div>

              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight hidden sm:block">
                QuranPulse
              </h1>
            </div>

            <div className="flex gap-3 relative z-10">
              <button 
                onClick={() => onNavigate(NavView.ADMIN)}
                aria-label="Admin Dashboard"
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border shadow-lg ${
                    currentView === NavView.ADMIN 
                    ? 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400/50 text-white shadow-purple-500/20' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                }`}
              >
                <i className="fa-solid fa-shield-halved text-xs drop-shadow-md"></i>
              </button>
              <button 
                onClick={() => onNavigate(NavView.PROFILE)}
                aria-label="User Profile"
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border shadow-lg ${
                    currentView === NavView.PROFILE 
                    ? 'bg-gradient-to-br from-primary to-primary-dark border-primary/50 text-white shadow-primary/20' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                }`}
              >
                <i className="fa-solid fa-user text-xs drop-shadow-md"></i>
              </button>
            </div>
          </header>

          {/* Main Content Area (Scrollable) */}
          <main className="flex-1 overflow-y-auto pb-28 relative no-scrollbar bg-transparent w-full z-10">
            {children}
          </main>

          {/* 3D Floating Bottom Navigation */}
          <nav className="absolute bottom-0 w-full pb-safe z-50 pointer-events-none">
            {/* Glass Container */}
            <div className="bg-islamic-panel/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pointer-events-auto pb-3 pt-2 px-2">
                <div className="flex justify-around items-end w-full">
                  {navItems.map((item, index) => {
                    const isActive = currentView === item.id;
                    // Center item is larger and lifted
                    const isCenter = index === 2; 
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        aria-label={item.label}
                        className={`relative group flex flex-col items-center justify-center w-16 h-16 transition-all duration-300 ${isActive ? (isCenter ? '-translate-y-6' : '-translate-y-3') : ''}`}
                      >
                        {/* Active Background Glow */}
                        {isActive && (
                            <div className={`absolute inset-0 bg-gradient-to-tr ${item.color} blur-xl opacity-40 rounded-full`}></div>
                        )}

                        {/* 3D Icon Container */}
                        <div className={`
                            relative rounded-2xl flex items-center justify-center transition-all duration-300 border
                            ${isCenter ? 'w-14 h-14' : 'w-12 h-12'}
                            ${isActive 
                                ? `bg-gradient-to-br ${item.color} border-white/20 shadow-lg shadow-black/30 scale-110 ${isCenter ? 'rotate-0' : 'rotate-3'}` 
                                : 'bg-transparent border-transparent text-slate-500 group-hover:bg-slate-800 group-hover:text-slate-300'
                            }
                        `}>
                            {/* Inner Glass Reflection for Active State */}
                            {isActive && (
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
                            )}
                            
                            <i className={`fa-solid ${item.icon} ${isCenter ? 'text-2xl' : 'text-xl'} transition-all duration-300 ${isActive ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]' : ''}`}></i>
                        </div>

                        {/* Label - Now opacity controlled for better UX but still subtle */}
                        <span className={`text-[9px] font-bold mt-1 transition-all duration-300 ${
                            isActive 
                            ? 'text-white translate-y-0 opacity-100' 
                            : 'text-slate-500 translate-y-2 opacity-60 group-hover:opacity-100 group-hover:translate-y-0'
                        }`}>
                            {item.label}
                        </span>
                        
                        {/* Active Indicator Dot (Bottom) */}
                        {isActive && (
                          <div className={`absolute -bottom-2 w-8 h-1 rounded-full bg-gradient-to-r ${item.color} blur-[2px]`}></div>
                        )}
                      </button>
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