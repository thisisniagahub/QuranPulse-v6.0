import React, { useRef, useEffect } from 'react';
import { UserProfile, NavView } from '../types';
import { useData } from '../services/DataContext';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useGreeting } from '../hooks/useGreeting';
import { useGamification } from '../contexts/GamificationContext';
import CyberStatsRing from '../components/dashboard/CyberStatsRing';
import CyberQuickActions from '../components/dashboard/CyberQuickActions';
import RecentActivity from '../components/dashboard/RecentActivity';
import RecommendedWidget from '../components/dashboard/RecommendedWidget';
import AnimatedLogo from '../components/AnimatedLogo';

interface DashboardProps {
  user: UserProfile;
  onNavigate: (view: NavView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const { announcements } = useData();
  const { state: gameState } = useGamification();
  const { greetingText, isDark } = useGreeting(user.name);

  return (
    <div className="min-h-full pb-32 relative overflow-hidden">
      
      {/* Background Layer - Cyber Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none z-0"></div>
      
      {/* Header Section */}
      <div className="relative z-10 px-6 pt-6 pb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500/50 p-0.5 relative">
            <img src={user.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Profile" className="w-full h-full rounded-full object-cover bg-slate-800" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-sans tracking-tight">
              Welcome, <span className="text-cyan-400">{user.name.split(' ')[0]}</span>!
            </h1>
            <p className="text-xs text-slate-400">Level {gameState.level} • {gameState.xp} XP</p>
          </div>
        </div>
        
        {/* Search/Menu Icons */}
        <div className="flex gap-3">
            <button aria-label="Search" className="w-10 h-10 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
             <button aria-label="Notifications" className="w-10 h-10 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <i className="fa-solid fa-bell"></i>
            </button>
        </div>
      </div>

      {/* Main Hero Section */}
      <div className="relative px-6 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 relative z-10">
            
            {/* Left: Stats Ring */}
            <div className="relative">
                <CyberStatsRing recitationProgress={80} memorizationProgress={45} />
            </div>

            {/* Center: Pulse Cube (The "Heart") */}
            <div className="relative w-48 h-48 flex items-center justify-center">
                 {/* Platform */}
                 <div className="absolute bottom-4 w-32 h-32 bg-cyan-500/10 transform rotate-45 skew-x-12 border border-cyan-500/30 blur-sm"></div>
                 <div className="absolute bottom-8 w-24 h-24 bg-cyan-400/20 transform rotate-45 skew-x-12 border border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.4)]"></div>
                 
                 {/* Floating Cube/Logo */}
                 <div className="relative z-20 transform -translate-y-4 filter drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                    <AnimatedLogo />
                 </div>
                 
                 {/* Pulse Line Overlay */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-24 z-30 pointer-events-none opacity-60">
                    <svg viewBox="0 0 100 20" className="w-full h-full stroke-cyan-400 fill-none stroke-[0.5]">
                        <path d="M0 10 H40 L45 2 L50 18 L55 10 H100" vectorEffect="non-scaling-stroke" className="animate-pulse-fast" />
                    </svg>
                 </div>
            </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-6 py-4">
        <CyberQuickActions />
      </div>

      {/* Widgets Grid */}
      <div className="px-6 py-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentActivity />
          <RecommendedWidget />
      </div>

    </div>
  );
};

export default Dashboard;