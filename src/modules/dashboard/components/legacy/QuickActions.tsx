import React from 'react';
import { NavView } from '../../types';

interface QuickActionsProps {
    onNavigate: (view: NavView) => void;
    isDark: boolean;
}

interface QuickActionItemProps {
    label: string;
    icon: string;
    gradient: string;
    onClick: () => void;
    delay: string;
    isDark: boolean;
}

const QuickAction: React.FC<QuickActionItemProps> = ({ label, icon, gradient, onClick, delay, isDark }) => (
    <button
        onClick={onClick}
        className={`group relative flex flex-col items-center gap-2 p-1 animate-slide-up delay-[${delay}]`}
    >
        {/* 3D Icon Container */}
        <div className="relative w-16 h-16 transition-transform duration-300 group-hover:-translate-y-2 group-active:scale-95">
            {/* Glow / Shadow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} blur-xl opacity-30 group-hover:opacity-60 transition-opacity rounded-2xl`}></div>

            {/* The Button Body */}
            <div className={`relative w-full h-full rounded-2xl bg-gradient-to-br ${gradient} p-[1px] shadow-2xl`}>
                <div className="w-full h-full rounded-2xl bg-gradient-to-b from-white/10 to-black/10 backdrop-blur-sm border-t border-white/40 flex items-center justify-center relative overflow-hidden">
                    {/* Glossy sheen */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50 pointer-events-none"></div>

                    <i className={`fa-solid ${icon} text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]`}></i>
                </div>
            </div>
        </div>
        <span className={`text-[11px] font-bold ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-600 group-hover:text-black'} transition-colors`}>{label}</span>
    </button>
);

const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate, isDark }) => {
    return (
        <div>
            <h3 className={`font-bold text-sm mb-4 px-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Explore Apps</h3>
            <div className="grid grid-cols-3 gap-3">
                <QuickAction
                    label="Quran"
                    icon="fa-book-quran"
                    gradient="from-primary-light to-primary"
                    onClick={() => onNavigate(NavView.QURAN)}
                    delay="0ms"
                    isDark={isDark}
                />
                <QuickAction
                    label="Ustaz AI"
                    icon="fa-user-astronaut"
                    gradient="from-secondary-light to-secondary"
                    onClick={() => onNavigate(NavView.SMART_DEEN)}
                    delay="50ms"
                    isDark={isDark}
                />
                <QuickAction
                    label="Iqra Voice"
                    icon="fa-microphone-lines"
                    gradient="from-primary-light to-primary"
                    onClick={() => onNavigate(NavView.IQRA)}
                    delay="100ms"
                    isDark={isDark}
                />
                <QuickAction
                    label="Ibadah"
                    icon="fa-kaaba"
                    gradient="from-primary-light to-primary"
                    onClick={() => onNavigate(NavView.IBADAH)}
                    delay="150ms"
                    isDark={isDark}
                />
                <QuickAction
                    label="Souq"
                    icon="fa-shop"
                    gradient="from-primary-light to-primary"
                    onClick={() => onNavigate(NavView.SOUQ)}
                    delay="200ms"
                    isDark={isDark}
                />
                <QuickAction
                    label="Media Hub"
                    icon="fa-clapperboard"
                    gradient="from-primary-light to-primary"
                    onClick={() => onNavigate(NavView.MEDIA_STUDIO)}
                    delay="250ms"
                    isDark={isDark}
                />
            </div>
        </div>
    );
};

export default QuickActions;
