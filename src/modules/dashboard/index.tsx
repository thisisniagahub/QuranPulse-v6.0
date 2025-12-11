import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile, NavView } from '../../types';
import { useGreeting } from '../../hooks/useGreeting';
import { useGamification } from '../../contexts/GamificationContext';

interface DashboardProps {
  user: UserProfile;
  onNavigate: (view: NavView) => void;
}

// Quick Action Button Component
const QuickAction = ({ icon, label, description, color, onClick }: {
  icon: string; label: string; description: string; color: string; onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full p-4 rounded-2xl bg-gradient-to-br ${color} border border-white/10 text-left transition-all hover:shadow-lg`}
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
        <i className={`fa-solid ${icon} text-xl text-white`} />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-white text-base">{label}</h3>
        <p className="text-xs text-white/70">{description}</p>
      </div>
      <i className="fa-solid fa-chevron-right text-white/50" />
    </div>
  </motion.button>
);

// Prayer Time Widget
const PrayerTimeWidget = () => {
  const currentPrayer = { name: 'Asr', time: '4:30 PM', remaining: '2h 15m' };
  const nextPrayer = { name: 'Maghrib', time: '7:15 PM' };
  
  return (
    <div className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 rounded-2xl p-5 border border-emerald-500/20">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs text-emerald-400 uppercase font-bold tracking-wider">Waktu Solat</p>
          <h3 className="text-2xl font-bold text-white">{currentPrayer.name}</h3>
        </div>
        <div className="text-right">
          <p className="text-white font-bold text-lg">{currentPrayer.time}</p>
          <p className="text-xs text-emerald-400">{currentPrayer.remaining} lagi</p>
        </div>
      </div>
      <div className="flex gap-2 pt-3 border-t border-white/10">
        <span className="text-xs text-slate-400">Seterusnya:</span>
        <span className="text-xs text-white font-medium">{nextPrayer.name} • {nextPrayer.time}</span>
      </div>
    </div>
  );
};

// Daily Progress Widget
const DailyProgressWidget = ({ xp, streak }: { xp: number; streak: number }) => (
  <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-3">Hari Ini</p>
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center p-3 bg-slate-900/50 rounded-xl">
        <p className="text-2xl font-bold text-cyan-400">{xp}</p>
        <p className="text-[10px] text-slate-400 uppercase">XP Dikumpul</p>
      </div>
      <div className="text-center p-3 bg-slate-900/50 rounded-xl">
        <p className="text-2xl font-bold text-amber-400">{streak}</p>
        <p className="text-[10px] text-slate-400 uppercase">Hari Streak</p>
      </div>
    </div>
  </div>
);

// Continue Reading Widget
const ContinueWidget = ({ surah, ayah }: { surah: string; ayah: number }) => (
  <motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    className="w-full bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-2xl p-5 border border-cyan-500/20 text-left"
  >
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-xl bg-cyan-500/20 flex items-center justify-center">
        <i className="fa-solid fa-book-quran text-2xl text-cyan-400" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-cyan-400 uppercase font-bold tracking-wider">Sambung Baca</p>
        <h3 className="text-lg font-bold text-white">{surah}</h3>
        <p className="text-xs text-slate-400">Ayat {ayah}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center">
        <i className="fa-solid fa-play text-white" />
      </div>
    </div>
  </motion.button>
);

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const { state: gameState } = useGamification();
  const { greetingText } = useGreeting(user.name);

  return (
    <div className="min-h-full pb-32 bg-slate-950">
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-cyan-900/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-5 pt-6 space-y-6">

        {/* 1. HEADER - Greeting & Profile */}
        <header className="flex justify-between items-center">
          <div>
            <p className="text-cyan-500 text-xs font-bold uppercase tracking-wider">{greetingText}</p>
            <h1 className="text-2xl font-bold text-white mt-1">{user.name}</h1>
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate(NavView.PROFILE)}
            className="relative"
          >
            <div className="w-12 h-12 rounded-full border-2 border-cyan-500/50 overflow-hidden">
              <img 
                src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white border-2 border-slate-950">
              {gameState.level}
            </div>
          </motion.button>
        </header>

        {/* 2. CONTINUE READING - Most Important Action */}
        <section>
          <ContinueWidget surah="Surah Al-Mulk" ayah={user.last_read_ayah || 1} />
        </section>

        {/* 3. PRAYER TIME - Essential Info */}
        <section>
          <PrayerTimeWidget />
        </section>

        {/* 4. QUICK ACTIONS - Main Features */}
        <section>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Menu Utama</h2>
          <div className="space-y-3">
            <QuickAction 
              icon="fa-book-quran" 
              label="Al-Quran" 
              description="Baca, dengar & hafal"
              color="from-slate-800/80 to-slate-900/80"
              onClick={() => onNavigate(NavView.QURAN)}
            />
            <QuickAction 
              icon="fa-user-astronaut" 
              label="Tanya Ustaz AI" 
              description="Soalan agama 24/7"
              color="from-slate-800/80 to-slate-900/80"
              onClick={() => onNavigate(NavView.SMART_DEEN)}
            />
            <QuickAction 
              icon="fa-book-open-reader" 
              label="Belajar Iqra" 
              description="Mengaji dari asas"
              color="from-slate-800/80 to-slate-900/80"
              onClick={() => onNavigate(NavView.IQRA)}
            />
            <QuickAction 
              icon="fa-mosque" 
              label="Ibadah" 
              description="Solat, Qiblat, Zikir"
              color="from-slate-800/80 to-slate-900/80"
              onClick={() => onNavigate(NavView.IBADAH)}
            />
          </div>
        </section>

        {/* 5. DAILY PROGRESS */}
        <section>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Kemajuan Hari Ini</h2>
          <DailyProgressWidget xp={gameState.xp} streak={gameState.streak} />
        </section>

      </div>
    </div>
  );
};

export default Dashboard;