import React, { useState, useEffect } from 'react';

interface IqraAnalyticsProps {
    onBack: () => void;
}

interface ProgressStats {
    totalRead: number;
    avgScore: number;
    streak: number;
    history: number[];
}

const IqraAnalytics: React.FC<IqraAnalyticsProps> = ({ onBack }) => {
    const [stats, setStats] = useState<ProgressStats>({
        totalRead: 0,
        avgScore: 0,
        streak: 0,
        history: [65, 70, 75, 72, 80, 85, 82] // Mock weekly history
    });

    useEffect(() => {
        const saved = localStorage.getItem('iqra_progress');
        if (saved) {
            const parsed = JSON.parse(saved);
            setStats(prev => ({ ...prev, ...parsed }));
        }
    }, []);

    return (
        <div className="h-full overflow-y-auto p-6 space-y-8 animate-in fade-in zoom-in duration-500 pb-24">
            <div className="flex items-center gap-3 mb-2">
                <button 
                    onClick={onBack} 
                    className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white" 
                    aria-label="Back" 
                    title="Back"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h2 className="text-2xl font-bold text-white">Your Progress</h2>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-primary/50 transition-colors">
                    <div className="text-slate-400 text-sm mb-2 uppercase font-bold tracking-wider">Total Pages Read</div>
                    <div className="text-4xl font-bold text-primary">{stats.totalRead}</div>
                    <div className="text-xs text-slate-500 mt-2">Keep going!</div>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-colors">
                    <div className="text-slate-400 text-sm mb-2 uppercase font-bold tracking-wider">Avg. Tajweed Score</div>
                    <div className="text-4xl font-bold text-emerald-400">{stats.avgScore}%</div>
                    <div className="text-xs text-slate-500 mt-2">Based on AI analysis</div>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-colors">
                    <div className="text-slate-400 text-sm mb-2 uppercase font-bold tracking-wider">Current Streak</div>
                    <div className="text-4xl font-bold text-amber-400">{stats.streak} Days</div>
                    <div className="text-xs text-slate-500 mt-2">Consistency is key</div>
                </div>
            </div>

            {/* Weekly Chart */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <i className="fa-solid fa-chart-simple text-primary"></i> Weekly Activity
                </h3>
                <div className="flex items-end justify-between h-48 gap-2">
                    {stats.history.map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <div 
                                className="w-full bg-slate-700 rounded-t-lg relative overflow-hidden transition-all hover:bg-primary/20" 
                                style={{ height: `${val}%` }}
                            >
                                <div className="absolute bottom-0 left-0 right-0 bg-primary/50 h-full transition-all group-hover:bg-primary"></div>
                            </div>
                            <span className="text-xs text-slate-500">Day {i + 1}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IqraAnalytics;
