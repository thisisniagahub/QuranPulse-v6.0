import React, { useState } from 'react';
import { analyzeQuranRecitation } from '../../services/aiService';

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

const IqraVoiceCoach: React.FC<IqraVoiceCoachProps> = ({ onBack }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleStartRecording = () => {
        setIsRecording(true);
        setAnalysisResult(null);
        // Simulate recording duration
        setTimeout(() => {
            handleStopRecording();
        }, 3000);
    };

    const handleStopRecording = async () => {
        setIsRecording(false);
        setIsAnalyzing(true);
        try {
            // Mock audio data
            const result = await analyzeQuranRecitation("base64audio", "audio/wav", "Bismillah");
            
            // Save result to LocalStorage for Analytics
            const saved = localStorage.getItem('iqra_progress');
            const currentStats = saved ? JSON.parse(saved) : { totalRead: 0, avgScore: 0, streak: 0 };
            const newTotal = currentStats.totalRead + 1;
            const newAvg = Math.round(((currentStats.avgScore * currentStats.totalRead) + result.score) / newTotal);
            
            localStorage.setItem('iqra_progress', JSON.stringify({
                ...currentStats,
                totalRead: newTotal,
                avgScore: newAvg
            }));

            setAnalysisResult(result);
            setIsAnalyzing(false);
        } catch (error) {
            console.error("Analysis failed:", error);
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center animate-fade-in p-6">
            <div className="text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6 relative">
                    <i className={`fa-solid fa-microphone text-4xl ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}></i>
                    {isRecording && (
                        <div className="absolute inset-0 rounded-full border-4 border-red-500/30 animate-ping"></div>
                    )}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    {isRecording ? "Listening..." : isAnalyzing ? "Analyzing Recitation..." : "Voice Coach"}
                </h2>
                <p className="text-slate-400 max-w-md mx-auto">
                    {isRecording ? "Recite the verse clearly." : isAnalyzing ? "AI is checking your Tajweed..." : "Tap the microphone and recite the first line of the page."}
                </p>
            </div>

            {!isRecording && !isAnalyzing && !analysisResult && (
                <button 
                    onClick={handleStartRecording}
                    className="w-20 h-20 rounded-full bg-primary hover:bg-primary-dark text-black text-3xl shadow-lg shadow-primary/30 transition-transform hover:scale-110 flex items-center justify-center"
                    aria-label="Start Recording"
                    title="Start Recording"
                >
                    <i className="fa-solid fa-microphone"></i>
                </button>
            )}

            {analysisResult && (
                <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-6 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold">Analysis Result</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${analysisResult.score > 80 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            Score: {analysisResult.score}%
                        </span>
                    </div>
                    <p className="text-slate-300 text-sm mb-4">{analysisResult.feedback}</p>
                    
                    {analysisResult.tajweed_errors && analysisResult.tajweed_errors.length > 0 && (
                        <div className="space-y-2 mb-4">
                            <p className="text-xs text-slate-500 uppercase font-bold">Improvements Needed:</p>
                            {analysisResult.tajweed_errors.map((err, idx) => (
                                <div key={idx} className="flex items-start gap-2 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                                    <i className="fa-solid fa-circle-exclamation text-red-400 mt-0.5 text-xs"></i>
                                    <div>
                                        <p className="text-red-300 text-xs font-bold">{err.rule}</p>
                                        <p className="text-slate-400 text-[10px]">{err.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <button 
                        onClick={() => setAnalysisResult(null)}
                        className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default IqraVoiceCoach;
