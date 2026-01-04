import React, { useState, useEffect, useRef } from 'react';
import { Mic, Activity, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IQRA_CONFIG } from '../constants';

interface ASRRecorderProps {
  expectedText: string;
  onResult: (text: string, confidence: number) => void;
}

const ASRRecorder: React.FC<ASRRecorderProps> = ({ expectedText, onResult }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const cooldownRef = useRef<number>(0);

  // Simulation Logic
  useEffect(() => {
    let recordingTimer: NodeJS.Timeout;
    let processingTimer: NodeJS.Timeout;

    if (isRecording) {
      // Simulate recording duration
      recordingTimer = setTimeout(() => {
        setIsRecording(false);
        setIsProcessing(true);
        
        // Simulate Processing time
        processingTimer = setTimeout(() => {
          setIsProcessing(false);
          
          // Generate a Mock Result (Simulated AI)
          // Higher chance of success for demo purposes
          const success = Math.random() > 0.2; 
          const baseScore = success ? IQRA_CONFIG.SCORE_PASS_HIGH : IQRA_CONFIG.SCORE_PASS_LOW;
          // Add some random variance (+- 0.1)
          const confidence = Math.min(0.99, Math.max(0.1, baseScore + (Math.random() * 0.2 - 0.1)));
          
          onResult(expectedText, confidence);
        }, IQRA_CONFIG.ASR_PROCESSING_DELAY);

      }, IQRA_CONFIG.ASR_RECORDING_DURATION);
    }

    return () => {
      clearTimeout(recordingTimer);
      clearTimeout(processingTimer);
    };
  }, [isRecording, expectedText, onResult]);

  const handleRecordClick = () => {
    const now = Date.now();
    // Security: Rate Limiting (Prevent spamming)
    if (now - cooldownRef.current < 1000) {
        return; 
    }
    
    if (!isProcessing && !isRecording) {
        cooldownRef.current = now;
        setIsRecording(true);
    } else if (isRecording) {
        // Allow cancelling? For now, no, enforcing full duration for 'consistency'
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleRecordClick}
        disabled={isProcessing}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all ${
          isRecording 
            ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' 
            : isProcessing
              ? 'bg-cyan-900 cursor-wait opacity-80'
              : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
        }`}
      >
        {isProcessing ? (
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        ) : (
          <Mic className={`w-8 h-8 ${isRecording ? 'text-white' : 'text-black'}`} />
        )}

        {/* Pulse Ring Animation when Recording */}
        {isRecording && (
          <motion.div
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 rounded-full bg-red-500 -z-10"
          />
        )}
      </motion.button>
      
      {/* Status Text */}
      <AnimatePresence mode="wait">
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
            className="text-cyan-400 text-xs font-mono uppercase tracking-widest"
          >
            Menyemak...
          </motion.div>
        ) : (
           <div className="text-slate-500 text-xs font-medium">
             Tekan & Sebut
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ASRRecorder;