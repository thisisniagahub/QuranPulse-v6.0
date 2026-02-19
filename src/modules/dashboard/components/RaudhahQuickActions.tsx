import React from 'react';
import { motion } from 'framer-motion';

const quickActions = [
  { id: 'qibla', label: 'Qiblat', icon: 'fa-kaaba', color: 'raudhah-teal' },
  { id: 'tasbih', label: 'Tasbih', icon: 'fa-fingerprint', color: 'raudhah-teal' },
  { id: 'infaq', label: 'Infaq', icon: 'fa-hand-holding-heart', color: 'raudhah-gold' },
  { id: 'takwim', label: 'Takwim', icon: 'fa-calendar-days', color: 'raudhah-teal' },
  { id: 'masjid', label: 'Masjid', icon: 'fa-mosque', color: 'raudhah-gold' },
  { id: 'events', label: 'Acara', icon: 'fa-ticket', color: 'raudhah-teal' }
];

interface RaudhahQuickActionsProps {
  onAction: (id: string) => void;
}

const RaudhahQuickActions: React.FC<RaudhahQuickActionsProps> = ({ onAction }) => {
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
          <div className="relative w-14 h-14 rounded-2xl bg-white/50 backdrop-blur-md border border-raudhah-teal/10 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 group-hover:border-raudhah-gold/50 shadow-sm">
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-raudhah-gold/5 blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <i className={`fa-solid ${action.icon} text-xl text-raudhah-teal group-hover:text-raudhah-gold transition-colors z-10`}></i>
          </div>

          {/* Label */}
          <span className="text-[10px] font-bold text-raudhah-teal/60 uppercase tracking-wider group-hover:text-raudhah-teal transition-colors">
            {action.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default RaudhahQuickActions;
