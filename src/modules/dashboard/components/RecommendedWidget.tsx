import React from 'react';
import { motion } from 'framer-motion';

const recommendations = [
  { id: 1, title: 'Surah Al-Kahf: The Cave of Wonders', image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=2070&auto=format&fit=crop', tag: 'New', color: 'cyan' },
  { id: 2, title: 'Practice Tajweed: Mastery of Idgham', image: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?q=80&w=1994&auto=format&fit=crop', tag: 'Popular', color: 'purple' },
  { id: 3, title: 'Join Live Session: Tafsir al-Qurtubi', image: 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=2070&auto=format&fit=crop', tag: 'Live', color: 'emerald' },
];

const RecommendedWidget: React.FC = () => {
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center group/title">
        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Discovery <span className="text-cyan-400 group-hover:animate-pulse">Pulse</span></h3>
        <div className="flex gap-2">
          <button aria-label="Previous" className="w-8 h-8 rounded-xl bg-slate-800/40 border border-white/5 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all backdrop-blur-md">
            <i className="fa-solid fa-chevron-left text-[10px]"></i>
          </button>
          <button aria-label="Next" className="w-8 h-8 rounded-xl bg-slate-800/40 border border-white/5 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all backdrop-blur-md">
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
        {recommendations.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="min-w-[220px] h-36 rounded-3xl relative overflow-hidden group cursor-pointer snap-start border border-white/10 shadow-xl shadow-black/40"
          >
            <img loading="lazy" src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

            {/* Gloss Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg text-[9px] font-black text-white uppercase tracking-widest">
              <span className={`w-1.5 h-1.5 inline-block rounded-full mr-1 ${item.color === 'cyan' ? 'bg-cyan-400' : item.color === 'purple' ? 'bg-purple-400' : 'bg-emerald-400'}`}></span>
              {item.tag}
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <h4 className="text-xs font-bold text-white leading-tight group-hover:text-cyan-400 transition-colors drop-shadow-md">{item.title}</h4>
              <div className="mt-2 h-0.5 w-0 group-hover:w-1/3 bg-cyan-500/50 transition-all duration-500"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedWidget;

