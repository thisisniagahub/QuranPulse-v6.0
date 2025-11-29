import React, { useEffect, useState } from 'react';

interface Deed {
    id: string;
    label: string;
    color: string;
}

const DAILY_DEEDS_LIST: Deed[] = [
    { id: '1', label: "Read Surah Al-Mulk", color: 'text-purple-400' },
    { id: '2', label: "Morning Adhkar", color: 'text-blue-400' },
    { id: '3', label: "Give Sadaqah", color: 'text-orange-400' },
];

interface DailyDeedsProps {
    isDark: boolean;
}

const DailyDeeds: React.FC<DailyDeedsProps> = ({ isDark }) => {
    const [completedDeeds, setCompletedDeeds] = useState<string[]>([]);

    useEffect(() => {
        // Load Completed Deeds from LocalStorage (Reset daily)
        const savedDeeds = localStorage.getItem('daily_deeds');
        const savedDate = localStorage.getItem('daily_deeds_date');
        const today = new Date().toDateString();

        if (savedDate === today && savedDeeds) {
            setCompletedDeeds(JSON.parse(savedDeeds));
        } else {
            // Reset if new day
            localStorage.setItem('daily_deeds_date', today);
            localStorage.setItem('daily_deeds', JSON.stringify([]));
            setCompletedDeeds([]);
        }
    }, []);

    const toggleDeed = (id: string) => {
        setCompletedDeeds(prev => {
            const newState = prev.includes(id)
                ? prev.filter(d => d !== id)
                : [...prev, id];
            localStorage.setItem('daily_deeds', JSON.stringify(newState));
            return newState;
        });
    };

    return (
        <div className={`rounded-3xl p-1 border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-slate-200'}`}>
            <div className={`rounded-[20px] p-5 border ${isDark ? 'bg-slate-900 border-slate-800/50' : 'bg-white border-slate-100'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-primary text-xs border border-primary/30">
                            <i className="fa-solid fa-list-check"></i>
                        </div>
                        Daily Deeds
                    </h3>
                    <span className={`text-[10px] border px-2 py-1 rounded font-mono ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                        {completedDeeds.length}/{DAILY_DEEDS_LIST.length}
                    </span>
                </div>
                <div className="space-y-2">
                    {DAILY_DEEDS_LIST.map((item, i) => {
                        const isDone = completedDeeds.includes(item.id);
                        return (
                            <div
                                key={i}
                                onClick={() => toggleDeed(item.id)}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors group ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                            >
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${isDone ? 'bg-primary border-primary text-black shadow-[0_0_10px_rgba(0,191,165,0.4)]' : 'bg-transparent border-slate-400 group-hover:border-slate-500'}`}>
                                    {isDone && <i className="fa-solid fa-check text-xs font-bold"></i>}
                                </div>
                                <span className={`text-sm font-medium transition-all ${isDone ? 'text-slate-500 line-through' : (isDark ? 'text-slate-200' : 'text-slate-800')}`}>{item.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DailyDeeds;
