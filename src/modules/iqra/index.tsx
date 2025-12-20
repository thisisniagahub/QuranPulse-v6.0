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

type IqraMode = 'DIGITAL' | 'READ' | 'COACH' | 'VISION_COACH' | 'TUTORIALS' | 'VOCAB' | 'ANALYTICS';

interface IqraProps {
    user?: UserProfile;
    onUpdateUser?: (user: UserProfile) => void;
}

const Iqra: React.FC<IqraProps> = ({ user, onUpdateUser }) => {
    const [mode, setMode] = useState<IqraMode>('DIGITAL');
    const navigate = useNavigate();

    const modes = [
        { id: 'DIGITAL' as IqraMode, icon: 'fa-book-quran', label: 'Iqra\' Asal' },
        { id: 'READ' as IqraMode, icon: 'fa-book-open', label: 'PDF Mode' },
        { id: 'GUIDES' as any, icon: 'fa-map', label: 'Guides', action: () => navigate('/iqra/guides') },
        { id: 'VOCAB' as IqraMode, icon: 'fa-shapes', label: 'Vocab' },
        { id: 'TUTORIALS' as IqraMode, icon: 'fa-graduation-cap', label: 'Lessons' },
        { id: 'COACH' as IqraMode, icon: 'fa-microphone', label: 'Voice Coach' },
        { id: 'VISION_COACH' as IqraMode, icon: 'fa-glasses', label: 'AR Mode' },
        { id: 'ANALYTICS' as IqraMode, icon: 'fa-chart-pie', label: 'Stats' },
    ];

    const renderContent = () => {
        switch (mode) {
            case 'DIGITAL':
                return <IqraDigitalReader onClose={() => setMode('READ')} />;
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
                    {modes.map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => item.action ? item.action() : setMode(item.id as IqraMode)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                                mode === item.id 
                                    ? 'bg-primary text-black shadow-lg shadow-primary/20' 
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <i className={`fa-solid ${item.icon}`}></i> {item.label}
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
