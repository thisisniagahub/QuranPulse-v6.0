// Iqra Module - Refactored Entry Point
// Original: 712 lines → New: ~100 lines (orchestrator only)

import React, { useState } from 'react';
import { UserProfile } from '../../types';

// Sub-components
import IqraPdfReader from './IqraPdfReader';
import IqraVoiceCoach from './IqraVoiceCoach';
import IqraAnalytics from './IqraAnalytics';
import IqraTutorials from './IqraTutorials';
import IqraVisionCoach from './IqraVisionCoach';
import VocabBuilder from './VocabBuilder';

type IqraMode = 'READ' | 'COACH' | 'VISION_COACH' | 'TUTORIALS' | 'VOCAB' | 'ANALYTICS';

interface IqraProps {
    user?: UserProfile;
    onUpdateUser?: (user: UserProfile) => void;
}

const Iqra: React.FC<IqraProps> = ({ user, onUpdateUser }) => {
    const [mode, setMode] = useState<IqraMode>('READ');

    const modes = [
        { id: 'READ' as IqraMode, icon: 'fa-book-open', label: 'Read' },
        { id: 'VOCAB' as IqraMode, icon: 'fa-shapes', label: 'Vocab' },
        { id: 'TUTORIALS' as IqraMode, icon: 'fa-graduation-cap', label: 'Lessons' },
        { id: 'COACH' as IqraMode, icon: 'fa-microphone', label: 'Voice Coach' },
        { id: 'VISION_COACH' as IqraMode, icon: 'fa-glasses', label: 'AR Mode' },
        { id: 'ANALYTICS' as IqraMode, icon: 'fa-chart-pie', label: 'Stats' },
    ];

    const renderContent = () => {
        switch (mode) {
            case 'READ':
                return <IqraPdfReader />;
            case 'VOCAB':
                return <VocabBuilder isDark={true} />;
            case 'TUTORIALS':
                return <IqraTutorials onBack={() => setMode('READ')} />;
            case 'ANALYTICS':
                return <IqraAnalytics onBack={() => setMode('READ')} />;
            case 'VISION_COACH':
                return <IqraVisionCoach onClose={() => setMode('READ')} />;
            case 'COACH':
                return <IqraVoiceCoach />;
            default:
                return <IqraPdfReader />;
        }
    };

    return (
        <div className="h-full flex flex-col p-4 pb-24">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <i className="fa-solid fa-book-quran text-primary"></i> Digital Iqra
                    </h1>
                    <p className="text-slate-400 text-xs">Master the Quran, one page at a time.</p>
                </div>
                
                {/* Mode Selector */}
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-[200px] md:max-w-none no-scrollbar">
                    {modes.map(({ id, icon, label }) => (
                        <button 
                            key={id}
                            onClick={() => setMode(id)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                                mode === id 
                                    ? 'bg-primary text-black shadow-lg shadow-primary/20' 
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <i className={`fa-solid ${icon}`}></i> {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {renderContent()}
            </div>
        </div>
    );
};

export default Iqra;
