import React from 'react';

interface PrayerCardProps {
    nextPrayer: { name: string; time: string } | null;
    timeRemaining: string;
}

const PrayerCard: React.FC<PrayerCardProps> = ({ nextPrayer, timeRemaining }) => {
    return (
        <div className="relative rounded-[2rem] h-52 shadow-[0_20px_50px_-12px_rgba(79,70,229,0.3)] group transform transition-all hover:scale-[1.01]">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-space-dark via-teal-950 to-space-dark rounded-[2rem] overflow-hidden border border-white/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <p className="text-[10px] font-bold text-secondary-light uppercase tracking-widest">Next Prayer</p>
                        </div>
                        <h1 className="text-4xl font-bold text-white font-serif drop-shadow-lg">{nextPrayer?.name || "Loading..."}</h1>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-bold text-white drop-shadow-lg font-mono">{nextPrayer?.time}</p>
                        <p className="text-[10px] text-secondary-light uppercase tracking-widest font-bold">
                            {timeRemaining ? `In ${timeRemaining}` : 'Calculating...'}
                        </p>
                    </div>
                </div>

                {/* Glassy Prayer Strip */}
                <div className="flex justify-between items-center bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-lg">
                    {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => {
                        const isActive = nextPrayer?.name === p;
                        return (
                            <div key={p} className={`flex flex-col items-center transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-50'}`}>
                                <span className={`text-[9px] font-bold uppercase mb-1 ${isActive ? 'text-primary-light' : 'text-slate-300'}`}>{p.charAt(0)}</span>
                                {isActive ? (
                                    <i className="fa-solid fa-circle-check text-primary text-xs drop-shadow-[0_0_5px_rgba(0,191,165,0.8)]"></i>
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PrayerCard;
