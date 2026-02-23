import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar as CalIcon } from 'lucide-react';

interface TakwimWidgetProps {
    onClose: () => void;
}

const TakwimWidget: React.FC<TakwimWidgetProps> = ({ onClose }) => {
    // Simple Hijri calculation or mock for MVP
    // In production, use 'hijri-date-kuwait' or similar lib
    const today = new Date();
    const hijriDate = new Intl.DateTimeFormat('en-TN-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(today);

    // Mock upcoming events
    const events = [
        { date: '13 Rejab', name: 'Puasa Sunat (Hari Putih)', type: 'sunnah' },
        { date: '14 Rejab', name: 'Puasa Sunat (Hari Putih)', type: 'sunnah' },
        { date: '15 Rejab', name: 'Puasa Sunat (Hari Putih)', type: 'sunnah' },
        { date: '27 Rejab', name: 'Israk Mikraj', type: 'special' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="relative w-full max-w-sm bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6 z-10 relative">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <i className="fa-solid fa-calendar-days text-amber-400"></i>
                        </div>
                        <h2 className="text-xl font-bold text-white">Takwim Islam</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Today Card */}
                <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/20 rounded-2xl p-5 mb-6 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                         <i className="fa-solid fa-moon text-6xl"></i>
                    </div>
                    <p className="text-xs font-bold text-amber-200 uppercase tracking-widest mb-1">Hari Ini</p>
                    <h1 className="text-2xl font-black text-white mb-0.5">{hijriDate}</h1>
                    <p className="text-sm font-medium text-slate-300">
                        {today.toLocaleDateString('ms-MY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>

                {/* Upcoming Events */}
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Akan Datang</h3>
                    <div className="space-y-2">
                        {events.map((event, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center border ${
                                    event.type === 'special' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                                }`}>
                                    <span className="text-xs font-bold">{event.date.split(' ')[0]}</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">{event.name}</h4>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{event.date.split(' ').slice(1).join(' ')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Background Decoration */}
                <div className={`absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-[80px] bg-amber-500/10 pointer-events-none`}></div>
            </div>
        </motion.div>
    );
};

export default TakwimWidget;
