import React, { useRef, useEffect } from 'react';
import { UserProfile, NavView } from '../types';
import { useData } from '../services/DataContext';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useGreeting } from '../hooks/useGreeting';
import PrayerCard from './dashboard/PrayerCard';
import DailyDeeds from './dashboard/DailyDeeds';
import QuickActions from './dashboard/QuickActions';
import StatsCards from '../components/dashboard/StatsCards';
import DailyQuote from '../components/dashboard/DailyQuote';
import AnnouncementBanner from '../components/dashboard/AnnouncementBanner';
import LearningWidget from './dashboard/LearningWidget';
import CommunityPulse from './dashboard/CommunityPulse';
import { useGamification } from '../contexts/GamificationContext';

interface DashboardProps {
  user: UserProfile;
  onNavigate: (view: NavView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const { announcements } = useData();
  const { state: gameState, getLevelProgress } = useGamification();
  const { times, nextPrayer, hijriDate, loading } = usePrayerTimes();
  const { greetingText, getBackgroundClass, isDark } = useGreeting(user.name);

  const levelRef = useRef<HTMLDivElement>(null);
  const levelProgress = getLevelProgress();

  useEffect(() => {
    if (levelRef.current) {
      levelRef.current.style.width = `${levelProgress}%`;
    }
  }, [levelProgress]);

  return (
    <div className={`p-4 space-y-6 animate-fade-in pb-24 relative ${getBackgroundClass()} transition-colors duration-1000 min-h-full`}>
      
      {/* Background Layer */}
      <div className="app-bg-layer bg-downbg app-bg-subtle"></div>
      <div className="gradient-overlay-light"></div>
      
      {/* CMS ANNOUNCEMENTS BANNER */}
      <AnnouncementBanner announcements={announcements} />

      {/* Top Bar: Greeting & Hijri Date */}
      <div className="flex justify-between items-center px-1">
        <div>
           <div className="flex flex-col gap-0.5">
                <h2 className={`text-xl font-bold font-sans tracking-tight drop-shadow-md ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {greetingText}
                </h2>
                {hijriDate ? (
                    <p className={`text-xs font-bold tracking-wide uppercase ${isDark ? 'text-teal-400' : 'text-teal-700'}`}>
                        {hijriDate}
                    </p>
                ) : (
                    <p className="text-xs text-slate-500">Loading date...</p>
                )}
           </div>
        </div>
        
        {/* Level & XP Widget */}
        <div className={`flex items-center gap-3 px-3 py-1.5 rounded-full border shadow-inner ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200'}`}>
            <div className="flex flex-col items-end">
                <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-gold-100' : 'text-slate-800'}`}>Lvl {gameState.level}</span>
                <div className="w-16 h-1 bg-slate-600 rounded-full overflow-hidden mt-0.5">
                    <div 
                        ref={levelRef}
                        className="h-full bg-gold-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" 
                    ></div>
                </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-black font-bold text-xs border-2 border-white/20 shadow-lg animate-pulse-slow">
                {gameState.level}
            </div>
        </div>
      </div>

      {/* MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="space-y-6">
              {/* HERO: 3D Glass Prayer Card */}
              <PrayerCard nextPrayer={nextPrayer} timeRemaining={nextPrayer?.remaining || ''} />
              
              {/* Learning Progress Widget */}
              <LearningWidget isDark={isDark} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
              {/* 3D Stats Cards */}
              <StatsCards user={user} isDark={isDark} />
              
              {/* Community Pulse Widget */}
              <CommunityPulse isDark={isDark} />
          </div>
      </div>

      {/* 3D App Icon Grid - Expanded for Easy Access */}
      <QuickActions onNavigate={onNavigate} isDark={isDark} />

      {/* Daily Deeds Checklist (Interactive) */}
      <DailyDeeds isDark={isDark} />

      {/* Daily Inspiration */}
      <DailyQuote isDark={isDark} />
      
    </div>
  );
};

export default Dashboard;