import React, { useEffect, useState } from 'react';
import { UserProfile, NavView } from '../types';
import { DAILY_QUOTE } from '../constants';
import { getPrayerTimes, getNextPrayer, PrayerTimes, HijriDate } from '../services/prayerService';
import { useData } from '../services/DataContext'; // CMS Integration

interface DashboardProps {
  user: UserProfile;
  onNavigate: (view: NavView) => void;
}

interface Deed {
    id: string;
    label: string;
    color: string;
}

const DAILY_DEEDS_LIST: Deed[] = [
    { id: '1', label: "Read Surah Al-Mulk", color: 'text-purple-400' },
    { id: '2', label: "Morning Adhkar", color: 'text-blue-400' },
    { id: '3', label: "Give Sadaqah", color: 'text-orange-400' },
];

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const { announcements } = useData(); // Fetch CMS Announcements
  const [prayerData, setPrayerData] = useState<{ timings: PrayerTimes; date: HijriDate } | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [timeOfDay, setTimeOfDay] = useState<'MORNING' | 'DAY' | 'NIGHT'>('DAY');
  const [greetingText, setGreetingText] = useState("");

  // Daily Deeds State with Persistence
  const [completedDeeds, setCompletedDeeds] = useState<string[]>([]);
  
  useEffect(() => {
      // Load Completed Deeds from LocalStorage (Reset daily)
      const savedDeeds = localStorage.getItem('daily_deeds');
      const savedDate = localStorage.getItem('daily_deeds_date');
      const today = new Date().toDateString();

      if (savedDate === today && savedDeeds) {
          setCompletedDeeds(JSON.parse(savedDeeds));
      } else {
          // Reset if new day
          localStorage.setItem('daily_deeds_date', today);
          localStorage.setItem('daily_deeds', JSON.stringify([]));
          setCompletedDeeds([]);
      }
  }, []);

  const toggleDeed = (id: string) => {
      setCompletedDeeds(prev => {
          const newState = prev.includes(id) 
             ? prev.filter(d => d !== id)
             : [...prev, id];
          localStorage.setItem('daily_deeds', JSON.stringify(newState));
          return newState;
      });
  };

  useEffect(() => {
    // Mock location for Kuala Lumpur
    getPrayerTimes(3.1390, 101.6869).then(data => {
      setPrayerData(data);
      setNextPrayer(getNextPrayer(data.timings));
    });

    // Smart Greeting Logic
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 7) {
        setTimeOfDay('MORNING');
        setGreetingText("Assalamualaikum, Salam Subuh yang barakah.");
    } else if (hour >= 7 && hour < 11) {
        setTimeOfDay('MORNING');
        setGreetingText(`Salam Dhuha, ${user.name.split(' ')[0]}.`);
    } else if (hour >= 11 && hour < 19) {
        setTimeOfDay('DAY');
        setGreetingText("Teruskan usaha, semoga hari ini produktif.");
    } else {
        setTimeOfDay('NIGHT');
        setGreetingText("Selamat berehat, jangan lupa Al-Mulk.");
    }
  }, [user.name]);

  // Live Countdown Logic
  useEffect(() => {
      if (!nextPrayer || !nextPrayer.time) return;

      const timer = setInterval(() => {
          const now = new Date();
          const parts = nextPrayer.time.split(':');
          if (parts.length !== 2) return;
          
          const [hours, minutes] = parts.map(Number);
          const next = new Date();
          next.setHours(hours, minutes, 0, 0);

          if (next < now) {
              // Prayer is tomorrow (simple logic handle)
              next.setDate(next.getDate() + 1);
          }

          const diff = next.getTime() - now.getTime();
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);

          setTimeRemaining(`${h}h ${m}m ${s}s`);
      }, 1000);

      return () => clearInterval(timer);
  }, [nextPrayer]);

  const handleShareQuote = async () => {
    const text = `"${DAILY_QUOTE.translation}"\n\n${DAILY_QUOTE.arabic}\n\n- ${DAILY_QUOTE.ref}\n\nShared via Quran Pulse`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Daily Inspiration', text: text }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(text);
      alert('Quote copied!');
    }
  };

  // Dynamic Background Classes - v6.0 Upgrade
  const getBgClass = () => {
      switch(timeOfDay) {
          case 'MORNING': return 'bg-gradient-to-br from-blue-300 via-teal-100 to-white text-slate-800';
          case 'DAY': return 'bg-gradient-to-br from-amber-50 via-orange-50 to-white text-slate-800';
          case 'NIGHT': return 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white';
      }
  };
  
  const isDark = timeOfDay === 'NIGHT';

  // Reusable 3D Quick Action Component
  const QuickAction = ({ label, icon, gradient, onClick, delay }: any) => (
      <button 
        onClick={onClick}
        className="group relative flex flex-col items-center gap-2 p-1 animate-slide-up"
        style={{ animationDelay: delay }}
      >
          {/* 3D Icon Container */}
          <div className="relative w-16 h-16 transition-transform duration-300 group-hover:-translate-y-2 group-active:scale-95">
             {/* Glow / Shadow */}
             <div className={`absolute inset-0 bg-gradient-to-br ${gradient} blur-xl opacity-30 group-hover:opacity-60 transition-opacity rounded-2xl`}></div>
             
             {/* The Button Body */}
             <div className={`relative w-full h-full rounded-2xl bg-gradient-to-br ${gradient} p-[1px] shadow-2xl`}>
                 <div className="w-full h-full rounded-2xl bg-gradient-to-b from-white/10 to-black/10 backdrop-blur-sm border-t border-white/40 flex items-center justify-center relative overflow-hidden">
                     {/* Glossy sheen */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50 pointer-events-none"></div>
                     
                     <i className={`fa-solid ${icon} text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]`}></i>
                 </div>
             </div>
          </div>
          <span className={`text-[11px] font-bold ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-600 group-hover:text-black'} transition-colors`}>{label}</span>
      </button>
  );

  return (
    <div className={`p-4 space-y-8 animate-fade-in pb-24 relative ${getBgClass()} transition-colors duration-1000 min-h-full`}>
      
      {/* CMS ANNOUNCEMENTS BANNER */}
      {announcements.filter(a => a.active).map(a => (
          <div key={a.id} className={`rounded-xl p-3 border flex items-start gap-3 animate-slide-up ${
              a.type === 'SUCCESS' ? 'bg-green-500/10 border-green-500/20 text-green-800 dark:text-green-200' : 
              a.type === 'WARNING' ? 'bg-orange-500/10 border-orange-500/20 text-orange-800 dark:text-orange-200' :
              'bg-blue-500/10 border-blue-500/20 text-blue-800 dark:text-blue-200'
          }`}>
              <i className={`fa-solid mt-0.5 ${a.type === 'SUCCESS' ? 'fa-check-circle' : a.type === 'WARNING' ? 'fa-triangle-exclamation' : 'fa-circle-info'}`}></i>
              <div>
                  <p className="text-xs font-bold uppercase">{a.title}</p>
                  <p className="text-sm">{a.message}</p>
              </div>
          </div>
      ))}

      {/* Top Bar: Greeting & Hijri Date */}
      <div className="flex justify-between items-center px-1">
        <div>
           <div className="flex flex-col gap-0.5">
                <h2 className={`text-xl font-bold font-sans tracking-tight drop-shadow-md ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {greetingText}
                </h2>
                {prayerData ? (
                    <p className={`text-xs font-bold tracking-wide uppercase ${isDark ? 'text-teal-400' : 'text-teal-700'}`}>
                        {prayerData.date.weekday.en} • {prayerData.date.day} {prayerData.date.month.en} {prayerData.date.year}
                    </p>
                ) : (
                    <p className="text-xs text-slate-500">Loading date...</p>
                )}
           </div>
        </div>
        
        {/* Barakah Points Widget */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-inner ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200'}`}>
            <i className="fa-solid fa-gem text-gold-400 text-xs"></i>
            <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-gold-100' : 'text-slate-800'}`}>{user.barakah_points} BP</span>
            
            {/* Cloud Status Dot */}
            <div className="ml-1 w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Cloud Sync Active"></div>
        </div>
      </div>

      {/* HERO: 3D Glass Prayer Card */}
      <div className="relative rounded-[2rem] h-52 shadow-[0_20px_50px_-12px_rgba(79,70,229,0.3)] group transform transition-all hover:scale-[1.01]">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-[2rem] overflow-hidden border border-white/10">
             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <p className="text-[10px] font-bold text-purple-200 uppercase tracking-widest">Next Prayer</p>
                    </div>
                    <h1 className="text-4xl font-bold text-white font-serif drop-shadow-lg">{nextPrayer?.name || "Loading..."}</h1>
                </div>
                <div className="text-right">
                    <p className="text-4xl font-bold text-white drop-shadow-lg font-mono">{nextPrayer?.time}</p>
                    <p className="text-[10px] text-purple-200 uppercase tracking-widest font-bold">
                        {timeRemaining ? `In ${timeRemaining}` : 'Calculating...'}
                    </p>
                </div>
            </div>

            {/* Glassy Prayer Strip */}
            <div className="flex justify-between items-center bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-lg">
                {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => {
                    const isActive = nextPrayer?.name === p;
                    return (
                        <div key={p} className={`flex flex-col items-center transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-50'}`}>
                            <span className={`text-[9px] font-bold uppercase mb-1 ${isActive ? 'text-teal-300' : 'text-slate-300'}`}>{p.charAt(0)}</span>
                            {isActive ? (
                                <i className="fa-solid fa-circle-check text-teal-400 text-xs drop-shadow-[0_0_5px_rgba(45,212,191,0.8)]"></i>
                            ) : (
                                <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
      </div>

      {/* 3D Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Deen Level Card */}
        <div className={`relative rounded-3xl p-5 border backdrop-blur-sm overflow-hidden group ${isDark ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white/60 border-slate-200/50'}`}>
             <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <i className="fa-solid fa-star text-6xl text-teal-400 rotate-12"></i>
             </div>
             
             <div className="flex items-center gap-3 mb-3 relative z-10">
                 <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20 text-white border-t border-white/20">
                     <i className="fa-solid fa-trophy text-sm"></i>
                 </div>
                 <span className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Deen Lvl</span>
             </div>
             <p className={`text-3xl font-bold relative z-10 ${isDark ? 'text-white' : 'text-slate-800'}`}>{Math.floor(user.xp_total / 100)}</p>
             <div className="w-full h-2 bg-slate-800 rounded-full mt-4 overflow-hidden relative z-10 box-inner-shadow">
                 <div className="h-full bg-gradient-to-r from-teal-400 to-teal-600 w-3/4 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]"></div>
             </div>
        </div>

        {/* Streak Card */}
        <div className={`relative rounded-3xl p-5 border backdrop-blur-sm overflow-hidden group ${isDark ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white/60 border-slate-200/50'}`}>
             <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <i className="fa-solid fa-fire text-6xl text-orange-500 rotate-12"></i>
             </div>
             
             <div className="flex items-center gap-3 mb-3 relative z-10">
                 <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white border-t border-white/20">
                     <i className="fa-solid fa-fire-flame-curved text-sm"></i>
                 </div>
                 <span className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Streak</span>
             </div>
             <p className={`text-3xl font-bold relative z-10 ${isDark ? 'text-white' : 'text-slate-800'}`}>{user.streak} <span className="text-xs text-slate-500 font-normal">Days</span></p>
             <p className="text-[10px] text-orange-400 mt-4 font-bold flex items-center gap-1">
                 <i className="fa-solid fa-arrow-trend-up"></i> Keep it burning!
             </p>
        </div>
      </div>

      {/* 3D App Icon Grid - Expanded for Easy Access */}
      <div>
          <h3 className={`font-bold text-sm mb-4 px-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Explore Apps</h3>
          <div className="grid grid-cols-3 gap-3">
              <QuickAction 
                label="Quran" 
                icon="fa-book-quran" 
                gradient="from-emerald-400 to-teal-600" 
                onClick={() => onNavigate(NavView.QURAN)}
                delay="0ms"
              />
              <QuickAction 
                label="Ustaz AI" 
                icon="fa-user-astronaut" 
                gradient="from-blue-400 to-indigo-600" 
                onClick={() => onNavigate(NavView.SMART_DEEN)} 
                delay="50ms"
              />
              <QuickAction 
                label="Iqra Voice" 
                icon="fa-microphone-lines" 
                gradient="from-purple-400 to-pink-600" 
                onClick={() => onNavigate(NavView.IQRA)}
                delay="100ms" 
              />
              <QuickAction 
                label="Ibadah" 
                icon="fa-kaaba" 
                gradient="from-amber-400 to-orange-600" 
                onClick={() => onNavigate(NavView.IBADAH)}
                delay="150ms" 
              />
              <QuickAction 
                label="Souq" 
                icon="fa-shop" 
                gradient="from-rose-400 to-red-600" 
                onClick={() => onNavigate(NavView.SOUQ)}
                delay="200ms" 
              />
              <QuickAction 
                label="Media Hub" 
                icon="fa-clapperboard" 
                gradient="from-cyan-400 to-blue-500" 
                onClick={() => onNavigate(NavView.MEDIA_STUDIO)}
                delay="250ms" 
              />
          </div>
      </div>

      {/* Daily Deeds Checklist (Interactive) */}
      <div className={`rounded-3xl p-1 border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-slate-200'}`}>
          <div className={`rounded-[20px] p-5 border ${isDark ? 'bg-slate-900 border-slate-800/50' : 'bg-white border-slate-100'}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}">
                    <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center text-green-400 text-xs border border-green-500/30">
                        <i className="fa-solid fa-list-check"></i>
                    </div>
                    Daily Deeds
                </h3>
                <span className={`text-[10px] border px-2 py-1 rounded font-mono ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                    {completedDeeds.length}/{DAILY_DEEDS_LIST.length}
                </span>
            </div>
            <div className="space-y-2">
                {DAILY_DEEDS_LIST.map((item, i) => {
                    const isDone = completedDeeds.includes(item.id);
                    return (
                        <div 
                            key={i} 
                            onClick={() => toggleDeed(item.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors group ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                        >
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${isDone ? 'bg-green-500 border-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-transparent border-slate-400 group-hover:border-slate-500'}`}>
                                {isDone && <i className="fa-solid fa-check text-xs font-bold"></i>}
                            </div>
                            <span className={`text-sm font-medium transition-all ${isDone ? 'text-slate-500 line-through' : (isDark ? 'text-slate-200' : 'text-slate-800')}`}>{item.label}</span>
                        </div>
                    );
                })}
            </div>
          </div>
      </div>

      {/* Daily Inspiration */}
      <div className="relative p-[1px] rounded-3xl bg-gradient-to-r from-teal-500/30 via-purple-500/30 to-amber-500/30 shadow-lg">
          <div className={`rounded-[23px] p-6 relative overflow-hidden text-center ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-purple-500 to-amber-500 opacity-50"></div>
              <i className="fa-solid fa-quote-left text-3xl opacity-5 absolute top-6 left-6"></i>
              
              <div className={`font-arabic text-2xl mb-4 leading-loose drop-shadow-md ${isDark ? 'text-slate-100' : 'text-slate-800'}`} dir="rtl">
                {DAILY_QUOTE.arabic}
              </div>
              <p className="text-slate-500 italic text-sm mb-3 font-light">"{DAILY_QUOTE.translation}"</p>
              <div className="inline-block px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                  {DAILY_QUOTE.ref}
              </div>
              
              <button 
                  onClick={handleShareQuote}
                  className="mt-6 text-slate-500 hover:text-teal-500 transition-colors text-xs flex items-center justify-center gap-2 w-full"
              >
                  <i className="fa-solid fa-share-nodes"></i> Share with friends
              </button>
          </div>
      </div>
      
    </div>
  );
};

export default Dashboard;