/**
 * 🎓 Iqra' Hub
 * The central bookshelf for digital learning modules
 * 
 * Features:
 * - Interactive Bookshelf with progress tracking
 * - Star-based achievement system
 * - Responsive page grid for each volume
 * - Raudhah Premium Design Sync
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIqraStore } from './store/iqraStore';
import { IQRA_MASTER_DATA } from './data/master-index';
import { IqraPageStrict } from './data/iqra-1-strict';
import {
    ChevronLeft, Play, Star, Lock, BookOpen,
    Trophy, Gamepad, Sparkles, Book
} from 'lucide-react';

interface IqraHubProps {
    onSelectPage: (volume: number, pageIndex: number) => void;
    onStartGame?: () => void;
}

const VOLUMES = [
    { id: 1, title: "Iqra' 1", subtitle: "Huruf Tunggal", color: "bg-raudhah-teal", accent: "text-raudhah-gold", icon: "1", totalPages: 21 },
    { id: 2, title: "Iqra' 2", subtitle: "Huruf Bersambung", color: "bg-emerald-600", accent: "text-raudhah-gold", icon: "2", totalPages: 10 },
    { id: 3, title: "Iqra' 3", subtitle: "Mad Asli", color: "bg-teal-700", accent: "text-raudhah-gold", icon: "3", totalPages: 12 },
    { id: 4, title: "Iqra' 4", subtitle: "Baris Tanwin", color: "bg-cyan-700", accent: "text-raudhah-gold", icon: "4", totalPages: 11 },
    { id: 5, title: "Iqra' 5", subtitle: "Waqaf & Tajwid", color: "bg-indigo-700", accent: "text-raudhah-gold", icon: "5", totalPages: 11 },
    { id: 6, title: "Iqra' 6", subtitle: "Latihan & Nun Sabdu", color: "bg-purple-700", accent: "text-raudhah-gold", icon: "6", totalPages: 13 }
];

const IqraHub: React.FC<IqraHubProps> = ({ onSelectPage, onStartGame }) => {
    const [selectedVolume, setSelectedVolume] = useState<number | null>(null);
    const { unlockedPages, progress, lastRead, totalStars } = useIqraStore();
    const containerRef = React.useRef<HTMLDivElement>(null);

    const currentBookData = selectedVolume ? IQRA_MASTER_DATA[selectedVolume] : [];

    const handleVolumeSelect = (volId: number) => {
        setSelectedVolume(volId);
    };

    return (
        <div className="w-full h-full min-h-screen bg-raudhah-ivory px-4 pb-32 no-scrollbar font-sans">
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
                                className="flex-1 glass-v7 rounded-3xl p-8 relative overflow-hidden group shadow-warm border border-raudhah-teal/10"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-raudhah-teal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-raudhah-teal/10 transition-all duration-700"></div>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-raudhah-teal rounded-xl flex items-center justify-center shadow-warm">
                                        <BookOpen className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-[10px] font-black text-raudhah-teal/60 uppercase tracking-widest">Digital Iqra' Library</span>
                                </div>

                                <h1 className="text-4xl font-black text-raudhah-ink mb-2">
                                    Assalamu'alaikum!
                                </h1>
                                <p className="text-raudhah-teal/60 mb-8 text-lg font-medium">
                                    Sedia untuk menyambung perjalanan anda?
                                </p>

                                {lastRead ? (
                                    <button
                                        onClick={() => onSelectPage(lastRead.volume, lastRead.page)}
                                        className="bg-raudhah-teal hover:bg-raudhah-ink text-white px-8 py-3.5 rounded-2xl font-black transition-all shadow-warm flex items-center gap-3 w-fit group/btn"
                                    >
                                        <Play className="w-5 h-5 fill-current" />
                                        Sambung Iqra' {lastRead.volume}
                                        <ChevronLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setSelectedVolume(1)}
                                        className="bg-raudhah-teal hover:bg-raudhah-ink text-white px-8 py-3.5 rounded-2xl font-black transition-all shadow-warm flex items-center gap-3 w-fit"
                                    >
                                        <Play className="w-5 h-5 fill-current" />
                                        Mula Iqra' 1
                                    </button>
                                )}
                            </motion.div>

                            {/* Stats Card */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="w-full md:w-80 glass-v7 rounded-3xl p-8 flex flex-col justify-center items-center relative overflow-hidden shadow-warm border border-raudhah-teal/10"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-raudhah-gold/10 to-transparent"></div>
                                <div className="text-raudhah-gold mb-3">
                                    <Star className="w-12 h-12 fill-current filter drop-shadow-glow" />
                                </div>
                                <div className="text-5xl font-black text-raudhah-ink mb-1">{totalStars}</div>
                                <div className="text-raudhah-teal/40 font-bold uppercase tracking-widest text-xs">Jumlah Bintang</div>
                            </motion.div>
                        </div>

                        {/* VOLUMES CAROUSEL */}
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-2xl font-black text-raudhah-ink flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-raudhah-gold" />
                                <span className="uppercase tracking-tight">Koleksi Buku</span>
                            </h2>
                            <div className="flex items-center gap-2 text-xs font-bold text-raudhah-teal/40 uppercase tracking-widest">
                                <span>Tatal untuk lihat</span>
                                <div className="w-8 h-px bg-raudhah-teal/20" />
                            </div>
                        </div>

                        <div
                            ref={containerRef}
                            className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory px-2 no-scrollbar scroll-smooth"
                        >
                            {VOLUMES.map((vol, idx) => {
                                const volProgress = progress[vol.id] || {};
                                const completedCount = Object.values(volProgress).filter(p => p.completed).length;
                                const total = vol.totalPages;
                                const percent = Math.round((completedCount / total) * 100);

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
                                        className={`group relative flex-shrink-0 w-72 h-96 rounded-[2.5rem] snap-center text-left transition-all duration-500
                                            ${isUnlocked ? 'hover:-translate-y-4 shadow-warm hover:shadow-2xl' : 'opacity-40 grayscale cursor-not-allowed'}
                                        `}
                                    >
                                        {/* Background Layer */}
                                        <div className={`absolute inset-0 rounded-[2.5rem] ${vol.color} opacity-5 group-hover:opacity-10 transition-all duration-500`} />
                                        <div className="absolute inset-0 rounded-[2.5rem] border border-raudhah-teal/10 group-hover:border-raudhah-gold/50 transition-all duration-500" />
                                        <div className="absolute inset-0 glass-v7 rounded-[2.5rem] -z-10" />

                                        {/* Content */}
                                        <div className="absolute inset-0 p-8 flex flex-col z-10">
                                            {/* Top Icon */}
                                            <div className="flex justify-between items-start mb-auto">
                                                <div className={`w-16 h-16 rounded-2xl ${vol.color} flex items-center justify-center text-white font-black text-3xl shadow-warm ring-1 ring-white/20 group-hover:scale-110 transition-transform duration-500`}>
                                                    {vol.icon}
                                                </div>
                                                {!isUnlocked && <Lock className="w-6 h-6 text-raudhah-teal/30" />}
                                                {isUnlocked && percent === 100 && <Trophy className="w-6 h-6 text-raudhah-gold animate-bounce" />}
                                            </div>

                                            {/* Titles */}
                                            <div className="mb-6">
                                                <div className="text-[10px] font-black text-raudhah-gold uppercase tracking-widest mb-1 group-hover:tracking-[0.2em] transition-all">Volume {vol.id}</div>
                                                <h3 className="text-3xl font-black text-raudhah-ink mb-1 tracking-tight">{vol.title}</h3>
                                                <p className="text-raudhah-teal/60 font-medium text-sm leading-tight">{vol.subtitle}</p>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="bg-raudhah-teal/10 rounded-full h-2 w-full overflow-hidden mb-2">
                                                <motion.div
                                                    className={`h-full ${vol.color} shadow-glow`}
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: `${percent}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-[10px] font-black text-raudhah-teal/40 uppercase tracking-widest">
                                                <span>{percent}% SELESAI</span>
                                                <span>{completedCount}/{total} MUKA</span>
                                            </div>

                                            {/* Action Text */}
                                            <div className="mt-8 flex items-center gap-2 text-xs font-black text-raudhah-teal/20 group-hover:text-raudhah-teal transition-colors uppercase tracking-widest">
                                                <span>{isUnlocked ? 'Buka Buku' : 'Terkunci'}</span>
                                                {isUnlocked && <ChevronLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />}
                                            </div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Extra Modes (Mini Games) */}
                        {onStartGame && (
                            <div className="mt-8 p-6 glass-v7 rounded-3xl border border-raudhah-teal/10 shadow-warm">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-1.5 h-6 bg-raudhah-gold rounded-full" />
                                    <h3 className="text-sm font-black text-raudhah-ink uppercase tracking-widest">Latihan Pengukuhan</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        onClick={onStartGame}
                                        className="bg-raudhah-teal/5 hover:bg-raudhah-teal/10 border border-raudhah-teal/10 p-5 rounded-2xl flex items-center gap-4 transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-raudhah-teal flex items-center justify-center text-white shadow-warm group-hover:scale-110 transition-transform">
                                            <Gamepad className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-raudhah-ink uppercase tracking-tight">Iqra' Challenge</p>
                                            <p className="text-xs text-raudhah-teal/60 font-medium">Uji kepantasan mengecam huruf</p>
                                        </div>
                                        <ChevronLeft className="w-5 h-5 rotate-180 ml-auto text-raudhah-teal/20 group-hover:text-raudhah-teal transition-colors" />
                                    </button>
                                </div>
                            </div>
                        )}
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
                                className="w-14 h-14 rounded-2xl glass-v7 hover:bg-white border border-raudhah-teal/10 text-raudhah-teal flex items-center justify-center transition-all shadow-warm hover:scale-110 active:scale-95 group"
                            >
                                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Book className="w-4 h-4 text-raudhah-gold" />
                                    <span className="text-[10px] font-black text-raudhah-teal/60 uppercase tracking-[0.2em]">Kandungan Buku</span>
                                </div>
                                <h2 className="text-4xl font-black text-raudhah-ink tracking-tight uppercase">Iqra' {selectedVolume}</h2>
                            </div>
                        </div>

                        {/* Page Path/Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {currentBookData.map((page: IqraPageStrict, index: number) => {
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
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={isUnlocked ? { y: -8, scale: 1.02 } : {}}
                                        className={`
                                            relative h-44 rounded-3xl flex flex-col items-center justify-center p-6 transition-all overflow-hidden border
                                            ${isCurrent
                                                ? 'bg-raudhah-teal/5 border-raudhah-gold/50 shadow-warm'
                                                : isUnlocked
                                                    ? 'glass-v7 border-raudhah-teal/10 hover:border-raudhah-teal/30 shadow-sm'
                                                    : 'bg-raudhah-teal/5 border-raudhah-teal/5 cursor-not-allowed opacity-30 grayscale'
                                            }
                                        `}
                                    >
                                        <div className={`absolute top-0 left-0 w-full h-1 ${isCurrent ? 'bg-raudhah-gold' : ''}`} />

                                        <span className={`text-4xl font-black mb-2 font-mono ${isCurrent ? 'text-raudhah-teal' : 'text-raudhah-ink/40'}`}>
                                            {(index + 1).toString().padStart(2, '0')}
                                        </span>

                                        {/* Status Indicators */}
                                        <div className="flex gap-1.5 mt-2 mb-4">
                                            {[1, 2, 3].map(star => (
                                                <Star key={star} className={`w-3.5 h-3.5 ${star <= stars ? 'text-raudhah-gold fill-current' : 'text-raudhah-teal/10'}`} />
                                            ))}
                                        </div>

                                        <span className="text-[10px] font-black text-center text-raudhah-teal/60 uppercase tracking-widest line-clamp-1 w-full px-1">
                                            {page.focus}
                                        </span>

                                        {/* Background Decorative */}
                                        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-raudhah-gold/5 rounded-full blur-2xl group-hover:bg-raudhah-gold/10 transition-all"></div>

                                        {isCompleted && (
                                            <div className="absolute top-3 right-3 w-6 h-6 bg-raudhah-teal rounded-full flex items-center justify-center text-white shadow-warm">
                                                <Trophy className="w-3 h-3" />
                                            </div>
                                        )}
                                        {!isUnlocked && (
                                            <div className="absolute top-3 right-3 text-raudhah-teal/20">
                                                <Lock className="w-4 h-4" />
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
