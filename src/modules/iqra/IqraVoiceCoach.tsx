import React from 'react';
import { ArrowLeft } from 'lucide-react';
import ASRRecorder from './components/ASRRecorder';

interface IqraVoiceCoachProps {
    onBack?: () => void;
}

const IqraVoiceCoach: React.FC<IqraVoiceCoachProps> = ({ onBack }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center animate-fade-in p-6 relative overflow-hidden bg-background-dark">
            {/* Background Ambience from Original */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#020617] to-black -z-10"></div>

            {/* Simple Back Button if needed, or rely on Parent Navigation */}
            {onBack && (
                <button
                    onClick={onBack}
                    title="Go Back"
                    aria-label="Go Back"
                    className="absolute top-6 left-6 z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all border border-white/10"
                >
                    <ArrowLeft size={20} />
                </button>
            )}

            <div className="w-full max-w-4xl z-10">
                <ASRRecorder expectedText="Bismillah" onResult={(result) => console.log('ASR Result:', result)} />
            </div>
        </div>
    );
};

export default IqraVoiceCoach;