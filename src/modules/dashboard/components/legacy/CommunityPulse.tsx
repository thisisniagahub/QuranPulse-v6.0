import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CommunityPulseProps {
  isDark: boolean;
}

const MOCK_ACTIVITIES = [
  { user: "Ahmad F.", action: "completed Surah Yasin", time: "2m ago", icon: "fa-check-circle", color: "text-green-400" },
  { user: "Sarah K.", action: "joined Khatam Group", time: "5m ago", icon: "fa-users", color: "text-blue-400" },
  { user: "Ustaz Azhar", action: "posted a new Tazkirah", time: "12m ago", icon: "fa-microphone", color: "text-purple-400" },
  { user: "You", action: "reached Level 5!", time: "1h ago", icon: "fa-trophy", color: "text-gold-400" },
];

const CommunityPulse: React.FC<CommunityPulseProps> = ({ isDark }) => {
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Rotate activities to simulate new ones coming in
      setActivities(prev => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

  return (
    <div className={`relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 ${
      isDark 
        ? 'bg-slate-900/40 border-white/10' 
        : 'bg-white/60 border-slate-200'
    } backdrop-blur-md shadow-lg h-full`}>
      
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-bold text-lg flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <i className="fa-solid fa-earth-asia text-cyan-400"></i>
          Community Pulse
        </h3>
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          Live
        </span>
      </div>

      <div className="space-y-4 relative mb-4">
          {/* Fade overlay at bottom */}
          <div className={`absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t ${isDark ? 'from-slate-900/0' : 'from-white/0'} to-transparent z-10 pointer-events-none`}></div>

          {activities.slice(0, 3).map((activity, index) => (
              <div key={index} className="flex items-start gap-3 animate-slide-up">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                      <i className={`fa-solid ${activity.icon} ${activity.color} text-xs`}></i>
                  </div>
                  <div className="flex-1">
                      <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                          <span className="font-bold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-[10px] text-slate-500">{activity.time}</p>
                  </div>
              </div>
          ))}
      </div>

      <button 
        onClick={() => navigate('/community')}
        className="w-full py-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-all border border-white/5"
      >
        View All Activity
      </button>

    </div>
  );
};

export default CommunityPulse;
