import React, { useState } from 'react';

interface Moment {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  image_url?: string;
  likes: number;
  time: string;
  isLiked: boolean;
}

const MOCK_MOMENTS: Moment[] = [
  {
    id: '1',
    user: { name: 'Aiman Hakim' },
    content: 'Alhamdulillah, just finished my daily reading of Surah Al-Kahf. May Allah bless our Friday.',
    likes: 24,
    time: '2h ago',
    isLiked: false
  },
  {
    id: '2',
    user: { name: 'Nurul Izzah' },
    content: 'The peace I feel when listening to Sheikh Mishary is unmatched. ❤️',
    image_url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=600',
    likes: 156,
    time: '4h ago',
    isLiked: true
  }
];

const MomentsFeed: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const [moments, setMoments] = useState(MOCK_MOMENTS);

  const toggleLike = (id: string) => {
    setMoments(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          likes: m.isLiked ? m.likes - 1 : m.likes + 1,
          isLiked: !m.isLiked
        };
      }
      return m;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Community Moments</h2>
        <button className="text-sm text-cyan-400 font-bold hover:underline">View All</button>
      </div>

      {/* Create Post Input (Mock) */}
      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                MS
            </div>
            <input 
                type="text" 
                placeholder="Share a reflection..." 
                className={`flex-1 bg-transparent border-none outline-none ${isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
            />
        </div>
        <div className="flex justify-end mt-3 gap-2">
            <button className="text-slate-500 hover:text-cyan-400 transition-colors" aria-label="Upload Image">
                <i className="fa-solid fa-image"></i>
            </button>
            <button className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-1.5 rounded-full text-sm font-bold transition-all">
                Post
            </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {moments.map(moment => (
            <div key={moment.id} className={`p-5 rounded-3xl border transition-all ${isDark ? 'bg-slate-900/40 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm">
                        {moment.user.avatar ? <img src={moment.user.avatar} alt={moment.user.name} className="w-full h-full rounded-full" /> : moment.user.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{moment.user.name}</h4>
                        <p className="text-xs text-slate-500">{moment.time}</p>
                    </div>
                </div>

                <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {moment.content}
                </p>

                {moment.image_url && (
                    <div className="mb-4 rounded-2xl overflow-hidden">
                        <img src={moment.image_url} alt="Moment" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                )}

                <div className="flex items-center gap-6 text-slate-500 text-sm">
                    <button 
                        onClick={() => toggleLike(moment.id)}
                        className={`flex items-center gap-2 transition-colors ${moment.isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                    >
                        <i className={`${moment.isLiked ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                        <span>{moment.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                        <i className="fa-regular fa-comment"></i>
                        <span>Comment</span>
                    </button>
                    <button className="ml-auto hover:text-white transition-colors" aria-label="Share">
                        <i className="fa-solid fa-share-nodes"></i>
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default MomentsFeed;
