import React, { useState } from 'react';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface IqraVoiceCoachProps {
    onBack?: () => void;
}

interface AnalysisResult {
    score: number;
    feedback: string;
    tajweed_errors?: Array<{
        rule: string;
        description: string;
    }>;
}

// Simulated Tajwid Analysis Rules (Mock AI)
const analyzeTajwid = (transcript: string, confidence: number): AnalysisResult => {
    let score = Math.min(Math.round(confidence * 100) + 10, 100); 
    const feedback = [];
    const errors = [];

    // Heuristics for Arabic Recitation Simulation
    if (transcript.length < 5) {
        score -= 20;
        feedback.push("Terlalu pendek. Sila baca ayat penuh.");
    } else {
        feedback.push("Kelancaran baik.");
    }

    if (score > 85) {
        feedback.push("Makhraj huruf jelas.");
    } else {
        feedback.push("Cuba perjelaskan sebutan huruf 'Ra' dan 'Qaf'.");
        errors.push({ rule: "Makhraj", description: "Sebutan kurang jelas pada huruf tebal." });
    }

    return {
        score: Math.max(score, 0),
        feedback: feedback.join(" "),
        tajweed_errors: errors
    };
};

const IqraVoiceCoach: React.FC<IqraVoiceCoachProps> = ({ onBack }) => {
    const { isRecording, startRecording, stopRecording, visualizerData } = useAudioRecorder();
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [detectedText, setDetectedText] = useState<string>("");

    const { startListening: startSpeechRecognition } = useSpeechRecognition({
        lang: 'ar-SA',
        onResult: ({ transcript, confidence }) => {
            setDetectedText(transcript);
            
            // Artificial delay to simulate "AI Thinking"
            setTimeout(() => {
                const result = analyzeTajwid(transcript, confidence);
                setAnalysisResult(result);
                setIsAnalyzing(false);
            }, 1500);
            
            stopRecording();
        }
    });

    const getVolume = () => {
        if (!visualizerData) return 0;
        const sum = visualizerData.reduce((a, b) => a + b, 0);
        return sum / visualizerData.length;
    };

    const handleToggleRecording = () => {
        if (isRecording) {
            handleStopRecording();
        } else {
            setAnalysisResult(null);
            setDetectedText("");
            startRecording();
            startSpeechRecognition();
        }
    };

    const handleStopRecording = async () => {
        stopRecording();
        setIsAnalyzing(true);
    };

    return (
        <div className="h-full flex flex-col items-center justify-center animate-fade-in p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#020617] to-black -z-10"></div>

            <div className="text-center mb-12 relative z-10">
                <div 
                    className={`w-40 h-40 rounded-full flex items-center justify-center mx-auto mb-8 relative transition-all duration-300 ease-out border-4 ${isRecording ? 'border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.4)]' : 'border-slate-800 shadow-none'}`}
                    style={{
                        backgroundColor: isRecording ? '#0f172a' : '#1e293b',
                        transform: isRecording ? `scale(${1 + (getVolume() / 300)})` : 'scale(1)'
                    }}
                >
                    <i className={`fa-solid fa-microphone text-5xl transition-colors duration-300 ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}></i>
                    
                    {/* Ripple Effect */}
                    {isRecording && (
                         <>
                            <div className="absolute inset-0 rounded-full border border-red-500/30 animate-[ping_1.5s_linear_infinite]"></div>
                            <div className="absolute inset-0 rounded-full border border-red-500/20 animate-[ping_2s_linear_infinite_0.5s]"></div>
                         </>
                    )}
                </div>

                <h2 className="text-3xl font-bold text-white mb-2 font-kufi">
                    {isRecording ? "Sedang Mendengar..." : isAnalyzing ? "Menganalisis Bacaan..." : "AI Voice Coach"}
                </h2>
                <p className="text-slate-400 max-w-md mx-auto text-sm">
                    {isRecording ? "Baca ayat dengan jelas dan tartil..." : isAnalyzing ? "Menyemak hukum tajwid & makhraj..." : "Tekan mikrofon untuk mulakan sesi semakan bacaan."}
                </p>
            </div>

            {!isAnalyzing && !analysisResult && (
                <button 
                    onClick={handleToggleRecording}
                    className={`w-20 h-20 rounded-full text-3xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center z-20 ${
                        isRecording 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white'
                    }`}
                >
                    <i className={`fa-solid ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
                </button>
            )}

            {isAnalyzing && (
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-cyan-400 animate-pulse text-sm">Menjana laporan...</p>
                </div>
            )}

            {analysisResult && (
                <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md rounded-3xl border border-white/10 p-6 animate-slide-up shadow-2xl z-20">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white font-bold text-lg">Keputusan Analisis</h3>
                        <div className="flex flex-col items-end">
                            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                                {analysisResult.score}%
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase">Skor Kelancaran</span>
                        </div>
                    </div>
                    
                    {detectedText && (
                        <div className="mb-6 p-4 bg-black/40 rounded-xl border border-white/5 relative group">
                            <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider">Teks Dikesan</p>
                            <p className="text-2xl text-cyan-100 font-arabic text-right dir-rtl leading-relaxed">
                                {detectedText}
                            </p>
                        </div>
                    )}

                    <div className="space-y-3 mb-6">
                        <div className="flex gap-3">
                            <div className="w-1 bg-cyan-500 rounded-full"></div>
                            <p className="text-slate-300 text-sm leading-relaxed">{analysisResult.feedback}</p>
                        </div>
                        {analysisResult.tajweed_errors?.map((err, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="w-1 bg-amber-500 rounded-full"></div>
                                <div>
                                    <p className="text-amber-400 text-xs font-bold">{err.rule}</p>
                                    <p className="text-slate-400 text-xs">{err.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button 
                        onClick={() => setAnalysisResult(null)}
                        className="w-full py-3.5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all border border-slate-700 hover:border-slate-600 shadow-lg"
                    >
                        Cuba Lagi
                    </button>
                </div>
            )}
        </div>
    );
};

export default IqraVoiceCoach;