import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIqraStore } from './store/iqraStore';
import { IQRA_MASTER_DATA } from './data/master-index';
import { IqraPageStrict } from './data/iqra-1-strict';

interface IqraHubProps {
    onSelectPage: (volume: number, pageIndex: number) => void;
}

const VOLUMES = [
    { id: 1, title: "Iqra' 1", subtitle: "Huruf Tunggal", color: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/20", icon: "1", totalPages: 21 },
    { id: 2, title: "Iqra' 2", subtitle: "Huruf Bersambung", color: "from-blue-500 to-teal-500", shadow: "shadow-blue-500/20", icon: "2", totalPages: 10 },
    { id: 3, title: "Iqra' 3", subtitle: "Mad Asli", color: "from-teal-500 to-emerald-500", shadow: "shadow-teal-500/20", icon: "3", totalPages: 12 },
    { id: 4, title: "Iqra' 4", subtitle: "Baris Tanwin", color: "from-emerald-500 to-amber-500", shadow: "shadow-emerald-500/20", icon: "4", totalPages: 11 },
    { id: 5, title: "Iqra' 5", subtitle: "Waqaf & Tajwid", color: "from-pink-500 to-rose-500", shadow: "shadow-pink-500/20", icon: "5", totalPages: 11 },
    { id: 6, title: "Iqra' 6", subtitle: "Latihan & Nun Sabdu", color: "from-orange-500 to-amber-500", shadow: "shadow-orange-500/20", icon: "6", totalPages: 13 }
];

const IqraHub: React.FC<IqraHubProps> = ({ onSelectPage }) => {
    const [selectedVolume, setSelectedVolume] = useState<number | null>(null);
    const { unlockedPages, progress, lastRead, totalStars } = useIqraStore();

    // Auto-scroll to selected volume if needed
    const containerRef = React.useRef<HTMLDivElement>(null);

    const currentBookData = selectedVolume ? IQRA_MASTER_DATA[selectedVolume] : [];

    const handleVolumeSelect = (volId: number) => {
        // if (!volumes[volId].isUnlocked) return; // Optional locking logic
        setSelectedVolume(volId);
    };

    return (
        <div className="w-full h-full overflow-y-auto px-4 pb-32 no-scrollbar bg-gradient-to-b from-[#0f172a] to-[#020617]">

            <AnimatePresence mode="wait">
                {!selectedVolume ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="max-w-7xl mx-auto pt-8"
                    >
                        {/* HERO SECTION */}
                        <div className="flex flex-col md:flex-row gap-6 mb-12">
                            {/* Greeting Card */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="flex-1 bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-all duration-700"></div>

                                <h1 className="text-4xl font-black text-white mb-2">
                                    Assalamu'alaikum!
                                </h1>
                                <p className="text-slate-400 mb-6 text-lg">
                                    Ready to continue your journey?
                                </p>

                                {lastRead ? (
                                    <button
                                        onClick={() => onSelectPage(lastRead.volume, lastRead.page)}
                                        className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-3 w-fit"
                                    >
                                        <i className="fa-solid fa-play"></i>
                                        Continue Iqra' {lastRead.volume}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setSelectedVolume(1)}
                                        className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-3 w-fit"
                                    >
                                        <i className="fa-solid fa-play"></i>
                                        Start with Iqra' 1
                                    </button>
                                )}
                            </motion.div>

                            {/* Stats Card */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="w-full md:w-80 bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent"></div>
                                <div className="text-yellow-400 text-5xl mb-2 filter drop-shadow-glow">
                                    <i className="fa-solid fa-star"></i>
                                </div>
                                <div className="text-4xl font-black text-white mb-1">{totalStars}</div>
                                <div className="text-slate-400 font-medium">Total Stars</div>
                            </motion.div>
                        </div>

                        {/* VOLUMES CAROUSEL */}
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                                    Your Bookshelf
                                </span>
                            </h2>
                            <span className="text-sm text-slate-500 font-medium">Swipe to explore</span>
                        </div>

                        <div
                            ref={containerRef}
                            className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory px-2 no-scrollbar scroll-smooth"
                        >
                            {VOLUMES.map((vol, idx) => {
                                // Progress Calculation
                                const volProgress = progress[vol.id] || {};
                                const completedCount = Object.values(volProgress).filter(p => p.completed).length;
                                const total = vol.totalPages;
                                const percent = Math.round((completedCount / total) * 100);

                                // Unlock Logic: Unlocked if it's Vol 1, or if previous volume is completed
                                const isUnlocked = (() => {
                                    if (vol.id === 1) return true;
                                    const prevVol = VOLUMES.find(v => v.id === vol.id - 1);
                                    if (!prevVol) return true;

                                    const prevPrg = progress[prevVol.id] || {};
                                    const prevDone = Object.values(prevPrg).filter(p => p.completed).length;
                                    return prevDone >= prevVol.totalPages;
                                })();

                                return (
                                    <motion.button
                                        key={vol.id}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => handleVolumeSelect(vol.id)}
                                        disabled={!isUnlocked}
                                        className={`group relative flex-shrink-0 w-72 h-96 rounded-3xl snap-center text-left transition-all duration-500
                                            ${isUnlocked ? 'hover:-translate-y-2 hover:shadow-2xl' : 'opacity-60 grayscale cursor-not-allowed'}
                                        `}
                                    >
                                        {/* Background Layer */}
                                        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${vol.color} opacity-10 group-hover:opacity-20 transition-all duration-500`} />
                                        <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-white/30 transition-all duration-500" />

                                        {/* Content */}
                                        <div className="absolute inset-0 p-8 flex flex-col z-10">
                                            {/* Top Icon */}
                                            <div className="flex justify-between items-start mb-auto">
                                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${vol.color} flex items-center justify-center text-white font-black text-2xl shadow-lg ring-1 ring-white/20 group-hover:scale-110 transition-transform duration-500`}>
                                                    {vol.icon}
                                                </div>
                                                {!isUnlocked && <i className="fa-solid fa-lock text-slate-500 text-xl"></i>}
                                            </div>

                                            {/* Titles */}
                                            <div className="mb-6">
                                                <h3 className="text-3xl font-black text-white mb-2 tracking-tight group-hover:tracking-normal transition-all">{vol.title}</h3>
                                                <p className="text-slate-400 font-medium leading-tight">{vol.subtitle}</p>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="bg-slate-800/50 rounded-full h-3 w-full overflow-hidden backdrop-blur-sm">
                                                <motion.div
                                                    className={`h-full bg-gradient-to-r ${vol.color}`}
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: `${percent}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
                                                <span>{percent}% Complete</span>
                                                <span>{completedCount}/{total}</span>
                                            </div>

                                            {/* Action Text */}
                                            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-white/40 group-hover:text-white transition-colors">
                                                <span>{isUnlocked ? 'Open Book' : 'Locked'}</span>
                                                {isUnlocked && <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>}
                                            </div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="max-w-7xl mx-auto pt-8"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-6 mb-12">
                            <button
                                onClick={() => setSelectedVolume(null)}
                                title="Back to Bookshelf"
                                aria-label="Back to Bookshelf"
                                className="w-12 h-12 rounded-full bg-surface hover:bg-surface/80 border border-white/10 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                            <div>
                                <h2 className="text-3xl font-black text-white">Iqra' {selectedVolume}</h2>
                                <p className="text-slate-400">Select a page to practice</p>
                            </div>
                        </div>

                        {/* Page Path/Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {currentBookData.map((page: IqraPageStrict, index: number) => {
                                // Status Logic from Store
                                const pageStatus = progress[selectedVolume]?.[index];
                                const isCompleted = pageStatus?.completed;
                                const stars = pageStatus?.stars || 0;
                                const maxUnlocked = unlockedPages[selectedVolume] || 0;
                                const isUnlocked = index <= maxUnlocked;
                                const isCurrent = isUnlocked && !isCompleted && index === maxUnlocked;

                                return (
                                    <motion.button
                                        key={index}
                                        layoutId={`pg-${selectedVolume}-${index}`}
                                        onClick={() => isUnlocked && onSelectPage(selectedVolume, index)}
                                        disabled={!isUnlocked}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: isUnlocked ? 1 : 0.5, scale: 1 }}
                                        whileHover={isUnlocked ? { y: -5 } : {}}
                                        className={`
                                            relative h-32 rounded-2xl border flex flex-col items-center justify-center p-4 transition-all overflow-hidden
                                            ${isCurrent
                                                ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                                                : isUnlocked
                                                    ? 'bg-surface/30 border-white/5 hover:bg-surface/50 hover:border-white/20'
                                                    : 'bg-surface/10 border-white/5 cursor-not-allowed opacity-50 grayscale'
                                            }
                                        `}
                                    >
                                        <span className={`text-2xl font-black mb-1 ${isCurrent ? 'text-emerald-400' : 'text-slate-500'}`}>
                                            {index + 1}
                                        </span>

                                        {/* Status Indicators */}
                                        <div className="flex gap-1 mt-2">
                                            {[1, 2, 3].map(star => (
                                                <i key={star} className={`fa-solid fa-star text-[10px] ${star <= stars ? 'text-yellow-400' : 'text-slate-700'}`}></i>
                                            ))}
                                        </div>

                                        <span className="text-[10px] text-center text-slate-400 mt-3 line-clamp-1 w-full px-1 opacity-70">
                                            {page.focus}
                                        </span>

                                        {isCompleted && (
                                            <div className="absolute top-2 right-2 text-emerald-500 text-xs bg-emerald-500/10 p-1 rounded-full">
                                                <i className="fa-solid fa-check"></i>
                                            </div>
                                        )}
                                        {!isUnlocked && (
                                            <div className="absolute top-2 right-2 text-slate-600 text-xs">
                                                <i className="fa-solid fa-lock"></i>
                                            </div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default IqraHub;
