import React from 'react';
import { motion } from 'framer-motion';

const quickActions = [
  { id: 'qibla', label: 'Qiblat', icon: 'fa-kaaba', color: 'emerald' },
  { id: 'tasbih', label: 'Tasbih', icon: 'fa-fingerprint', color: 'teal' },
  { id: 'infaq', label: 'Infaq', icon: 'fa-hand-holding-heart', color: 'rose' },
  { id: 'takwim', label: 'Takwim', icon: 'fa-calendar-days', color: 'amber' },
  { id: 'masjid', label: 'Masjid', icon: 'fa-mosque', color: 'emerald' },
  { id: 'events', label: 'Acara', icon: 'fa-ticket', color: 'blue' }
];

interface QuickActionsProps {
    onAction: (id: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-1 no-scrollbar -mx-4 md:mx-0 px-4 md:px-0 scroll-smooth">
      {quickActions.map((action, index) => (
        <motion.button
          key={action.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAction(action.id)}
          className="flex flex-col items-center gap-2 min-w-[64px] group"
        >
          {/* Icon Circle */}
          <div className={`relative w-14 h-14 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-slate-800 transition-all duration-300 group-hover:border-${action.color}-500/50 shadow-lg`}>
            {/* Hover Glow */}
            <div className={`absolute inset-0 bg-${action.color}-500/20 blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            <i className={`fa-solid ${action.icon} text-xl text-slate-300 group-hover:text-${action.color}-400 transition-colors z-10`}></i>
          </div>

          {/* Label */}
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">
            {action.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default QuickActions;
