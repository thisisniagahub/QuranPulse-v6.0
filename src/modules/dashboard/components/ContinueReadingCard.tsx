import React from 'react';
import { NavView } from '../../../types';
import BentoCard from './BentoCard';
import { useReadHistory } from '../../../hooks/useReadHistory';

interface ContinueReadingCardProps {
    onNavigate: (view: NavView) => void;
    theme: any;
}

const ContinueReadingCard: React.FC<ContinueReadingCardProps> = ({ onNavigate }) => {
    const { lastRead } = useReadHistory();

    const handleClick = () => {
        onNavigate(NavView.QURAN);
    };

    return (
        <BentoCard
            className="col-span-1 min-h-[160px] p-5 border-white/5 bg-[#0A1E42]/80"
            onClick={handleClick}
            delay={0.1}
        >
            <div className="flex flex-col justify-between h-full relative z-10">
                <div>
                    <div className="flex items-center gap-1.5 mb-2 opacity-60">
                        <i className="fa-solid fa-book-open text-[10px] text-cyan-400"></i>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Teruskan</p>
                    </div>

                    <h3 className="text-xl font-black text-white leading-tight mb-0.5">
                        {lastRead ? lastRead.surahName : 'Mula Baca'}
                    </h3>
                    <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                        {lastRead ? `Ayat ${lastRead.ayahId}` : 'Tiada Rekod'}
                    </p>
                </div>

                {lastRead && (
                    <div className="mt-3">
                        <div className="flex justify-between text-[8px] text-white/40 mb-1 font-black uppercase tracking-widest">
                            <span>{lastRead.totalVerses ? Math.round((lastRead.ayahId / lastRead.totalVerses) * 100) : '0'}% Selesai</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${lastRead.totalVerses ? (lastRead.ayahId / lastRead.totalVerses) * 100 : 0}%` }}
                                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Glowing Mesh Background */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none"></div>
        </BentoCard>
    );
};

export default ContinueReadingCard;
