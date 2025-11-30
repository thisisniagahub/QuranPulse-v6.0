import React from 'react';

const recommendations = [
  { id: 1, title: 'New Courses: Surah Al-Kahf', image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=2070&auto=format&fit=crop', tag: 'New' },
  { id: 2, title: 'Practice Tajweed: Idgham', image: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?q=80&w=1994&auto=format&fit=crop', tag: 'Popular' },
  { id: 3, title: 'Join Live Session: Tafsir', image: 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=2070&auto=format&fit=crop', tag: 'Live' },
];

const RecommendedWidget: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white font-sans tracking-tight">Recommended for You</h3>
        <div className="flex gap-2">
          <button className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"><i className="fa-solid fa-chevron-left text-xs"></i></button>
          <button className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"><i className="fa-solid fa-chevron-right text-xs"></i></button>
        </div>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
        {recommendations.map((item) => (
          <div key={item.id} className="min-w-[200px] h-32 rounded-xl relative overflow-hidden group cursor-pointer snap-start border border-white/10">
            <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 rounded text-[10px] font-bold text-cyan-300 uppercase">
              {item.tag}
            </div>
            
            <div className="absolute bottom-3 left-3 right-3">
              <h4 className="text-xs font-bold text-white leading-tight group-hover:text-cyan-300 transition-colors">{item.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedWidget;
