// Iqra Module - Refactored Entry Point
// Original: 712 lines → New: ~100 lines (orchestrator only)

import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { useNavigate } from 'react-router-dom';

// Sub-components
import IqraPdfReader from './IqraPdfReader';
import IqraVoiceCoach from './IqraVoiceCoach';
import IqraAnalytics from './IqraAnalytics';
import IqraTutorials from './IqraTutorials';
import IqraVisionCoach from './IqraVisionCoach';
import VocabBuilder from './VocabBuilder';
import IqraDigitalReader from './IqraDigitalReader';
import IqraInteractiveCoach from './IqraInteractiveCoach';
import IqraGameEngine from './game/IqraGameEngine';

type IqraMode = 'DIGITAL' | 'READ' | 'COACH' | 'VISION_COACH' | 'TUTORIALS' | 'VOCAB' | 'ANALYTICS' | 'GAMES' | 'INTERACTIVE';

interface IqraProps {
    user?: UserProfile;
    onUpdateUser?: (user: UserProfile) => void;
}

const Iqra: React.FC<IqraProps> = ({ user, onUpdateUser }) => {
    const [mode, setMode] = useState<IqraMode>('DIGITAL');
    const navigate = useNavigate();

    const modes = [
        { id: 'DIGITAL' as IqraMode, icon: 'fa-book-quran', label: 'Iqra\' Asal' },
        { id: 'INTERACTIVE' as IqraMode, icon: 'fa-wand-magic-sparkles', label: 'Interactive Coach' },
        { id: 'GAMES' as IqraMode, icon: 'fa-gamepad', label: 'Play' },
        { id: 'READ' as IqraMode, icon: 'fa-book-open', label: 'PDF Mode' },
        { id: 'GUIDES' as any, icon: 'fa-map', label: 'Guides', action: () => navigate('/iqra/guides') },
        { id: 'VOCAB' as IqraMode, icon: 'fa-shapes', label: 'Vocab' },
        { id: 'TUTORIALS' as IqraMode, icon: 'fa-graduation-cap', label: 'Lessons' },
        { id: 'COACH' as IqraMode, icon: 'fa-microphone', label: 'Voice Coach' },
        { id: 'ANALYTICS' as IqraMode, icon: 'fa-chart-pie', label: 'Stats' },
    ];

    const renderContent = () => {
        switch (mode) {
            case 'DIGITAL':
                return <IqraDigitalReader onClose={() => setMode('READ')} />;
            case 'INTERACTIVE':
                return <IqraInteractiveCoach onClose={() => setMode('DIGITAL')} />;
            case 'GAMES':
                return <IqraGameEngine />;
            case 'READ':
                return <IqraPdfReader />;
            case 'VOCAB':
                return <VocabBuilder isDark={true} />;
            case 'TUTORIALS':
                return <IqraTutorials onBack={() => setMode('DIGITAL')} />;
            case 'ANALYTICS':
                return <IqraAnalytics onBack={() => setMode('DIGITAL')} />;
            case 'VISION_COACH':
                return <IqraVisionCoach onClose={() => setMode('DIGITAL')} />;
            case 'COACH':
                return <IqraVoiceCoach />;
            default:
                return <IqraDigitalReader />;
        }
    };

    return (
        <div className="h-full flex flex-col p-4 pb-24 overflow-y-auto">
            {/* Cinematic Header Poster */}
            <div className="relative w-full h-48 rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl border border-white/10">
                <img
                    src="/src/assets/iqra/iqra-hero.png"
                    className="w-full h-full object-cover"
                    alt="Iqra Digital Hero"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent"></div>

                {/* Content Overlay */}
                <div className="absolute bottom-6 left-6 z-10">
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 drop-shadow-lg">
                        <i className="fa-solid fa-book-quran text-primary animate-pulse"></i>
                        Iqra' <span className="text-primary">Digital</span>
                    </h1>
                    <p className="text-slate-200 text-sm font-medium drop-shadow-md">Kuasai Al-Quran secara digital & interaktif.</p>
                </div>
            </div>

            {/* Mode Selector - Scrollable Horizontal */}
            <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2 px-1">
                {modes.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => item.action ? item.action() : setMode(item.id as IqraMode)}
                        className={`
                            px-6 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap border
                            ${mode === item.id
                                ? 'clay-card bg-primary text-white border-white/20'
                                : 'bg-surface/50 text-slate-500 dark:text-slate-400 border-transparent hover:bg-surface'
                            }
                        `}
                    >
                        <i className={`fa-solid ${item.icon}`}></i> {item.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 relative">
                {renderContent()}
            </div>
        </div>
    );
};

export default Iqra;
