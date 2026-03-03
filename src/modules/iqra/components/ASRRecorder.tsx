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

      onResult(expectedText, data.confidence || 0, data.feedback);

    } catch (err) {
      console.error("ASR Error:", err);
      setError("Backend offline. Sila jalankan server Python.");
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
    <div className="flex flex-col items-center gap-4">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleRecordClick}
        disabled={isProcessing}
        aria-label={getAriaLabel()}
        className={`relative w-24 h-24 rounded-[2rem] flex items-center justify-center transition-all focus:outline-none focus:ring-4 focus:ring-raudhah-teal/30 shadow-warm ${isRecording
            ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]'
            : isProcessing
              ? 'bg-raudhah-teal/20 cursor-wait'
              : 'bg-raudhah-teal hover:bg-raudhah-ink text-white group'
          }`}
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-[2rem] transition-opacity" />
        {isProcessing ? (
          <div className="inline-flex animate-spin">
            <RefreshCw className="w-10 h-10 text-raudhah-teal" />
          </div>
        ) : (
          <Mic className={`w-10 h-10 relative z-10 ${isRecording ? 'text-white' : 'text-white'}`} />
        )}

        {/* Real Visualizer Pulse when Recording */}
        {isRecording && visualizerData && (
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="absolute inset-0 rounded-[2rem] bg-red-500/40 -z-10"
          />
        )}
      </motion.button>

      {/* Status Text & Error */}
      <AnimatePresence mode="wait">
        <div aria-live="polite" className="h-6 flex flex-col items-center">
          {isRecording ? (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <Activity className="w-3 h-3 animate-pulse" />
              Mendengar...
            </motion.div>
          ) : isProcessing ? (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-raudhah-teal text-[10px] font-black uppercase tracking-[0.3em]"
            >
              Menyemak Suara...
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full border border-red-100"
            >
              <AlertCircle className="w-3 h-3" />
              Offline
            </motion.div>
          ) : (
            <div className="text-raudhah-teal/40 text-[10px] font-black uppercase tracking-[0.3em]">
              Sentuh & Sebut
            </div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default ASRRecorder;
