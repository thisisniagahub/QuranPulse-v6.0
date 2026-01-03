import React from 'react';
import { motion } from 'framer-motion';

// ========================================
// SCREEN CONTENT COMPONENTS
// ========================================

const HomeScreen: React.FC = () => (
    <div className="w-full h-full bg-[#020617] flex flex-col text-white overflow-hidden">
        {/* Status Bar */}
        <div className="h-7 flex justify-between items-center px-5 pt-1">
            <span className="text-[9px] font-semibold">9:41</span>
            <div className="flex gap-1">
                <i className="fa-solid fa-signal text-[8px]"></i>
                <i className="fa-solid fa-wifi text-[8px]"></i>
                <i className="fa-solid fa-battery-full text-[8px]"></i>
            </div>
        </div>

        {/* Header */}
        <div className="px-4 pt-3 pb-2 flex justify-between items-center">
            <div>
                <p className="text-[9px] text-slate-400">Assalamu Alaikum,</p>
                <h3 className="text-sm font-bold">Megat Shazree</h3>
            </div>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-600"></div>
        </div>

        {/* Daily Verse Card */}
        <div className="mx-4 mb-3 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-3 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl"></div>
            <span className="text-[8px] uppercase tracking-wider text-cyan-400 font-bold">Daily Verse</span>
            <p className="font-arabic text-right text-base mt-1 leading-relaxed">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
            <p className="text-[8px] text-slate-400 mt-1">In the name of Allah, the Merciful...</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2 px-4 mb-3">
            {[
                { icon: 'fa-book-quran', label: 'Quran' },
                { icon: 'fa-clock', label: 'Solat' },
                { icon: 'fa-compass', label: 'Qibla' },
                { icon: 'fa-robot', label: 'AI' }
            ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 text-sm">
                        <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <span className="text-[7px] text-slate-400">{item.label}</span>
                </div>
            ))}
        </div>

        {/* Continue Learning */}
        <div className="mx-4 bg-slate-900/80 rounded-xl p-3 border border-white/5">
            <h4 className="text-[10px] font-bold mb-2">Continue Learning</h4>
            <div className="flex items-center gap-2 bg-black/40 p-2 rounded-lg">
                <div className="w-8 h-8 rounded-md bg-purple-900/50 flex items-center justify-center text-purple-400">
                    <i className="fa-solid fa-play text-[10px]"></i>
                </div>
                <div className="flex-1">
                    <p className="text-[9px] font-semibold">Surah Al-Kahf</p>
                    <div className="w-full h-1 bg-slate-700 rounded-full mt-1">
                        <div className="w-[65%] h-full bg-purple-500 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Bottom Nav */}
        <div className="h-12 bg-black/90 border-t border-white/5 flex justify-around items-center">
            {['fa-house', 'fa-book-open', 'fa-layer-group', 'fa-chart-simple', 'fa-user'].map((icon, i) => (
                <div key={i} className={`w-7 h-7 flex items-center justify-center rounded-full text-xs ${i === 0 ? 'text-cyan-400 bg-cyan-900/30' : 'text-slate-500'}`}>
                    <i className={`fa-solid ${icon}`}></i>
                </div>
            ))}
        </div>
    </div>
);

const AIChatScreen: React.FC = () => (
    <div className="w-full h-full bg-[#020617] flex flex-col text-white overflow-hidden">
        {/* Status Bar */}
        <div className="h-7 flex justify-between items-center px-5 pt-1">
            <span className="text-[9px] font-semibold">9:41</span>
            <div className="flex gap-1">
                <i className="fa-solid fa-signal text-[8px]"></i>
                <i className="fa-solid fa-wifi text-[8px]"></i>
                <i className="fa-solid fa-battery-full text-[8px]"></i>
            </div>
        </div>

        {/* Header */}
        <div className="px-4 pt-2 pb-3 border-b border-white/10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <i className="fa-solid fa-robot text-white text-xs"></i>
            </div>
            <div>
                <h3 className="text-sm font-bold">Ustaz AI</h3>
                <p className="text-[8px] text-emerald-400">● Online</p>
            </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 px-3 py-3 space-y-2 overflow-hidden">
            {/* AI Message */}
            <div className="flex gap-2">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-robot text-cyan-400 text-[8px]"></i>
                </div>
                <div className="bg-slate-800 rounded-xl rounded-tl-sm p-2 max-w-[85%]">
                    <p className="text-[9px] leading-relaxed">Assalamualaikum! Saya Ustaz AI 🌙</p>
                </div>
            </div>

            {/* User Message */}
            <div className="flex justify-end">
                <div className="bg-cyan-600 rounded-xl rounded-tr-sm p-2 max-w-[85%]">
                    <p className="text-[9px]">Apakah hukum solat tahajud?</p>
                </div>
            </div>

            {/* AI Response */}
            <div className="flex gap-2">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-robot text-cyan-400 text-[8px]"></i>
                </div>
                <div className="bg-slate-800 rounded-xl rounded-tl-sm p-2 max-w-[85%]">
                    <p className="text-[9px] leading-relaxed">Solat tahajud adalah <span className="text-emerald-400 font-bold">sunat muakkad</span>. Ia dilakukan sepertiga malam...</p>
                </div>
            </div>
        </div>

        {/* Input */}
        <div className="p-3 bg-black/50 border-t border-white/5">
            <div className="flex items-center gap-2 bg-slate-800 rounded-full px-3 py-2">
                <span className="text-[9px] text-slate-400 flex-1">Tanya apa sahaja...</span>
                <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
                    <i className="fa-solid fa-paper-plane text-white text-[8px]"></i>
                </div>
            </div>
        </div>
    </div>
);

const PrayerScreen: React.FC = () => (
    <div className="w-full h-full bg-[#020617] flex flex-col text-white overflow-hidden">
        {/* Status Bar */}
        <div className="h-7 flex justify-between items-center px-5 pt-1">
            <span className="text-[9px] font-semibold">9:41</span>
            <div className="flex gap-1">
                <i className="fa-solid fa-signal text-[8px]"></i>
                <i className="fa-solid fa-wifi text-[8px]"></i>
                <i className="fa-solid fa-battery-full text-[8px]"></i>
            </div>
        </div>

        {/* Header */}
        <div className="px-4 pt-3 pb-2 bg-gradient-to-b from-cyan-900/40 to-transparent">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[8px] text-cyan-400 font-bold uppercase tracking-wider">Waktu Solat</p>
                    <h3 className="text-lg font-bold">Kuala Lumpur</h3>
                </div>
                <div className="text-right">
                    <p className="text-[8px] text-slate-400">Jumaat</p>
                    <p className="text-sm font-bold">6:42 PM</p>
                </div>
            </div>
        </div>

        {/* Current Prayer Card */}
        <div className="mx-4 mb-3 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-xl p-3 shadow-lg shadow-cyan-500/30">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-[8px] text-cyan-100 uppercase">Waktu Sekarang</p>
                    <p className="text-xl font-bold">Maghrib</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold">7:23</p>
                    <p className="text-[8px] text-cyan-100">-18 min</p>
                </div>
            </div>
        </div>

        {/* Prayer Times List */}
        <div className="flex-1 px-4 space-y-1.5 overflow-hidden">
            {[
                { name: 'Subuh', time: '5:54', done: true },
                { name: 'Zohor', time: '1:24', done: true },
                { name: 'Asar', time: '4:42', done: true },
                { name: 'Maghrib', time: '7:23', active: true },
                { name: 'Isyak', time: '8:35' }
            ].map((prayer, i) => (
                <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${prayer.active ? 'bg-cyan-500/20 border border-cyan-500/50' : 'bg-slate-800/50'
                    }`}>
                    <span className={`text-[10px] font-medium ${prayer.active ? 'text-cyan-400' : ''}`}>{prayer.name}</span>
                    <div className="flex items-center gap-1">
                        <span className={`text-[10px] font-bold ${prayer.active ? 'text-cyan-400' : ''}`}>{prayer.time}</span>
                        {prayer.done && <i className="fa-solid fa-check text-emerald-400 text-[8px]"></i>}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ========================================
// IPHONE FRAME COMPONENT
// ========================================

const IPhoneFrame: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = '' }) => (
    <div className={`relative ${className}`}>
        {/* Phone Frame - Fixed size 220x450 */}
        <div className="relative w-[220px] h-[450px] rounded-[2.5rem] bg-gradient-to-b from-slate-600 via-slate-800 to-slate-900 p-[3px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]">
            {/* Inner bezel */}
            <div className="absolute inset-[3px] rounded-[2.3rem] bg-black overflow-hidden">
                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-black rounded-full z-30 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700"></div>
                </div>
                {/* Screen */}
                <div className="absolute inset-[2px] rounded-[2.2rem] overflow-hidden bg-[#020617]">
                    {children}
                </div>
            </div>
        </div>

        {/* Glass reflection */}
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>

        {/* Bottom highlight */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
    </div>
);

// ========================================
// MAIN 3 IPHONE MOCKUP COMPONENT
// ========================================

const ThreePhoneMockup: React.FC = () => {
    return (
        <div className="relative w-full flex items-center justify-center py-8 overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[100px]"></div>
            </div>

            {/* Phones Container - Scale down on mobile */}
            <div className="relative flex items-end justify-center scale-[0.55] sm:scale-[0.7] md:scale-[0.85] lg:scale-100 origin-center">

                {/* Left Phone - Prayer Times */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0, y: [0, -12, 0] }}
                    transition={{
                        opacity: { duration: 0.8, delay: 0.2 },
                        x: { duration: 0.8, delay: 0.2 },
                        y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                    }}
                    className="relative z-10 -mr-16 transform -rotate-6 translate-y-4"
                >
                    <IPhoneFrame>
                        <PrayerScreen />
                    </IPhoneFrame>
                </motion.div>

                {/* Center Phone - Home Screen (Hero) */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: [0, -18, 0] }}
                    transition={{
                        opacity: { duration: 0.8 },
                        y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="relative z-20"
                >
                    <IPhoneFrame>
                        <HomeScreen />
                    </IPhoneFrame>

                    {/* Hero glow */}
                    <div className="absolute -inset-4 bg-cyan-400/10 rounded-[3rem] blur-2xl -z-10"></div>
                </motion.div>

                {/* Right Phone - AI Chat */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
                    transition={{
                        opacity: { duration: 0.8, delay: 0.4 },
                        x: { duration: 0.8, delay: 0.4 },
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
                    }}
                    className="relative z-10 -ml-16 transform rotate-6 translate-y-4"
                >
                    <IPhoneFrame>
                        <AIChatScreen />
                    </IPhoneFrame>
                </motion.div>
            </div>

            {/* Floor reflection */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-20 bg-gradient-to-t from-cyan-500/20 to-transparent blur-2xl rounded-full"></div>
        </div>
    );
};

export default ThreePhoneMockup;
