import React, { useState, useEffect, useRef } from 'react';
import { Mic, Activity, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IQRA_CONFIG } from '../constants';
import { useAudioRecorder } from '../../../hooks/useAudioRecorder';

interface ASRRecorderProps {
  expectedText: string;
  onResult: (text: string, confidence: number, feedback?: string) => void;
}

const ASRRecorder: React.FC<ASRRecorderProps> = ({ expectedText, onResult }) => {
  const { isRecording, startRecording, stopRecording, audioBlob, visualizerData } = useAudioRecorder();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cooldownRef = useRef<number>(0);

  // Triggered when recording stops and blob is ready
  useEffect(() => {
    if (audioBlob && !isRecording) {
      sendToBackend(audioBlob);
    }
  }, [audioBlob, isRecording]);

  const sendToBackend = async (blob: Blob) => {
    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', blob, 'recitation.webm');
    formData.append('expected_text', expectedText);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Backend offline');

      const data = await response.json();
      
      // Pass the real score and feedback back to the UI
      onResult(expectedText, data.confidence || 0, data.feedback);

    } catch (err) {
      console.error("ASR Error:", err);
      setError("Backend offline. Sila jalankan server Python.");
      // Fallback to simulation if backend fails (Optional, but good for UX)
      setTimeout(() => {
          onResult(expectedText, 0.5, "Ralat sambungan server.");
      }, 1000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecordClick = () => {
    const now = Date.now();
    if (now - cooldownRef.current < 1000) return;
    
    if (!isRecording && !isProcessing) {
      cooldownRef.current = now;
      startRecording();
      // Auto-stop after duration from config
      setTimeout(() => {
          stopRecording();
      }, IQRA_CONFIG.ASR_RECORDING_DURATION);
    }
  };

  const getAriaLabel = () => {
    if (isProcessing) return "Sedang memproses bacaan";
    if (isRecording) return "Sedang merakam suara";
    return "Mula merakam bacaan";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleRecordClick}
        disabled={isProcessing}
        aria-label={getAriaLabel()}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-black ${
          isRecording 
            ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' 
            : isProcessing
              ? 'bg-cyan-900 cursor-wait'
              : 'bg-raudhah-teal hover:bg-raudhah-teal text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
        }`}
      >
        {isProcessing ? (
          <RefreshCw className="w-8 h-8 text-raudhah-teal animate-spin" />
        ) : (
          <Mic className={`w-8 h-8 ${isRecording ? 'text-white' : 'text-black'}`} />
        )}

        {/* Real Visualizer Pulse when Recording */}
        {isRecording && visualizerData && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="absolute inset-0 rounded-full bg-red-500/30 -z-10"
          />
        )}
      </motion.button>
      
      {/* Status Text & Error */}
      <AnimatePresence mode="wait">
        <div aria-live="polite" className="h-5 flex flex-col items-center">
            {isRecording ? (
                <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-red-400 text-xs font-mono uppercase tracking-widest"
                >
                    <Activity className="w-3 h-3 animate-pulse" />
                    Mendengar...
                </motion.div>
            ) : isProcessing ? (
                <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-raudhah-teal text-xs font-mono uppercase tracking-widest"
                >
                    Menyemak Suara...
                </motion.div>
            ) : error ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-[10px] flex items-center gap-1"
                >
                    <AlertCircle className="w-3 h-3" />
                    Backend Offline
                </motion.div>
            ) : (
                <div className="text-slate-500 text-xs font-medium">
                    Tekan & Sebut
                </div>
            )}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default ASRRecorder;
