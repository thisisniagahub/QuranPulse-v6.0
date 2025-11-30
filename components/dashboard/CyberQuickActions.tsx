import React from 'react';
import { motion } from 'framer-motion';

const actions = [
  {
    id: 'resume',
    title: 'Resume Learning',
    subtitle: 'Surah Al-Mulk',
    icon: 'fa-book-open-reader',
    color: 'cyan',
    btnText: 'Resume'
  },
  {
    id: 'tajweed',
    title: 'Practice Tajweed',
    subtitle: 'Noon Sakinah',
    icon: 'fa-wind', // representing breath/air for tajweed
    color: 'orange',
    btnText: 'Practice'
  },
  {
    id: 'live',
    title: 'Join Live Session',
    subtitle: 'Ustadz Ahmed',
    icon: 'fa-video',
    color: 'blue',
    btnText: 'Join Now'
  },
  {
    id: 'journal',
    title: 'My Journal',
    subtitle: 'Tadabbur',
    icon: 'fa-book-journal-whills',
    color: 'amber',
    btnText: 'Write'
  }
];

const CyberQuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <motion.div
          key={action.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative group cursor-pointer"
        >
          {/* Glow Effect */}
          <div className={`absolute inset-0 bg-${action.color}-500/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
          
          {/* Card Content */}
          <div className="relative h-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 flex flex-col items-center text-center hover:border-cyan-500/50 transition-colors duration-300 overflow-hidden">
            
            {/* HUD Corner Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/30 rounded-br-lg"></div>

            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]`}>
              <i className={`fa-solid ${action.icon} text-xl text-${action.color === 'orange' ? 'orange-400' : 'cyan-400'}`}></i>
            </div>

            {/* Text */}
            <h3 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">{action.title}</h3>
            <p className="text-xs text-slate-400 mb-4">{action.subtitle}</p>

            {/* Button */}
            <button className={`mt-auto px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10 bg-white/5 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all duration-300 w-full`}>
              {action.btnText}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CyberQuickActions;
