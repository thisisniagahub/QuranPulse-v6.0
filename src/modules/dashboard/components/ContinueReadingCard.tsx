import React from 'react';
import { NavView } from '../../../types';
import BentoCard from './BentoCard';
import { useReadHistory } from '../../../hooks/useReadHistory';
import { motion } from 'framer-motion';

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
            className="col-span-1 min-h-[160px] border-white/10 relative group"
            onClick={handleClick}
            delay={0.1}
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img loading="lazy"
                    src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1000&auto=format&fit=crop"
                    alt="Quran BG"
                    className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c224b] via-[#0c224b]/70 to-transparent"></div>
            </div>

            <div className="flex flex-col justify-between h-full relative z-10 p-5">
                <div>
                    <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center backdrop-blur-sm">
                            <i className="fa-solid fa-book-open text-[10px] text-emerald-400"></i>
                        </div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-300">Teruskan</p>
                    </div>

                    <h3 className="text-lg font-black text-white leading-tight mb-1 drop-shadow-lg truncate">
                        {lastRead ? lastRead.surahName : 'Mula Baca'}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">
                        {lastRead ? `Ayat ${lastRead.ayahId}` : 'Tiada Rekod'}
                    </p>
                </div>

                {lastRead && (
                    <div className="mt-3">
                        <div className="flex justify-between text-[10px] text-slate-300 mb-1 font-medium tracking-wide">
                            <span>{lastRead.totalVerses ? Math.round((lastRead.ayahId / lastRead.totalVerses) * 100) : '0'}% Selesai</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${lastRead.totalVerses ? (lastRead.ayahId / lastRead.totalVerses) * 100 : 0}%` }}
                                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                            />
                        </div>
                    </div>
                )}
            </div>
        </BentoCard>
    );
};

export default ContinueReadingCard;

