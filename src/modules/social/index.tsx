import React from 'react';
import MomentsFeed from './MomentsFeed';

const Community: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-b from-cyan-900/20 to-black overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
            <h1 className="text-3xl font-bold text-white mb-1">Social Qalb</h1>
            <p className="text-cyan-400 text-sm font-bold uppercase tracking-wider">Connect with the Ummah</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-2">
            {/* Tabs (Mock) */}
            <div className="flex p-1 bg-slate-800/50 rounded-2xl mb-4">
                <button className="flex-1 py-2 rounded-xl bg-cyan-600 text-white font-bold text-sm shadow-lg">Moments</button>
                <button className="flex-1 py-2 rounded-xl text-slate-400 font-bold text-sm hover:text-white transition-colors">Circles</button>
                <button className="flex-1 py-2 rounded-xl text-slate-400 font-bold text-sm hover:text-white transition-colors">Events</button>
            </div>

            <MomentsFeed isDark={true} />
        </div>
      </div>
    </div>
  );
};

export default Community;
