import React from 'react';
import { motion } from 'framer-motion';

// Screen content for each phone
const HomeScreen: React.FC = () => (
    <div className="absolute inset-0 bg-[#020617] rounded-[2.5rem] overflow-hidden flex flex-col">
        {/* Status Bar */}
        <div className="h-8 w-full flex justify-between items-center px-6 pt-2">
            <span className="text-[10px] font-bold text-white">9:41</span>
            <div className="flex gap-1 text-white">
                <i className="fa-solid fa-signal text-[10px]"></i>
                <i className="fa-solid fa-wifi text-[10px]"></i>
                <i className="fa-solid fa-battery-full text-[10px]"></i>
            </div>
        </div>

        {/* Header */}
        <div className="px-6 pt-4 pb-2 flex justify-between items-center">
            <div>
                <p className="text-xs text-slate-400">Assalamu Alaikum,</p>
                <h3 className="text-lg font-bold text-white">Megat Shazree</h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 border border-white/20"></div>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-2 overflow-hidden relative">
            {/* Daily Verse Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 border border-white/5 mb-4 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl"></div>
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">Daily Verse</span>
                    <i className="fa-solid fa-share-nodes text-slate-400 text-xs"></i>
                </div>
                <p className="font-arabic text-right text-xl mb-2 leading-loose text-white">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
                <p className="text-xs text-slate-300 line-clamp-2">In the name of Allah, the Entirely Merciful...</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                    { icon: 'fa-book-quran', label: 'Quran' },
                    { icon: 'fa-clock', label: 'Prayer' },
                    { icon: 'fa-compass', label: 'Qibla' },
                    { icon: 'fa-robot', label: 'AI Chat' }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-cyan-400">
                            <i className={`fa-solid ${item.icon}`}></i>
                        </div>
                        <span className="text-[9px] text-slate-400">{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Continue Learning */}
            <div className="bg-slate-900/50 rounded-2xl p-4 border border-white/5">
                <h4 className="text-sm font-bold text-white mb-3">Continue Learning</h4>
                <div className="flex items-center gap-3 bg-black/40 p-2 rounded-xl border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-purple-900/50 flex items-center justify-center text-purple-400">
                        <i className="fa-solid fa-play"></i>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-white">Surah Al-Kahf</p>
                        <div className="w-full h-1 bg-slate-800 rounded-full mt-1">
                            <div className="w-[60%] h-full bg-purple-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom Nav */}
        <div className="h-16 bg-black/80 backdrop-blur-md border-t border-white/5 flex justify-around items-center px-2">
            {['fa-house', 'fa-book-open', 'fa-layer-group', 'fa-chart-simple', 'fa-user'].map((icon, i) => (
                <div key={i} className={`w-8 h-8 flex items-center justify-center rounded-full ${i === 0 ? 'text-cyan-400 bg-cyan-900/20' : 'text-slate-500'}`}>
                    <i className={`fa-solid ${icon}`}></i>
                </div>
            ))}
        </div>
    </div>
);

const AIChatScreen: React.FC = () => (
    <div className="absolute inset-0 bg-[#020617] rounded-[2.5rem] overflow-hidden flex flex-col">
        {/* Status Bar */}
        <div className="h-8 w-full flex justify-between items-center px-6 pt-2">
            <span className="text-[10px] font-bold text-white">9:41</span>
            <div className="flex gap-1 text-white">
                <i className="fa-solid fa-signal text-[10px]"></i>
                <i className="fa-solid fa-wifi text-[10px]"></i>
                <i className="fa-solid fa-battery-full text-[10px]"></i>
            </div>
        </div>

        {/* Header */}
        <div className="px-6 pt-2 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                    <i className="fa-solid fa-robot text-white"></i>
                </div>
                <div>
                    <h3 className="text-base font-bold text-white">Ustaz AI</h3>
                    <p className="text-[10px] text-emerald-400">● Online</p>
                </div>
            </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 px-4 py-4 overflow-hidden space-y-3">
            {/* AI Message */}
            <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-robot text-cyan-400 text-[10px]"></i>
                </div>
                <div className="bg-slate-800/80 rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                    <p className="text-xs text-white leading-relaxed">Assalamualaikum! Saya Ustaz AI, boleh membantu anda dengan soalan tentang Islam. 🌙</p>
                </div>
            </div>

            {/* User Message */}
            <div className="flex justify-end">
                <div className="bg-cyan-600 rounded-2xl rounded-tr-sm p-3 max-w-[80%]">
                    <p className="text-xs text-white">Apakah hukum solat tahajud?</p>
                </div>
            </div>

            {/* AI Message */}
            <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-robot text-cyan-400 text-[10px]"></i>
                </div>
                <div className="bg-slate-800/80 rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                    <p className="text-xs text-white leading-relaxed">Solat tahajud adalah <span className="text-emerald-400 font-bold">sunat muakkad</span>. Ia dilakukan pada sepertiga malam yang akhir...</p>
                </div>
            </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-black/50 border-t border-white/5">
            <div className="flex items-center gap-2 bg-slate-800/80 rounded-full px-4 py-2">
                <i className="fa-solid fa-paperclip text-slate-400 text-xs"></i>
                <span className="text-xs text-slate-400 flex-1">Tanya apa sahaja...</span>
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
                    <i className="fa-solid fa-paper-plane text-white text-xs"></i>
                </div>
            </div>
        </div>
    </div>
);

const PrayerScreen: React.FC = () => (
    <div className="absolute inset-0 bg-[#020617] rounded-[2.5rem] overflow-hidden flex flex-col">
        {/* Status Bar */}
        <div className="h-8 w-full flex justify-between items-center px-6 pt-2">
            <span className="text-[10px] font-bold text-white">9:41</span>
            <div className="flex gap-1 text-white">
                <i className="fa-solid fa-signal text-[10px]"></i>
                <i className="fa-solid fa-wifi text-[10px]"></i>
                <i className="fa-solid fa-battery-full text-[10px]"></i>
            </div>
        </div>

        {/* Header with Mosque */}
        <div className="relative px-6 pt-4 pb-8 bg-gradient-to-b from-cyan-900/30 to-transparent">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Waktu Solat</p>
                    <h3 className="text-2xl font-bold text-white">Kuala Lumpur</h3>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400">Jumaat</p>
                    <p className="text-lg font-bold text-white">6:42 PM</p>
                </div>
            </div>

            {/* Current Prayer */}
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-2xl p-4 shadow-lg shadow-cyan-500/30">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs text-cyan-100 uppercase tracking-wider">Waktu Sekarang</p>
                        <p className="text-2xl font-bold text-white">Maghrib</p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-white">7:23</p>
                        <p className="text-xs text-cyan-100">-18 min lagi</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Prayer Times */}
        <div className="flex-1 px-4 py-4 space-y-2">
            {[
                { name: 'Subuh', time: '5:54', icon: 'fa-sun', done: true },
                { name: 'Syuruk', time: '7:12', icon: 'fa-cloud-sun', done: true },
                { name: 'Zohor', time: '1:24', icon: 'fa-sun', done: true },
                { name: 'Asar', time: '4:42', icon: 'fa-cloud-sun', done: true },
                { name: 'Maghrib', time: '7:23', icon: 'fa-moon', active: true },
                { name: 'Isyak', time: '8:35', icon: 'fa-star', done: false }
            ].map((prayer, i) => (
                <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-xl ${prayer.active
                        ? 'bg-cyan-500/20 border border-cyan-500/50'
                        : 'bg-slate-800/50 border border-white/5'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${prayer.active ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-400'
                            }`}>
                            <i className={`fa-solid ${prayer.icon} text-xs`}></i>
                        </div>
                        <span className={`text-sm font-medium ${prayer.active ? 'text-cyan-400' : 'text-white'}`}>
                            {prayer.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${prayer.active ? 'text-cyan-400' : 'text-white'}`}>
                            {prayer.time}
                        </span>
                        {prayer.done && <i className="fa-solid fa-check text-emerald-400 text-xs"></i>}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// iPhone Frame Component
const IPhoneFrame: React.FC<{
    children: React.ReactNode;
    className?: string;
    delay?: number;
}> = ({ children, className = '', delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay }}
        className={`relative ${className}`}
    >
        {/* Phone Frame */}
        <div className="relative w-[220px] h-[450px] rounded-[3rem] bg-gradient-to-b from-slate-700 to-slate-900 p-[3px] shadow-2xl">
            {/* Inner bezel */}
            <div className="absolute inset-[3px] rounded-[2.7rem] bg-black">
                {/* Dynamic Island */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20"></div>
                {/* Screen */}
                <div className="absolute inset-[6px] rounded-[2.5rem] overflow-hidden">
                    {children}
                </div>
            </div>
        </div>

        {/* Reflection / Gloss */}
        <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
    </motion.div>
);

// Main 3 iPhone Mockup Component
const ThreePhoneMockup: React.FC = () => {
    return (
        <div className="relative flex items-center justify-center py-8">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full"></div>

            {/* 3 Phones Container */}
            <div className="relative flex items-center justify-center">
                {/* Left Phone - Prayer Times */}
                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="relative z-10 -mr-12 transform -rotate-6"
                >
                    <IPhoneFrame delay={0.2}>
                        <PrayerScreen />
                    </IPhoneFrame>
                </motion.div>

                {/* Center Phone - Home Screen (Elevated) */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-20 scale-110"
                >
                    <IPhoneFrame delay={0}>
                        <HomeScreen />
                    </IPhoneFrame>
                </motion.div>

                {/* Right Phone - AI Chat */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="relative z-10 -ml-12 transform rotate-6"
                >
                    <IPhoneFrame delay={0.4}>
                        <AIChatScreen />
                    </IPhoneFrame>
                </motion.div>
            </div>
        </div>
    );
};

export default ThreePhoneMockup;
