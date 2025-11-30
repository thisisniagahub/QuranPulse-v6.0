import React from 'react';

const activities = [
  { id: 1, type: 'read', title: 'Completed Surah Al-Mulk', time: '4 mins ago', icon: 'fa-book-open', color: 'cyan' },
  { id: 2, type: 'learn', title: 'Lesson: Noon Sakinah', time: '2 hours ago', icon: 'fa-graduation-cap', color: 'emerald' },
  { id: 3, type: 'achievement', title: 'Achievement: Early Bird', time: '3 hours ago', icon: 'fa-trophy', color: 'amber' },
  { id: 4, type: 'live', title: 'Joined Live Session', time: 'Yesterday', icon: 'fa-video', color: 'purple' },
];

const RecentActivity: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white font-sans tracking-tight">Recent Activity</h3>
      <div className="relative pl-4 border-l border-slate-700 space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="relative pl-6 group cursor-pointer">
            {/* Timeline Dot */}
            <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-900 border-2 border-${activity.color}-500 group-hover:scale-125 transition-transform duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)]`}></div>
            
            {/* Content */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-slate-800/50 border border-white/5 flex items-center justify-center text-${activity.color}-400 group-hover:bg-${activity.color}-500/10 transition-colors`}>
                <i className={`fa-solid ${activity.icon}`}></i>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{activity.title}</h4>
                <p className="text-xs text-slate-500">{activity.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
