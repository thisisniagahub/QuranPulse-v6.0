import React from 'react';
import { motion } from 'framer-motion';
import { Achievement } from '../../../contexts/GamificationContext';

interface AchievementBadgesProps {
    badges: Achievement[];
}

const AchievementBadges: React.FC<AchievementBadgesProps> = ({ badges }) => {
    return (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
            {badges.map((badge, index) => {
                const isUnlocked = !!badge.unlockedAt;
                return (
                    <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative aspect-square group cursor-pointer ${isUnlocked ? '' : 'opacity-40 grayscale'}`}
                    >
                        {/* Hexagon Shape */}
                        <div className={`
                            absolute inset-0 clip-path-hexagon flex flex-col items-center justify-center p-2 transition-all duration-300
                            ${isUnlocked
                                ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-[1px] border-raudhah-teal/20 group-hover:border-raudhah-teal group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                : 'bg-slate-900 border border-slate-800'
                            }
                        `}>
                            {/* Inner Glow for Unlocked */}
                            {isUnlocked && (
                                <div className="absolute inset-0 bg-raudhah-teal/10 animate-pulse pointer-events-none"></div>
                            )}

                            <span className="text-2xl mb-1 drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                {badge.icon}
                            </span>

                        </div>

                        {/* Tooltip Name (Appears on Hover) */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-max max-w-[100px] bg-black/90 text-white text-[10px] px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none text-center">
                            {badge.title}
                        </div>
                    </motion.div>
                );
            })}

            {/* Fillers for empty slots to make it look grid-like if few badges */}
            {[...Array(Math.max(0, 5 - badges.length))].map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square opacity-10">
                    <div className="w-full h-full clip-path-hexagon bg-slate-800 border border-white/5 mx-auto"></div>
                </div>
            ))}
        </div>
    );
};

export default AchievementBadges;
