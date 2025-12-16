import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VerseStudioProps {
  isOpen: boolean;
  onClose: () => void;
  verseKey?: string; // e.g. "2:255"
}

const VerseStudio: React.FC<VerseStudioProps> = ({ isOpen, onClose, verseKey = "1:1" }) => {
  const [activeTab, setActiveTab] = React.useState<'CHAT' | 'TAFSIR' | 'ANALYSIS'>('ANALYSIS');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
            <div className="relative w-full h-full max-w-md bg-background-dark overflow-hidden shadow-2xl flex flex-col">
                {/* Background Assets */}
                <div className="absolute inset-0 z-0">
                    <img className="w-full h-full object-cover opacity-40 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcIF6ckGOawn5UxGZxvu6enudnlwbhj4CPTJqUs1v86YZr5wfWqoabWOCWi750LY4gH73znwA9Btty3fme0dKk-6AIOurPKpXVIQpzo3960jBJvyJsN-z7Kel6LadMOSTOIQphBVBo-FNYbrxCYE4EasQKv6nqml7wNxNN4CVHpNJPoTBaTcyiCP_zfPSxsaIRxKn7O1a1tZ4ZYTMxEBE44FuoyE5QA2GQRg6edJQwYoTb4QEs-aqK2GAch6iSSdCn-rCQsxlOosxv" alt="Galaxy" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#051324] via-[#051324]/90 to-[#051324]"></div>
                </div>
                
                {/* Header Section */}
                <div className="z-10 w-full px-6 pt-6 pb-4 border-b border-white/5 bg-[#051324]/80 backdrop-blur-md">
                   {/* Handle & Close */}
                   <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10"></div> {/* Spacer */}
                        <div className="h-1 w-12 rounded-full bg-white/20"></div>
                        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                   </div>

                   {/* Title Area */}
                   <div className="text-center mb-6">
                       <h2 className="text-xs font-bold text-primary tracking-[0.2em] uppercase mb-1">Verse Studio</h2>
                       <h1 className="text-xl text-white font-display font-medium">AI Deep Dive: <span className="font-light text-slate-300">Surah Al-Fatihah : 1</span></h1>
                   </div>

                   {/* Tabs */}
                   <div className="flex p-1 rounded-xl bg-surface-dark border border-white/10">
                       {(['CHAT', 'TAFSIR', 'ANALYSIS'] as const).map((tab) => (
                           <button 
                               key={tab}
                               onClick={() => setActiveTab(tab)}
                               className={`flex-1 py-2.5 text-[11px] font-bold tracking-wider rounded-lg transition-all ${
                                   activeTab === tab 
                                   ? 'bg-primary text-background-dark shadow-neon-sm' 
                                   : 'text-slate-400 hover:text-white hover:bg-white/5'
                               }`}
                           >
                               {tab}
                           </button>
                       ))}
                   </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 px-6 py-6">
                    
                    {activeTab === 'ANALYSIS' && (
                        <div className="space-y-6 animate-fade-in">
                             {/* Helper Text */}
                            <div className="p-4 rounded-xl bg-surface-dark/50 border border-white/5 flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">info</span>
                                <p className="text-slate-300 text-xs leading-relaxed">
                                    Tap on any word in the verse (Reading View) to see detailed morphology here. Below is the breakdown for <span className="text-white font-medium">Bismillah</span>.
                                </p>
                            </div>

                            {/* Word List */}
                            <div className="space-y-3">
                                {[
                                    { arabic: "بِسْمِ", translit: "bismi", meaning: "In (the) name", type: "Particle" },
                                    { arabic: "ٱللَّهِ", translit: "Allahi", meaning: "(of) Allah", type: "Noun" },
                                    { arabic: "ٱلرَّحْمَـٰنِ", translit: "ar-Rahmani", meaning: "the Most Gracious", type: "Adjective" },
                                    { arabic: "ٱلرَّحِيمِ", translit: "ar-Rahimi", meaning: "the Most Merciful", type: "Adjective" },
                                    { arabic: "١", translit: "1", meaning: "(1)", type: "End" },
                                ].map((word, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-surface-dark border border-white/5 hover:border-primary/30 group transition-all cursor-pointer">
                                         <div className="flex flex-col gap-0.5">
                                            <span className="text-xs text-primary font-medium uppercase tracking-wider">{word.type}</span>
                                            <span className="text-sm text-slate-300">{word.meaning}</span>
                                         </div>
                                         <div className="text-right">
                                             <span className="font-arabic text-2xl text-white group-hover:text-primary transition-colors">{word.arabic}</span>
                                             {/* <div className="text-[10px] text-slate-500 font-code mt-1">{word.translit}</div> */}
                                         </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'TAFSIR' && (
                         <div className="space-y-4 animate-fade-in">
                             <div className="relative w-full rounded-2xl bg-gradient-to-b from-blue-500/10 to-blue-500/[0.02] border border-white/10 p-5 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
                                    <h4 className="text-primary text-sm font-bold">Neural Insight</h4>
                                </div>
                                <p className="text-slate-200 text-sm leading-relaxed">
                                    This verse, known as <span className="text-white italic">Basmala</span>, establishes the etiquette of beginning every action with God's name. The pairing of <span className="text-white font-medium">Ar-Rahman</span> (entirely merciful to all) and <span className="text-white font-medium">Ar-Rahim</span> (specifically merciful to believers) encompasses the totality of Divine Mercy.
                                </p>
                             </div>
                             
                             <div className="p-4 rounded-2xl bg-surface-dark border border-white/5">
                                 <h4 className="text-white text-sm font-bold mb-2">Ibn Kathir</h4>
                                 <p className="text-slate-400 text-xs leading-relaxed">
                                     The Basmalah is the first verse of the Quran (according to the majority of scholars). It is a declaration of dependence on Allah...
                                 </p>
                             </div>
                         </div>
                    )}
                    
                    {activeTab === 'CHAT' && (
                        <div className="flex flex-col h-[50vh] animate-fade-in">
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 opacity-60">
                                <span className="material-symbols-outlined text-4xl text-slate-500">forum</span>
                                <p className="text-sm text-slate-400">Ask Ustaz AI about this verse...</p>
                            </div>
                             <div className="relative w-full mt-auto">
                                <input className="w-full h-12 rounded-full bg-surface-dark/80 border border-white/10 pl-5 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-all" placeholder="Type your question..." type="text"/>
                                <button className="absolute right-1.5 top-1.5 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-background-dark transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VerseStudio;
