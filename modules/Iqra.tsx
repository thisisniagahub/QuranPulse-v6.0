
import React, { useState, useRef, useEffect } from 'react';
import { getTafsirForVerse, analyzeText, getVerseConnections, analyzeQuranRecitation, generateIslamicVideo, generateSpeech, analyzeTajweedPosture } from '../services/aiService';
import { speak, stopTTS } from '../services/ttsService';
import { UserProfile } from '../types';
import { PulseLoader } from '../components/PulseLoader';
import styles from './Iqra.module.css';
import VocabBuilder from './iqra/VocabBuilder';

// --- DATA: DIGITAL IQRA CONTENT (TRANSCRIPT FROM SCREENSHOTS) ---
// "WAJIB KEKAL 100%" - Data structure mimics the physical book layout (Grids)

const IQRA_BOOKS_DATA = [
  {
    id: 'iqra-1',
    title: "Iqra' 1",
    color: "border-b-4 border-pink-500",
    bg: "bg-pink-500/10",
    pages: [
      {
        pageNumber: 3,
        title: "Pengenalan Alif & Ba",
        instruction: "Baca terus A (Alif), B (Ba) dan seterusnya. Tidak perlu dieja.",
        // Mimicking the grid layout from Screenshot Page 3
        content: [
          ["أ", "ب"],
          ["ب", "أ", "ب", "أ", "ب", "أ"],
          ["ب", "أ", "ب", "أ", "أ", "أ"],
          ["ب", "أ", "ب", "أ", "ب", "ب"],
          ["ب", "أ", "ب", "أ", "ب", "أ"],
          ["أ", "أ", "أ", "ب", "ب", "ب"],
          ["أ", "ب", "أ", "ب", "أ", "ب"]
        ]
      },
      {
        pageNumber: 7,
        title: "Huruf Ta",
        instruction: "Baca terus A, Ba, Ta dan seterusnya.",
        // Mimicking Screenshot Page 7
        content: [
          ["ب", "ت"],
          ["أ", "ت", "ب", "ت", "ب", "أ"],
          ["ت", "أ", "ب", "أ", "ب", "ت"],
          ["ب", "ت", "أ", "أ", "ت", "ب"],
          ["ت", "أ", "ت", "ب", "أ", "ت"],
          ["أ", "ت", "ت", "ب", "ت", "ب"],
          ["أ", "ب", "ت", "أ", "ب", "ت"]
        ]
      },
      {
        pageNumber: 9,
        title: "Huruf Tsa",
        instruction: "Makhraj Tsa: Hujung lidah bertemu hujung gigi kaci atas.",
        // Mimicking Screenshot Page 9
        content: [
          ["ب", "ت", "ث"],
          ["ث", "أ", "ب", "ث", "ب", "ت"],
          ["ب", "ت", "ث", "ب", "أ", "ث"],
          ["أ", "ت", "ب", "ث", "ب", "ث"],
          ["ت", "ب", "ث", "ث", "أ", "ث"],
          ["أ", "ت", "ث", "ب", "ث", "ث"],
          ["ث", "ب", "ت", "ث", "ت", "ث"],
          ["أ", "ب", "ت", "ث", "أ", "ب", "ت", "ث"]
        ]
      },
      {
        pageNumber: 11,
        title: "Huruf Jim",
        instruction: "Jim (Je). Tengah lidah.",
        // Mimicking Screenshot Page 11
        content: [
          ["ج"],
          ["أ", "ج", "ج", "أ", "ج", "أ"],
          ["أ", "ت", "ج", "أ", "ت", "ج"],
          ["ب", "ج", "ت", "ث", "ج", "ث"],
          ["ج", "أ", "ب", "ج", "أ", "ث"],
          ["ت", "أ", "ج", "ج", "ج", "ج"],
          ["ج", "أ", "ج", "ث", "ث", "ث"],
          ["أ", "ب", "ت", "ث", "ج"]
        ]
      },
      {
        pageNumber: 13,
        title: "Huruf Ha (Pedas)",
        instruction: "Ha (Pedas). Bersih & Nyaring.",
        // Mimicking Screenshot Page 13
        content: [
          ["ج", "ح"],
          ["ج", "أ", "ح", "ح", "ح", "ث"],
          ["ح", "ج", "ت", "ب", "ح", "ث"],
          ["ج", "ح", "ت", "أ", "ح", "ب"],
          ["ج", "أ", "ث", "ح", "أ", "ح"],
          ["ث", "ب", "ح", "ت", "أ", "ح"],
          ["أ", "ج", "ج", "أ", "ح", "ح"],
          ["أ", "ب", "ت", "ث", "ج", "ح"]
        ]
      },
      {
        pageNumber: 15,
        title: "Huruf Kho",
        instruction: "Kho. Bunyi berdengkur sedikit.",
        // Mimicking Screenshot Page 15
        content: [
          ["ج", "ح", "خ"],
          ["ح", "أ", "خ", "ج", "أ", "خ"],
          ["ث", "أ", "خ", "خ", "ت", "ج"],
          ["ب", "أ", "خ", "ت", "ح", "ث"],
          ["ج", "أ", "خ", "ث", "ح", "ت"],
          ["ت", "أ", "خ", "ج", "ح", "ث"],
          ["أ", "خ", "خ", "ج", "ح", "ح"],
          ["أ", "ب", "ت", "ث", "ج", "ح", "خ"]
        ]
      }
    ]
  },
  {
    id: 'iqra-2',
    title: "Iqra' 2",
    color: "border-b-4 border-lime-500",
    bg: "bg-lime-500/10",
    pages: [] // Can be populated similarly
  },
  {
    id: 'iqra-3',
    title: "Iqra' 3",
    color: "border-b-4 border-primary",
    bg: "bg-primary/10",
    pages: []
  }
];

// Expanded Data for Tajweed Tutorials
const TAJWEED_TUTORIALS = [
    {
        id: 'nun-sakinah',
        title: 'Nun Sakinah Rules',
        description: 'Master the 4 rules: Izhar, Idgham, Iqlab, and Ikhfa.',
        icon: 'fa-moon',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        prompt: 'Educational animation explaining Nun Sakinah rules in Tajweed. Show the letter Nun with a sukoon followed by different letters. Visualizing Izhar, Idgham, Iqlab, and Ikhfa with Arabic text examples. Clear and instructional.'
    },
    {
        id: 'qalqalah',
        title: 'The Echo (Qalqalah)',
        description: 'Bouncing the sound of 5 letters (Qaf, Toa, Ba, Jim, Dal).',
        icon: 'fa-wifi',
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        prompt: 'Cinematic educational video about Qalqalah Tajweed rule. Show Arabic letters Qaf, Toa, Ba, Jim, Dal vibrating and glowing to represent the echoing sound. Clear Arabic typography on a dark background.'
    },
    {
        id: 'madd',
        title: 'The Madd (Elongation)',
        description: 'Understanding the different lengths of vowels (2, 4, 6).',
        icon: 'fa-wave-square',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
        prompt: 'Visual guide to Madd (Elongation) in Quran. Animation of Arabic vowels stretching. Show wave patterns representing sound duration (2, 4, 6 harakat). Educational style.'
    },
    {
        id: 'ghunnah',
        title: 'Ghunnah (Nasal)',
        description: 'The nasal sound of Mim and Nun Mushaddadah.',
        icon: 'fa-wind',
        color: 'text-pink-400',
        bgColor: 'bg-pink-500/10',
        borderColor: 'border-pink-500/30',
        prompt: 'Educational animation of the human profile showing sound airflow through the nose (nasal passage) for Arabic letters Mim and Nun with Shaddah. Soft pink aesthetics.'
    },
    {
        id: 'makhraj',
        title: 'Makhraj (Articulation)',
        description: 'Where exactly each letter sound comes from.',
        icon: 'fa-language', 
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        prompt: '3D animation of human mouth and throat anatomy showing Makhraj points for Arabic letters. Educational diagram style highlighting tongue positions and throat areas.'
    }
];

interface AnalysisResult {
    identified_text: string;
    accuracy_score: number;
    tajweed_errors: { error: string; tip: string }[];
    feedback_summary: string;
}

interface IqraProps {
    user?: UserProfile;
    onUpdateUser?: (user: UserProfile) => void;
}

// Haptic Helper
const triggerHaptic = (type: 'SUCCESS' | 'ERROR' | 'TICK') => {
    if (!navigator.vibrate) return;
    if (type === 'SUCCESS') navigator.vibrate([50, 50, 50, 50, 100]); // Pulse
    if (type === 'ERROR') navigator.vibrate([30, 50, 30]); // Bzz-bzz
    if (type === 'TICK') navigator.vibrate(15);
};

const Iqra: React.FC<IqraProps> = ({ user, onUpdateUser }) => {
  // Mode State
  const [mode, setMode] = useState<'READ' | 'COACH' | 'VISION_COACH' | 'TUTORIALS' | 'VOCAB'>('READ');

  // Book Reader State
  const [currentBookId, setCurrentBookId] = useState('iqra-1');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [activePlayingCell, setActivePlayingCell] = useState<string | null>(null);

  // Voice Coach State
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [volume, setVolume] = useState(0); // For Visualizer
  
  // Tutorial State
  const [selectedTutorial, setSelectedTutorial] = useState<typeof TAJWEED_TUTORIALS[0] | null>(null);
  const [tutorialVideoUrl, setTutorialVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeTypeRef = useRef<string>('audio/webm');
  
  // Audio Context for TTS Playback & Visualizer
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // Vision Coach Refs & State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [visionResult, setVisionResult] = useState<{ is_correct: boolean; feedback: string; confidence: number } | null>(null);

  // Derived Data
  const currentBook = IQRA_BOOKS_DATA.find(b => b.id === currentBookId) || IQRA_BOOKS_DATA[0];
  // Fix: Handle books with no pages gracefully
  const currentPage = currentBook.pages.length > 0 ? currentBook.pages[currentPageIndex] : null;

  // Progress Logic
  const getPageProgress = (bookId: string, pageNum: number) => {
      return user?.iqra_progress?.[bookId]?.[pageNum] || null;
  };

  const calculateBookPercentage = (bookId: string) => {
      if (!user?.iqra_progress?.[bookId]) return 0;
      const completedPages = Object.keys(user.iqra_progress[bookId]).length;
      const totalPages = IQRA_BOOKS_DATA.find(b => b.id === bookId)?.pages.length || 1;
      // Prevent division by zero if pages is 0
      if (totalPages === 0) return 0;
      return Math.min(100, Math.round((completedPages / totalPages) * 100));
  };

  const pageProgress = currentPage ? getPageProgress(currentBookId, currentPage.pageNumber) : null;
  const bookPercentage = calculateBookPercentage(currentBookId);

  // --- TTS Playback Logic (Hybrid: Gemini -> Native) ---
  const playTTS = async (text: string, cellId?: string) => {
    if (cellId) setActivePlayingCell(cellId);
    triggerHaptic('TICK');

    try {
        // STRATEGY: Try Native TTS first for speed/offline, fallback to Gemini if needed?
        // Actually, Gemini TTS (Zephyr) is much higher quality. 
        // Let's keep Gemini as primary, but catch errors and fallback to Native.
        
        // 1. Attempt Native TTS (Immediate Feedback)
        // Note: For single letters/words, Native is often faster and sufficient.
        // Let's use Native for single letters (length < 2) and Gemini for sentences?
        // Or just use Native for everything in Iqra for "instant" feel.
        
        // DECISION: Use Native TTS for Iqra (Letters/Words) for zero-latency.
        await speak(text, { lang: 'ar-SA', rate: 0.8 });
        
        if (cellId) setActivePlayingCell(null);

    } catch (e) {
        console.warn("Native TTS failed, trying Gemini...", e);
        // Fallback to Gemini
        await playGeminiTTS(text, 'Zephyr', cellId);
    }
  };

  const playGeminiTTS = async (text: string, voice: 'Zephyr' | 'Kore' = 'Zephyr', cellId?: string) => {
    try {
        // Initialize Audio Context singleton
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        
        // Generate speech via Gemini
        const base64 = await generateSpeech(text, voice);
        if (!base64) {
             setActivePlayingCell(null);
             return;
        }

        // Decode Base64 to ArrayBuffer (Raw PCM)
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Convert PCM Int16 to Float32 AudioBuffer
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) {
             channelData[i] = dataInt16[i] / 32768.0;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => {
            if (cellId) setActivePlayingCell(null);
        };
        source.start();

    } catch (e) {
        console.error("Audio Playback Error", e);
        setActivePlayingCell(null);
    }
  };


  // --- Audio Recording Logic ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // --- VISUALIZER SETUP ---
      if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // Low res for visualizer
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateVisualizer = () => {
          analyser.getByteFrequencyData(dataArray);
          // Calculate average volume roughly
          let sum = 0;
          for(let i = 0; i < bufferLength; i++) sum += dataArray[i];
          setVolume(sum / bufferLength);
          animationRef.current = requestAnimationFrame(updateVisualizer);
      };
      updateVisualizer();

      // --- RECORDING SETUP ---
      // Feature detect supported mime type
      const mimeTypes = [
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/mp4',
          'audio/ogg'
      ];
      const selectedType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/webm';
      mimeTypeRef.current = selectedType;

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: selectedType });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        // Stop Visualizer
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (analyserRef.current) {
            // Do not disconnect source strictly to avoid killing stream before blob creation
            // but usually safe to disconnect analyser
            analyserRef.current.disconnect();
            analyserRef.current = null;
        }
        setVolume(0);

        const blob = new Blob(chunksRef.current, { type: mimeTypeRef.current });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsAnalyzing(true);
          try {
            // Send current page content as context
            const contextText = currentPage?.content?.flat().join(' ') || "Quran recitation";
            
            // Pass the detected mime type to the API
            const data = await analyzeQuranRecitation(base64Audio, mimeTypeRef.current, contextText);
            
            const finalResult = {
                identified_text: data.identified_text || "Recitation",
                accuracy_score: data.accuracy_score || 0,
                tajweed_errors: data.tajweed_errors || [],
                feedback_summary: data.feedback_summary || "Keep practicing!"
            };
            
            setResult(finalResult);

            // Trigger Haptics based on Result
            if (finalResult.accuracy_score >= 70) {
                triggerHaptic('SUCCESS');
            } else {
                triggerHaptic('ERROR');
            }

            // --- PROGRESS TRACKING ---
            if (finalResult.accuracy_score >= 70 && user && onUpdateUser && currentPage) {
                // Clone existing progress
                const newIqraProgress = { ...(user.iqra_progress || {}) };
                if (!newIqraProgress[currentBookId]) newIqraProgress[currentBookId] = {};
                
                // Check if this is a new high score
                const currentBest = newIqraProgress[currentBookId][currentPage.pageNumber]?.score || 0;
                
                if (finalResult.accuracy_score > currentBest) {
                    newIqraProgress[currentBookId][currentPage.pageNumber] = {
                        score: finalResult.accuracy_score,
                        completedAt: Date.now()
                    };
                }
                
                // Bonus XP logic
                const bonusXp = finalResult.accuracy_score > currentBest ? 10 : 2; // small bonus for re-practice

                // Parse book number (e.g. iqra-1 -> 1)
                const bookNum = parseInt(currentBookId.replace('iqra-', '')) || 1;

                onUpdateUser({
                    ...user,
                    iqra_progress: newIqraProgress,
                    xp_total: user.xp_total + bonusXp,
                    // ALWAYS update user position if they passed (even if not a new high score)
                    // This satisfies "when a user completes a page ... update their last_read..."
                    last_read_surah: bookNum,
                    last_read_ayah: currentPage.pageNumber
                });
            }

          } catch (e) {
            console.error(e);
            alert("Analysis failed. Please try again.");
          } finally {
            setIsAnalyzing(false);
          }
        };
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setResult(null);
      triggerHaptic('TICK');
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Microphone access is required.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      triggerHaptic('TICK');
    }
  };

  // --- Vision Coach Logic ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera Error", err);
      alert("Camera access required for Vision Coach.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    // Capture frame
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    const base64Image = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
    setIsAnalyzing(true);
    setVisionResult(null);

    // Analyze
    // Assuming the first letter of the page is the target for now
    const targetLetter = currentPage?.content[0][0] || "Alif"; 
    const result = await analyzeTajweedPosture(base64Image, targetLetter);
    
    setVisionResult(result);
    setIsAnalyzing(false);
    
    if (result.is_correct) triggerHaptic('SUCCESS');
    else triggerHaptic('ERROR');
  };

  // --- Video Generation Logic ---
  const handleGenerateLesson = async () => {
    if (!selectedTutorial) return;
    
    // Check for API Key selection (Required for Veo)
    // Check for API Key selection (Required for Veo)
    try {
      if ((window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
          const success = await (window as any).aistudio.openSelectKey();
          if (!success) return;
        }
      }
    } catch (e) {
        console.warn("API Check skipped", e);
    }

    setIsGeneratingVideo(true);
    try {
      const url = await generateIslamicVideo(selectedTutorial.prompt);
      if (url) setTutorialVideoUrl(url);
    } catch (e) {
      alert("Failed to generate video lesson. Please try again.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const renderVisionCoach = () => (
    <div className="h-full flex flex-col items-center justify-center space-y-6 relative animate-fade-in">
       {/* Back Button */}
       <div className="absolute top-0 left-0 w-full flex justify-start z-10">
          <button onClick={() => { stopCamera(); setMode('READ'); }} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <i className="fa-solid fa-arrow-left"></i> Back to Book
          </button>
       </div>

       <div className="text-center space-y-2">
           <h3 className="text-2xl font-bold text-white">Vision Tajweed Coach</h3>
           <p className="text-slate-400 text-sm">Align your mouth with the camera to check your Makhraj.</p>
       </div>

       {/* Camera Viewfinder */}
       <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-slate-700 shadow-2xl bg-black">
           <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]"></video>
           <canvas ref={canvasRef} className="hidden"></canvas>
           
           {!isCameraActive && (
               <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                   <button onClick={startCamera} className="px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary-hover transition-colors">
                       <i className="fa-solid fa-camera mr-2"></i> Start Camera
                   </button>
               </div>
           )}

           {/* Scanning Overlay */}
           {isAnalyzing && (
               <div className="absolute inset-0 bg-primary/20 animate-pulse flex items-center justify-center">
                   <div className="w-full h-1 bg-primary absolute top-1/2 animate-[scan_2s_linear_infinite]"></div>
               </div>
           )}
       </div>

       {/* Controls */}
       {isCameraActive && (
           <button 
               onClick={captureAndAnalyze}
               disabled={isAnalyzing}
               aria-label="Capture and Analyze"
               className="w-20 h-20 rounded-full bg-white border-4 border-slate-300 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
           >
               <div className="w-16 h-16 rounded-full bg-primary border-2 border-white"></div>
           </button>
       )}

       {/* Feedback Card */}
       {visionResult && (
           <div className={`w-full max-w-sm p-4 rounded-2xl border ${visionResult.is_correct ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} animate-slide-up`}>
               <div className="flex items-start gap-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${visionResult.is_correct ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                       <i className={`fa-solid ${visionResult.is_correct ? 'fa-check' : 'fa-xmark'}`}></i>
                   </div>
                   <div>
                       <h4 className={`font-bold ${visionResult.is_correct ? 'text-green-400' : 'text-red-400'}`}>
                           {visionResult.is_correct ? 'Correct Posture!' : 'Adjust Posture'}
                       </h4>
                       <p className="text-sm text-slate-300 mt-1">{visionResult.feedback}</p>
                       <p className="text-xs text-slate-500 mt-2">Confidence: {visionResult.confidence}%</p>
                   </div>
               </div>
           </div>
       )}
    </div>
  );

  const renderVocabBuilder = () => (
    <div className="h-full flex flex-col relative animate-fade-in">
       {/* Back Button */}
       <div className="absolute top-0 left-0 w-full flex justify-start z-10">
          <button onClick={() => setMode('READ')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <i className="fa-solid fa-arrow-left"></i> Back to Book
          </button>
       </div>
       
       <div className="flex-1 flex items-center justify-center">
          <VocabBuilder isDark={true} />
       </div>
    </div>
  );

  // --- Render Helpers ---
  
  const renderBookReader = () => {
    // Fix: Show "Coming Soon" state if no pages exist (prevent invisible book issue)
    if (!currentPage) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 animate-fade-in bg-slate-900 rounded-2xl border border-slate-800 p-6">
                <i className="fa-solid fa-book-open text-6xl mb-4 opacity-20"></i>
                <h3 className="text-xl font-bold text-slate-300 mb-2">{currentBook.title}</h3>
                <p className="text-sm mb-6 text-center">This book is currently being digitized. Please check back later.</p>
                <button 
                    onClick={() => setMode('TUTORIALS')} 
                    className="px-6 py-3 bg-primary hover:bg-primary-hover text-black rounded-xl font-bold transition-colors"
                >
                    Watch Tutorials Instead
                </button>
            </div>
        );
    }

    return (
    <div className="h-full flex flex-col space-y-4 relative animate-fade-in">
        {/* Book Header with Progress */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-lg z-10">
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <button 
                        disabled={currentPageIndex === 0}
                        onClick={() => setCurrentPageIndex(p => Math.max(0, p - 1))}
                        className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 disabled:opacity-30 hover:bg-slate-700 hover:text-white transition-colors"
                        aria-label="Previous Page"
                        title="Previous Page"
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <div>
                        <h3 className="font-bold text-white text-lg leading-tight">{currentBook.title}</h3>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-slate-400">Page {currentPage.pageNumber}</p>
                            {pageProgress && (
                                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold border border-primary/20">
                                    Mastered ({pageProgress.score}%)
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <button 
                    disabled={currentPageIndex === currentBook.pages.length - 1}
                    onClick={() => setCurrentPageIndex(p => Math.min(currentBook.pages.length - 1, p + 1))}
                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 disabled:opacity-30 hover:bg-slate-700 hover:text-white transition-colors"
                    aria-label="Next Page"
                    title="Next Page"
                >
                    <i className="fa-solid fa-chevron-right"></i>
                </button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-secondary to-secondary-light transition-all duration-500 ease-out"
                    // eslint-disable-next-line
                    style={{ width: `${bookPercentage}%` }}
                ></div>
            </div>
            
            {/* Certificate Teaser */}
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-slate-500">
                <span>Completion: {bookPercentage}%</span>
                {bookPercentage >= 100 && (
                    <span className="text-secondary flex items-center gap-1 animate-pulse">
                        <i className="fa-solid fa-certificate"></i> Certified
                    </span>
                )}
            </div>
            
            {bookPercentage >= 100 && (
                <div className="bg-secondary/10 border border-secondary/30 p-2 rounded-lg flex items-center justify-between">
                     <div className="flex items-center gap-2">
                         <i className="fa-solid fa-award text-secondary text-xl"></i>
                         <div>
                             <p className="text-white text-xs font-bold">Iqra 1 Certificate</p>
                             <p className="text-[10px] text-slate-400">Ready to download</p>
                         </div>
                     </div>
                     <button className="text-xs bg-secondary text-black px-3 py-1 rounded font-bold hover:bg-secondary-hover">View</button>
                </div>
            )}
        </div>

        {/* Page Content - The "Grid" */}
        {/* Added Key for Page Transition Animation */}
        {/* Fix: Added min-height to prevent collapse and bg-white for visibility */}
        <div key={currentPageIndex} className="flex-1 bg-[#fffdf5] rounded-xl shadow-2xl overflow-hidden relative text-black p-2 sm:p-6 border-l-8 border-l-slate-800 border-r-2 border-r-slate-300 animate-slide-up origin-bottom min-h-[400px]">
            {/* Paper Texture/Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 pointer-events-none"></div>
            
            {/* Completed Stamp */}
            {pageProgress && (
                <div className="absolute top-4 right-4 z-20 rotate-12 border-4 border-primary text-primary rounded-lg px-4 py-2 font-bold text-xl opacity-0 animate-[fadeIn_0.5s_ease-out_0.5s_forwards] font-serif">
                    LULUS
                </div>
            )}

            {/* Header/Instruction inside page */}
            <div className="bg-pink-100 border-2 border-pink-300 rounded-lg p-3 mb-4 text-center relative z-10 shadow-sm">
                <p className="font-serif font-bold text-pink-800 text-sm sm:text-base leading-tight">{currentPage.instruction}</p>
            </div>

            {/* The Grid - Classic Iqra Layout */}
            {/* Fix: Added dir="rtl" for correct Arabic Reading Order (Right to Left) */}
            <div className="flex flex-col gap-0 border-2 border-black relative z-10 shadow-lg bg-white" dir="rtl">
                {currentPage.content.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex border-b-2 border-black last:border-b-0 relative">
                        {/* Page Number Indicator Badge in Center (Visual Polish) */}
                        {rowIndex === 0 && currentPage.content.length > 0 && (
                             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-6 h-6 bg-white rounded-full border-2 border-black flex items-center justify-center text-xs font-bold shadow-sm pointer-events-none">
                                 {currentPage.pageNumber}
                             </div>
                        )}

                        {row.map((cell, colIndex) => {
                            const cellId = `${rowIndex}-${colIndex}`;
                            return (
                                <div 
                                    key={colIndex} 
                                    className={`flex-1 h-24 sm:h-32 flex items-center justify-center border-l-2 border-black last:border-l-0 hover:bg-secondary/20 cursor-pointer transition-colors duration-200 relative group ${activePlayingCell === cellId ? 'bg-secondary/40' : ''}`}
                                    onClick={() => playTTS(cell, cellId)}
                                >
                                    {activePlayingCell === cellId && (
                                        <div className="absolute top-1 right-1">
                                             <i className="fa-solid fa-volume-high text-black animate-pulse text-xs"></i>
                                        </div>
                                    )}
                                    <span className="font-arabic text-5xl sm:text-6xl font-bold transform group-hover:scale-110 transition-transform duration-300">{cell}</span>
                                    <span className="absolute bottom-1 text-[8px] text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">Tap to listen</span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Page Number Footer */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-sm font-bold z-10 bg-white shadow-sm">
                {currentPage.pageNumber}
            </div>
        </div>

        {/* Action Bar */}
        <div className="flex gap-3 pb-safe">
            <button 
                onClick={() => setMode('COACH')}
                className="flex-1 bg-primary hover:bg-primary-hover text-black font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 hover:-translate-y-1"
            >
                <i className="fa-solid fa-microphone"></i>
                {pageProgress ? 'Practice Again' : 'Test This Page'}
            </button>
            
            <button 
                onClick={() => setMode('VISION_COACH')}
                className="w-16 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl shadow-lg flex items-center justify-center transition-all transform active:scale-95 hover:-translate-y-1"
                title="Vision Coach (Beta)"
            >
                <i className="fa-solid fa-eye"></i>
            </button>
        </div>
    </div>
  );
  };

  const renderVoiceCoach = () => {
    if (!currentPage) return null;
    return (
    <div className="h-full flex flex-col items-center justify-center space-y-8 relative animate-fade-in">
      {/* Navigation Back */}
      <div className="absolute top-0 left-0 w-full flex justify-start">
          <button onClick={() => setMode('READ')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <i className="fa-solid fa-arrow-left"></i> Back to Book
          </button>
      </div>

      {/* Context Card */}
      <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 text-center max-w-sm w-full backdrop-blur-sm shadow-xl">
        <h3 className="text-xl font-bold text-white mb-1">Recite Page {currentPage.pageNumber}</h3>
        <div className="font-arabic text-3xl text-primary my-4 leading-relaxed drop-shadow-md" dir="rtl">
           {currentPage.content[0].join(' ')} ...
        </div>
        <p className="text-xs text-slate-400">Read the lines clearly. I'm listening.</p>
      </div>

      {/* DYNAMIC AUDIO VISUALIZER */}
      {isRecording && (
          <div className="flex justify-center items-center gap-1.5 h-16 w-full max-w-[200px]">
              {[...Array(5)].map((_, i) => (
                  // eslint-disable-next-line
                  <div
                    key={i}
                    className={`w-2 bg-primary rounded-full transition-all duration-75 shadow-[0_0_10px_#00BFA5] opacity-80 ${styles.visualizerBar}`}
                    // eslint-disable-next-line
                    style={{
                        height: `${Math.max(10, Math.min(100, volume * (1 + i/2)))}%`
                    }}
                  ></div>
              ))}
          </div>
      )}

      {/* Visualizer / Recording Button - UPDATED WITH PULSE LOADER */}
      <div className="relative group flex items-center justify-center">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isAnalyzing}
          className="focus:outline-none"
        >
          {isRecording ? (
             <PulseLoader icon="fa-stop" size="lg" active={true} />
          ) : isAnalyzing ? (
             <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center">
                 <i className="fa-solid fa-circle-notch fa-spin text-3xl text-slate-500"></i>
             </div>
          ) : (
             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-lg shadow-primary/40 hover:scale-105 transition-transform">
                 <i className="fa-solid fa-microphone text-3xl"></i>
             </div>
          )}
        </button>
      </div>

      {/* Status Text */}
      <p className="text-slate-400 text-sm font-medium animate-pulse">
        {isAnalyzing ? "Analyzing Pronunciation..." : isRecording ? "Listening to your voice..." : "Tap to Start"}
      </p>

      {/* Results Card */}
      {result && (
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 animate-slide-up shadow-xl transition-all duration-500">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-white">Analysis</h4>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${result.accuracy_score > 70 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    Score: {result.accuracy_score}%
                </div>
            </div>
            
            <div className="space-y-3">
                {result.accuracy_score > 70 && (
                    <div className="bg-secondary/10 p-3 rounded-xl border border-secondary/30 mb-2 flex items-center gap-3 animate-fade-in">
                        <div className="w-8 h-8 rounded-full bg-secondary text-black flex items-center justify-center font-bold">
                            <i className="fa-solid fa-trophy"></i>
                        </div>
                        <div>
                            <p className="text-secondary font-bold text-sm">Page Completed!</p>
                            <p className="text-xs text-secondary-light/70">Progress Saved & XP Earned</p>
                        </div>
                    </div>
                )}

                {result.tajweed_errors.length > 0 ? (
                    <div className="bg-red-900/20 p-3 rounded-xl border border-red-500/20 animate-fade-in">
                        <p className="text-xs text-red-300 font-bold mb-2"><i className="fa-solid fa-triangle-exclamation mr-1"></i> Analysis:</p>
                        <ul className="space-y-2">
                            {result.tajweed_errors.map((item, i) => (
                                // eslint-disable-next-line
                                <li
                                    key={i}
                                    className={`bg-black/20 p-2 rounded-lg border border-white/5 animate-slide-up ${styles.errorItem}`}
                                    // eslint-disable-next-line
                                    style={{ animationDelay: `${i * 150}ms` }}
                                >
                                    <div className="flex justify-between items-start">
                                        <p className="text-xs text-red-200 font-semibold mb-1">{item.error}</p>
                                        <button 
                                          onClick={() => playGeminiTTS(item.tip, 'Kore')}
                                          className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded hover:bg-primary/20 transition-colors"
                                          aria-label="Play Tip"
                                          title="Play Tip"
                                        >
                                          <i className="fa-solid fa-volume-high"></i>
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-primary flex items-start gap-1">
                                        <i className="fa-solid fa-lightbulb mt-0.5"></i> {item.tip}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 flex items-center gap-2 animate-fade-in">
                        <i className="fa-solid fa-check-circle text-primary"></i>
                        <p className="text-xs text-primary-light">Excellent recitation! No major errors detected.</p>
                    </div>
                )}
                
                <div className="pt-2 border-t border-slate-800">
                    <p className="text-xs text-slate-400 italic">"{result.feedback_summary}"</p>
                </div>
            </div>
            
            <button 
                onClick={() => { setResult(null); setMode('READ'); }}
                className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
                Continue Reading
            </button>
        </div>
      )}
    </div>
  );
  };
  
  // --- Tutorials Render ---
  const renderTutorials = () => (
      <div className="space-y-4 animate-slide-up h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setMode('READ')} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white" aria-label="Back to Read" title="Back to Read">
                  <i className="fa-solid fa-arrow-left"></i>
              </button>
              <h2 className="text-xl font-bold text-white">Tajweed Masterclass</h2>
          </div>

          {!selectedTutorial ? (
              <div className="grid grid-cols-1 gap-4">
                  {TAJWEED_TUTORIALS.map((tut) => (
                      <div 
                        key={tut.id}
                        onClick={() => setSelectedTutorial(tut)}
                        className={`p-4 rounded-2xl border ${tut.borderColor} ${tut.bgColor} cursor-pointer hover:scale-[1.02] transition-transform`}
                      >
                          <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-xl ${tut.color}`}>
                                  <i className={`fa-solid ${tut.icon}`}></i>
                              </div>
                              <div className="flex-1">
                                  <h3 className="text-white font-bold">{tut.title}</h3>
                                  <p className="text-xs text-slate-400">{tut.description}</p>
                              </div>
                              <i className="fa-solid fa-chevron-right text-slate-500"></i>
                          </div>
                      </div>
                  ))}
              </div>
          ) : (
              <div className="space-y-6 animate-fade-in">
                  <button onClick={() => { setSelectedTutorial(null); setTutorialVideoUrl(null); }} className="text-xs text-slate-500 hover:text-white mb-2 flex items-center gap-1">
                      <i className="fa-solid fa-arrow-left"></i> Back to Topics
                  </button>
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 overflow-hidden">
                      <div className="relative aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
                          {isGeneratingVideo ? (
                              <div className="text-center">
                                  <i className="fa-solid fa-circle-notch fa-spin text-3xl text-teal-500 mb-2"></i>
                                  <p className="text-xs text-slate-400">Generating AI Lesson...</p>
                              </div>
                          ) : tutorialVideoUrl ? (
                              <video src={tutorialVideoUrl} controls autoPlay className="w-full h-full object-contain" />
                          ) : (
                              <div className="text-center p-6">
                                  <div className={`w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 ${selectedTutorial.color}`}>
                                      <i className={`fa-solid ${selectedTutorial.icon} text-3xl`}></i>
                                  </div>
                                  <h3 className="text-white font-bold mb-2">Watch Lesson: {selectedTutorial.title}</h3>
                                  <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto">Generate a 5-second AI video explaining this rule visually.</p>
                                  <button 
                                    onClick={handleGenerateLesson}
                                    className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-700 text-white font-bold rounded-full shadow-lg hover:shadow-teal-500/20 transition-transform hover:-translate-y-1"
                                  >
                                      <i className="fa-solid fa-wand-magic-sparkles mr-2"></i> Generate Video
                                  </button>
                              </div>
                          )}
                      </div>
                  </div>
                  
                  <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                      <h4 className="text-white font-bold mb-2">About this Rule</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{selectedTutorial.description}</p>
                      <div className="mt-4 p-4 bg-slate-900 rounded-xl border border-slate-800">
                          <p className="text-xs text-slate-500 uppercase font-bold mb-2">Practice Prompt</p>
                          <p className="text-sm text-teal-400 font-arabic text-right" dir="rtl">... (Arabic Example) ...</p>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );

  return (
    <div className="p-4 h-full flex flex-col pb-24">
       {mode === 'READ' && renderBookReader()}
       {mode === 'COACH' && renderVoiceCoach()}
       {mode === 'VISION_COACH' && renderVisionCoach()}
       {mode === 'TUTORIALS' && renderTutorials()}
      {mode === 'VOCAB' && renderVocabBuilder()}
       
       {/* Bottom Nav for Iqra Modes */}
       {mode === 'READ' && (
           <div className="mt-4 grid grid-cols-2 gap-3">
               <button 
                onClick={() => setMode('TUTORIALS')}
                className="bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-slate-700"
               >
                   <i className="fa-solid fa-graduation-cap"></i> Tajweed Lessons
               </button>
               <button className="bg-slate-800 hover:bg-slate-700 text-slate-400 py-3 rounded-xl font-bold text-xs border border-slate-700 cursor-not-allowed opacity-50">
                   <i className="fa-solid fa-chart-line"></i> Analytics (Coming Soon)
               </button>
           </div>
       )}
    </div>
  );
};

export default Iqra;
