import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, Activity, Play, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ForensicData {
    pitch: {
        average_hz: number;
        track: number[];
    };
    formants_midpoint: {
        f1_hz: number;
        f2_hz: number;
    };
    max_intensity_db: number;
}

interface Verdict {
    status: 'PASS' | 'FAIL';
    text_accuracy: string;
    tajweed_issues: string[];
    ai_feedback: string[];
}

interface AnalysisResult {
    transcription: string;
    forensics: ForensicData;
    verdict: Verdict;
}

const ASRRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                handleUpload(blob);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setResult(null);
        } catch (err) {
            console.error("Error accessing microphone:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleUpload = async (audioBlob: Blob) => {
        setIsProcessing(true);
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.webm");
        formData.append("ayah_index", "1"); // Default to Ayah 1 for prototype

        try {
            const response = await fetch("http://localhost:8000/analyze", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error("Upload failed:", err);
            // Mock result for demo if backend is offline
        } finally {
            setIsProcessing(false);
        }
    };

    // --- Visualizer Components ---

    const PitchVisualizer = ({ track }: { track: number[] }) => {
        // Determine bounds for simple visualization
        const min = Math.min(...track.filter(v => v > 0));
        const max = Math.max(...track);
        const range = max - min || 1;

        return (
            <div className="flex items-end h-24 gap-[1px] bg-slate-900/50 rounded-lg p-2 overflow-hidden">
                {track.map((val, idx) => (
                    val > 0 && <div
                        key={idx}
                        className="w-1 bg-cyan-400/80 rounded-t-sm bar-height"
                        // eslint-disable-next-line
                        style={{ '--bar-height': `${((val - min) / range) * 100}%` } as React.CSSProperties} // eslint-disable-line
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-slate-950 rounded-xl border border-slate-800 shadow-2xl font-sans text-slate-100">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    AI Tajweed Coach
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <Activity className="w-4 h-4" />
                    <span>HYBRID FORENSICS ENGINE</span>
                </div>
            </div>

            {/* Main Action Area */}
            <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800/50 mb-6 relative overflow-hidden">

                {/* Animated Rings for Recording State */}
                {isRecording && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-32 h-32 rounded-full bg-red-500/20 absolute"
                        />
                        <motion.div
                            animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                            className="w-32 h-32 rounded-full bg-red-500/10 absolute"
                        />
                    </div>
                )}

                {/* Record Button */}
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing}
                    className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording
                        ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                        : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105'
                        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isProcessing ? (
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : isRecording ? (
                        <Square className="w-8 h-8 text-white fill-current" />
                    ) : (
                        <Mic className="w-8 h-8 text-white" />
                    )}
                </button>

                <p className="mt-6 text-slate-400 font-medium">
                    {isProcessing ? "Analyzing Forensics..." : isRecording ? "Listening..." : "Tap to Recite Ayah"}
                </p>
            </div>

            {/* Results Section */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Verdict Card */}
                        <div className={`p-4 rounded-xl border ${result.verdict.status === 'PASS' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-lg ${result.verdict.status === 'PASS' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                    {result.verdict.status === 'PASS' ? <CheckCircle className="w-6 h-6 text-green-400" /> : <AlertTriangle className="w-6 h-6 text-red-400" />}
                                </div>
                                <div>
                                    <h3 className={`text-lg font-bold ${result.verdict.status === 'PASS' ? 'text-green-400' : 'text-red-400'}`}>
                                        {result.verdict.status === 'PASS' ? "MashaAllah! Excellent Recitation" : "Improvements Needed"}
                                    </h3>
                                    <p className="text-slate-400 text-sm mt-1">
                                        Text Accuracy: <span className="text-white font-mono">{result.verdict.text_accuracy}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Transcription "X-Ray" */}
                        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Transcription (Whisper v3)</h4>
                            <p className="text-xl text-right font-arabic leading-loose text-emerald-100" dir="rtl">
                                {result.transcription}
                            </p>
                        </div>

                        {/* Acoustic Data Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Pitch Analysis */}
                            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 col-span-2">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Melody & Pitch (Hz)</h4>
                                    <span className="text-xs font-mono text-cyan-400">{result.forensics.pitch.average_hz.toFixed(0)} Hz Avg</span>
                                </div>
                                <PitchVisualizer track={result.forensics.pitch.track} />
                            </div>

                            {/* Formant F2 (Makhraj) */}
                            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Makhraj Quality (F2)</h4>
                                <div className="text-2xl font-mono text-indigo-400">{result.forensics.formants_midpoint.f2_hz.toFixed(0)} Hz</div>
                                <p className="text-xs text-slate-400 mt-2">
                                    {result.forensics.formants_midpoint.f2_hz < 1500 ? "Lower F2 detected (Heavier Quality)" : "Higher F2 detected (Lighter Quality)"}
                                </p>
                            </div>

                            {/* Intensity */}
                            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Loudness</h4>
                                <div className="text-2xl font-mono text-amber-400">{result.forensics.max_intensity_db.toFixed(1)} dB</div>
                            </div>
                        </div>

                        {/* AI Feedback List */}
                        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">AI Coach Feedback</h4>
                            <ul className="space-y-2">
                                {result.verdict.ai_feedback.map((msg, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                        {msg}
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default ASRRecorder;
