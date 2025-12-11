import React from 'react';
import { motion } from 'framer-motion';

const tiles = [
    { id: 'quran', label: 'Al-Quran', icon: 'fa-book-quran', color: 'cyan', path: '/quran' },
    { id: 'ustaz', label: 'Ustaz AI', icon: 'fa-user-astronaut', color: 'amber', path: '/smart-deen' },
    { id: 'qiblat', label: 'Qiblat', icon: 'fa-compass', color: 'emerald', path: '/ibadah' },
    { id: 'iqra', label: 'Iqra', icon: 'fa-tablet-screen-button', color: 'purple', path: '/iqra' },
];

interface HoloTilesProps {
    onNavigate: (path: string) => void;
}

const HoloTiles: React.FC<HoloTilesProps> = ({ onNavigate }) => {
    return (
        <div className="grid grid-cols-2 gap-4 px-6">
            {tiles.map((tile, idx) => (
                <motion.div
                    key={tile.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (idx * 0.1) }}
                    className="relative h-24 group perspective-1000 cursor-pointer"
                    onClick={() => onNavigate(tile.path)}
                    whileHover={{ scale: 1.02, rotateX: 5 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {/* Glass Panel */}
                    <div className={`absolute inset-0 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden group-hover:border-${tile.color}-500/50 transition-colors duration-300`}>
                        {/* Gradient Glow */}
                        <div className={`absolute -inset-full bg-gradient-to-r from-transparent via-${tile.color}-500/10 to-transparent group-hover:animate-shimmer`}></div>
                        
                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                             <i className={`fa-solid ${tile.icon} text-2xl text-${tile.color}-400 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]`}></i>
                             <span className="text-sm font-bold text-white tracking-wide">{tile.label}</span>
                        </div>
                        
                        {/* Holographic Corners */}
                        <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l border-${tile.color}-500/50 rounded-tl-lg opacity-50`}></div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r border-${tile.color}-500/50 rounded-br-lg opacity-50`}></div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default HoloTiles;
