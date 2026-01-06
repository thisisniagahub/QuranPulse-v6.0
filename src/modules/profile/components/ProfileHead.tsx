import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { UserProfile } from '../../../types';

interface ProfileHeadProps {
    user: UserProfile;
    level: number;
    userTitle: string;
    onEdit: () => void;
}

const ProfileHead: React.FC<ProfileHeadProps> = ({ user, level, userTitle, onEdit }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXVal = e.clientX - rect.left;
        const mouseYVal = e.clientY - rect.top;
        const xPct = mouseXVal / width - 0.5;
        const yPct = mouseYVal / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className="perspective-1000 w-full max-w-md mx-auto py-8">
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden group"
            >
                {/* Holographic Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* ID Header */}
                <div className="flex justify-between items-start mb-6 relative z-10 transform translate-z-10">
                    <div className="flex items-center gap-2 text-cyan-400">
                        <i className="fa-solid fa-fingerprint text-xl"></i>
                        <span className="text-[10px] font-mono tracking-[0.2em]">ISLAMIC.ID</span>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                        <img src="/logo-icon.png" alt="QP" className="w-5 h-5 opacity-50" onError={(e) => e.currentTarget.style.display = 'none'} />
                    </div>
                </div>

                {/* Main Identity Content */}
                <div className="flex items-center gap-6 relative z-10">
                    {/* Hexagon Avatar Container */}
                    <div className="relative w-24 h-24 shrink-0">
                        <div className="absolute inset-0 bg-cyan-500 clip-path-hexagon animate-pulse opacity-20"></div>
                        <div className="absolute inset-[2px] bg-slate-900 clip-path-hexagon flex items-center justify-center overflow-hidden border-2 border-cyan-500/30">
                            {user.avatar_url ? (
                                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl">🧕</span>
                            )}
                        </div>
                        {/* Level Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-1 clip-path-slope shadow-lg">
                            LVL {level}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold text-white tracking-tight mb-1 truncate flex items-center gap-2">
                            {user.name}
                            <button onClick={onEdit} className="text-xs text-slate-500 hover:text-cyan-400 transition-colors">
                                <i className="fa-solid fa-pen"></i>
                            </button>
                        </h2>
                        <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">{userTitle}</p>

                        {/* Micro Stats in Card */}
                        <div className="flex gap-4 mt-3">
                            <div>
                                <span className="text-[10px] text-slate-500 block uppercase">Role</span>
                                <span className="text-xs text-slate-300 font-mono">User</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-500 block uppercase">Joined</span>
                                <span className="text-xs text-slate-300 font-mono">2024</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-4 right-4 text-[10px] text-slate-600 font-mono rotate-90 origin-bottom-right">
                    #QP-{user.id?.toString().padStart(6, '0')}
                </div>
            </motion.div>

            {/* Global Styles for Clip Path (Injecting here for component portability) */}
            <style>{`
                .clip-path-hexagon {
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                }
                .clip-path-slope {
                    clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%);
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </div>
    );
};

export default ProfileHead;
