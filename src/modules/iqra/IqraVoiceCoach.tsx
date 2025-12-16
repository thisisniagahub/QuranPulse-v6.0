import React, { useState, useEffect } from 'react';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';

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
    const { isRecording, startRecording, stopRecording, visualizerData } = useAudioRecorder();
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [detectedText, setDetectedText] = useState<string>("");

    // Web Speech API Ref
    const recognitionRef = React.useRef<any>(null);

    useEffect(() => {
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false; // Stop after one sentence
            recognitionRef.current.lang = 'ar-SA'; // Listen for Arabic
            recognitionRef.current.interimResults = false;
            recognitionRef.current.maxAlternatives = 1;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                const confidence = event.results[0][0].confidence;
                setDetectedText(transcript);
                
                // Simple Fluency Scoring Logic (Web Speech API)
                const fluencyScore = Math.min(Math.round(confidence * 100) + 10, 100); 
                
                setAnalysisResult({
                    score: fluencyScore,
                    feedback: fluencyScore > 80 ? "Makhraj yang jelas! (Clear pronunciation)" : "Cuba perjelaskan sebutan huruf.",
                    tajweed_errors: [] 
                });
                setIsAnalyzing(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsAnalyzing(false);
                setAnalysisResult({
                    score: 0,
                    feedback: "Maaf, suara tidak dapat dikesan. Sila cuba lagi.",
                    tajweed_errors: []
                });
            };
            
            recognitionRef.current.onend = () => {
                if (isRecording) { 
                   // Logic handled by stop recording handler
                }
            };
        }
    }, []);

    // Calculate audio volume for visualizer
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
            startRecording(); // Visualizer
            recognitionRef.current?.start(); // Actual Listening
        }
    };

    const handleStopRecording = async () => {
        stopRecording(); // Stop Visualizer
        recognitionRef.current?.stop(); // Stop Listening
        setIsAnalyzing(true);
    };

    return (
        <div className="h-full flex flex-col items-center justify-center animate-fade-in p-6">
            <div className="text-center mb-8 relative">
                {/* Dynamic Visualizer Ring */}
                <div 
                    className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 relative transition-all duration-100 ease-out`}
                    style={{
                        backgroundColor: isRecording ? `rgba(239, 68, 68, ${0.1 + (getVolume() / 255)})` : 'rgba(30, 41, 59, 1)',
                        transform: isRecording ? `scale(${1 + (getVolume() / 500)})` : 'scale(1)'
                    }}
                >
                    <i className={`fa-solid fa-microphone text-4xl transition-colors ${isRecording ? 'text-red-500' : 'text-slate-400'}`}></i>
                    
                    {/* Ripple Effect */}
                    {isRecording && (
                         <div className="absolute inset-0 rounded-full border-4 border-red-500/30 animate-ping"></div>
                    )}
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                    {isRecording ? "Sedang Mendengar..." : isAnalyzing ? "Menganalisis Bacaan..." : "Voice Coach"}
                </h2>
                <p className="text-slate-400 max-w-md mx-auto h-6 text-sm">
                    {isRecording ? "Sila baca ayat Iqra..." : isAnalyzing ? "Menyemak sebutan..." : "Tekan mikrofon & baca ayat pertama"}
                </p>
            </div>

            {!isAnalyzing && !analysisResult && (
                <button 
                    onClick={handleToggleRecording}
                    className={`w-20 h-20 rounded-full text-3xl shadow-lg transition-all hover:scale-110 flex items-center justify-center ${
                        isRecording 
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30' 
                        : 'bg-primary hover:bg-primary-dark text-black shadow-primary/30'
                    }`}
                >
                    <i className={`fa-solid ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
                </button>
            )}

            {analysisResult && (
                <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-6 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold">Keputusan Analisis</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${analysisResult.score > 80 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            Skor Kelancaran: {analysisResult.score}%
                        </span>
                    </div>
                    
                    {/* Detected Text Display */}
                    {detectedText && (
                        <div className="mb-4 p-3 bg-black/30 rounded-lg border border-white/5">
                            <p className="text-xs text-slate-500 mb-1">Ayat yang didengari (AI):</p>
                            <p className="text-xl text-cyan-400 font-arabic text-right dir-rtl">{detectedText}</p>
                        </div>
                    )}

                    <p className="text-slate-300 text-sm mb-4">{analysisResult.feedback}</p>
                    
                    <button 
                        onClick={() => setAnalysisResult(null)}
                        className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
                    >
                        Cuba Lagi
                    </button>
                </div>
            )}
        </div>
    );
};

export default IqraVoiceCoach;