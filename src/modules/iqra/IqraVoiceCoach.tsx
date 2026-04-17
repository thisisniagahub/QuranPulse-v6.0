import React from 'react';
import { ArrowLeft, Sparkles, Wand2 } from 'lucide-react';
import ASRRecorder from './components/ASRRecorder';

interface IqraVoiceCoachProps {
    onBack?: () => void;
}

const IqraVoiceCoach: React.FC<IqraVoiceCoachProps> = ({ onBack }) => {
    return (
        <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-raudhah-ivory px-6 py-8 text-raudhah-ink animate-fade-in">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(27,107,90,0.12),_transparent_55%),linear-gradient(to_bottom,_rgba(255,255,255,0.72),_rgba(250,250,245,1))]" />
            <div className="absolute inset-x-8 top-10 -z-10 h-40 rounded-full bg-raudhah-gold/10 blur-3xl" />

            {onBack && (
                <button
                    onClick={onBack}
                    title="Kembali"
                    aria-label="Kembali"
                    className="absolute left-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-raudhah-teal/10 bg-white/70 text-raudhah-ink shadow-sm transition-colors hover:bg-white hover:text-raudhah-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raudhah-teal/20 focus-visible:ring-offset-2 focus-visible:ring-offset-raudhah-ivory"
                >
                    <ArrowLeft size={20} />
                </button>
            )}

            <div className="relative z-10 w-full max-w-4xl space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-raudhah-teal/10 bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-raudhah-teal shadow-sm backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5" />
                    Ustaz AI
                </div>

                <div className="max-w-2xl space-y-3">
                    <h1 className="font-raudhah text-4xl font-bold tracking-tight text-raudhah-ink md:text-5xl">
                        Bimbingan bacaan yang tenang, jelas, dan berpusat pada Ustaz AI.
                    </h1>
                    <p className="max-w-xl text-sm leading-7 text-raudhah-ink/70 md:text-base">
                        Antara muka ini kekal ringan untuk latihan sebutan, tetapi gaya visualnya sekarang selari dengan bahasa Raudhah dan identiti produk utama.
                    </p>
                </div>

                <div className="rounded-[2rem] border border-raudhah-teal/10 bg-white/85 p-4 shadow-[0_20px_60px_-25px_rgba(27,107,90,0.25)] backdrop-blur-md md:p-6">
                    <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-raudhah-teal/70">
                        <Wand2 className="h-4 w-4" />
                        Dikuasakan oleh OpenClaw
                    </div>
                    <ASRRecorder expectedText="Bismillah" onResult={() => { }} />
                </div>
            </div>
        </div>
    );
};

export default IqraVoiceCoach;
