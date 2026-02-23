import React from 'react';
import { motion } from 'framer-motion';
import { Users, Sparkles, Share2 } from 'lucide-react';
import MomentsFeed from './MomentsFeed';

const Community: React.FC = () => {
  return (
    <div className="min-h-full bg-raudhah-ivory pb-32">
      {/* Header Section */}
      <div className="relative h-64 bg-raudhah-teal rounded-b-[3rem] overflow-hidden shadow-xl border-b-8 border-raudhah-ink">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-raudhah-ink/40 via-transparent to-transparent"></div>

        {/* Floating Decorative Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-48 h-48 bg-white/5 rounded-full blur-[60px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-raudhah-gold/20 rounded-full blur-[80px]"></div>

        <div className="absolute bottom-0 left-0 w-full p-8 pb-12 flex items-end justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                <Users size={20} />
              </div>
              <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em]">Komuniti Raudhah</span>
            </div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Qalb Ummah</h1>
            <p className="text-raudhah-gold text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={12} /> Hubungkan Hati dengan Kitab Allah
            </p>
          </div>
          <button className="p-4 bg-white/10 border border-white/20 rounded-2xl text-white backdrop-blur-md hover:bg-white/20 transition-all active:scale-90 shadow-lg">
            <Share2 size={24} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-4 -mt-10 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl border-2 border-raudhah-teal/10 rounded-[3rem] p-3 shadow-2xl shadow-raudhah-teal/5 glass-v7">
          {/* Nav Tabs */}
          <div className="flex p-2 bg-raudhah-teal/5 rounded-[2rem] border border-raudhah-teal/5 mb-6">
            <button className="flex-1 py-4 rounded-[1.5rem] bg-raudhah-teal text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-raudhah-teal/20 border-b-4 border-raudhah-ink flex items-center justify-center gap-3">
              Refleksi
              <div className="w-1.5 h-1.5 rounded-full bg-raudhah-gold animate-pulse"></div>
            </button>
            <button className="flex-1 py-4 rounded-[1.5rem] text-raudhah-teal/40 font-black text-xs uppercase tracking-widest hover:text-raudhah-teal transition-all">Bulatan</button>
            <button className="flex-1 py-4 rounded-[1.5rem] text-raudhah-teal/40 font-black text-xs uppercase tracking-widest hover:text-raudhah-teal transition-all">Acara</button>
          </div>

          <MomentsFeed />
        </div>
      </div>
    </div>
  );
};

export default Community;
