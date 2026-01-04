import React from 'react';
import { motion } from 'framer-motion';
import BentoCard from './BentoCard';

const activities = [
  { id: 1, type: 'read', title: 'Completed Surah Al-Mulk', time: '4 mins ago', icon: 'fa-book-open', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { id: 2, type: 'learn', title: 'Lesson: Noon Sakinah', time: '2 hours ago', icon: 'fa-graduation-cap', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 3, type: 'achievement', title: 'Achievement: Early Bird', time: '3 hours ago', icon: 'fa-trophy', color: 'text-amber-400', bg: 'bg-amber-500/10' },
];

const RecentActivity: React.FC = () => {
  return (
    <BentoCard className="p-6 h-full border-white/5 bg-[#0c224b]/40 backdrop-blur-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Activity</h3>
        <i className="fa-solid fa-clock-rotate-left text-slate-500 text-xs"></i>
      </div>

      <div className="space-y-5">
        {activities.map((activity, idx) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-xl ${activity.bg} border border-white/5 flex items-center justify-center ${activity.color} group-hover:scale-110 transition-transform`}>
              <i className={`fa-solid ${activity.icon} text-sm`}></i>
            </div>
            <div className="flex-1 border-b border-white/5 pb-2 last:border-0">
              <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">{activity.title}</h4>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </BentoCard>
  );
};

export default RecentActivity;
