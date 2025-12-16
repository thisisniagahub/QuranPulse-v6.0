import React from 'react';
import { NavView } from '../../../types';
import BentoCard from './BentoCard';
import { useReadHistory } from '../../../hooks/useReadHistory';

interface ContinueReadingCardProps {
    onNavigate: (view: NavView) => void;
    theme: any;
}

const ContinueReadingCard: React.FC<ContinueReadingCardProps> = ({ onNavigate, theme }) => {
    const { lastRead } = useReadHistory();

    const handleClick = () => {
        onNavigate(NavView.QURAN);
    };

    return (
        <BentoCard 
            className="col-span-2 min-h-[180px] p-6 border-white"
            onClick={handleClick}
            delay={0.1}
            bgImage="/images/continue-reading-bg.png"
        >
            <div className="flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-neon-sm"></span>
                            <p className="text-xs font-bold uppercase tracking-wider text-primary">Sambung Bacaan</p>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1 drop-shadow-md">
                            {lastRead ? `Surah ${lastRead.surahName}` : 'Mula Membaca'}
                        </h3>
                        <p className="text-white/80 text-sm font-medium drop-shadow-sm">
                            {lastRead ? `Ayat ${lastRead.ayahId}` : 'Tiada rekod bacaan'}
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white group-hover:bg-white group-hover:text-background-dark transition-all duration-300">
                        <i className={`fa-solid ${lastRead ? 'fa-play' : 'fa-book-open'} ml-1 text-inherit`}></i>
                    </div>
                </div>

                {lastRead && (
                    <div className="mt-4">
                        <div className="flex justify-between text-[10px] text-white/70 mb-1 font-bold uppercase tracking-widest drop-shadow-sm">
                            <span>Progress</span>
                            <span>{lastRead.totalVerses ? Math.round((lastRead.ayahId / lastRead.totalVerses) * 100) : '--'}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-surface-dark rounded-full overflow-hidden border border-white/20">
                            <div 
                                className="h-full rounded-full bg-primary progress-neon" 
                                style={{ 
                                    width: `${lastRead.totalVerses ? (lastRead.ayahId / lastRead.totalVerses) * 100 : 0}%`
                                }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </BentoCard>
    );
};

export default ContinueReadingCard;
