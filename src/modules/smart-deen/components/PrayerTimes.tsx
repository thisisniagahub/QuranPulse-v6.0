import React from 'react';
import { motion } from 'framer-motion';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import QiblaCompass from '../components/QiblaCompass';
import { Sunrise, Sun, Sunset, Moon, Clock, MapPin } from 'lucide-react';

const PrayerTimes: React.FC = () => {
  const { times, qibla, nextPrayer, loading, error, hijriDate, coords } = usePrayerTimes();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-red-400">
        <p className="mb-4">Failed to load prayer times.</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700">
          Retry
        </button>
      </div>
    );
  }

  const prayerIcons = {
    fajr: <Sunrise className="w-5 h-5" />,
    sunrise: <Sun className="w-5 h-5 text-orange-400" />,
    dhuhr: <Sun className="w-5 h-5 text-yellow-400" />,
    asr: <Sun className="w-5 h-5 text-orange-300" />,
    maghrib: <Sunset className="w-5 h-5 text-purple-400" />,
    isha: <Moon className="w-5 h-5 text-blue-400" />
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 pb-24">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-600">
          Prayer Times
        </h1>
        <p className="text-slate-400 font-amiri text-lg">{hijriDate}</p>
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <MapPin className="w-3 h-3" />
          <span>{coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'Locating...'}</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Times List */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Next Prayer Card */}
          {nextPrayer && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Clock className="w-24 h-24" />
              </div>
              <p className="text-slate-400 text-sm mb-1">Next Prayer</p>
              <h2 className="text-3xl font-bold text-white capitalize mb-2">{nextPrayer.name}</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-mono text-gold-400">{nextPrayer.time}</span>
                <span className="text-sm text-slate-400">(-{nextPrayer.remaining})</span>
              </div>
            </div>
          )}

          {/* Times List */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
            {times && Object.entries(times).map(([name, time], index) => {
              const isNext = nextPrayer?.name === name;
              return (
                <div 
                  key={name}
                  className={`flex items-center justify-between p-4 border-b border-slate-800 last:border-0 transition-colors ${
                    isNext ? 'bg-gold-500/10' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isNext ? 'bg-gold-500/20 text-gold-400' : 'bg-slate-800 text-slate-400'}`}>
                      {prayerIcons[name as keyof typeof prayerIcons] || <Clock className="w-5 h-5" />}
                    </div>
                    <span className={`capitalize font-medium ${isNext ? 'text-gold-400' : 'text-slate-300'}`}>
                      {name}
                    </span>
                  </div>
                  <span className={`font-mono ${isNext ? 'text-white font-bold' : 'text-slate-400'}`}>
                    {time}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Column: Qibla & Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6 flex flex-col items-center"
        >
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 w-full flex flex-col items-center justify-center relative overflow-hidden">
             <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-8 z-10">Qibla Direction</h3>
             <QiblaCompass qiblaDirection={qibla} />
             <p className="mt-8 text-xs text-slate-500 text-center max-w-xs z-10">
               Align your phone so the needle points straight up to face the Qibla.
             </p>
             
             {/* Decorative Background */}
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-0"></div>
          </div>

          {/* Gamification Hint */}
          <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-500/20 rounded-xl p-4 w-full flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <i className="fa-solid fa-trophy"></i>
            </div>
            <div>
              <h4 className="text-emerald-400 font-bold text-sm">Earn Barakah Points</h4>
              <p className="text-xs text-emerald-200/70">Check in for prayers on time to earn +10 XP!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrayerTimes;
