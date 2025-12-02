
import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { getTafsirForVerse, analyzeText, getVerseConnections, analyzeQuranRecitation, generateIslamicVideo, generateSpeech, analyzeTajweedPosture } from '../services/aiService';
import { speak, stopTTS } from '../services/ttsService';
import { UserProfile, IqraPage, IqraCell } from '../types';
import { PulseLoader } from '../components/PulseLoader';
import styles from './Iqra.module.css';
import VocabBuilder from './iqra/VocabBuilder';
import { motion } from 'framer-motion';

// Configure PDF Worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;



// --- MOCK DATA FOR SMART CELLS ---
const MOCK_IQRA_PAGE_1: IqraPage = {
    pageNumber: 1,
    cells: [
        { id: 'c1', x: 10, y: 10, width: 20, height: 10, content: { arabic: 'بَ', transliteration: 'Ba', audioUrl: '/audio/iqra/1/ba.mp3' } },
        { id: 'c2', x: 40, y: 10, width: 20, height: 10, content: { arabic: 'تَ', transliteration: 'Ta', audioUrl: '/audio/iqra/1/ta.mp3' } },
        { id: 'c3', x: 70, y: 10, width: 20, height: 10, content: { arabic: 'ثَ', transliteration: 'Tha', audioUrl: '/audio/iqra/1/tha.mp3' } },
        { id: 'c4', x: 10, y: 30, width: 20, height: 10, content: { arabic: 'جَ', transliteration: 'Ja', audioUrl: '/audio/iqra/1/ja.mp3' } },
        { id: 'c5', x: 40, y: 30, width: 20, height: 10, content: { arabic: 'حَ', transliteration: 'Ha', audioUrl: '/audio/iqra/1/ha.mp3' } },
        { id: 'c6', x: 70, y: 30, width: 20, height: 10, content: { arabic: 'خَ', transliteration: 'Kha', audioUrl: '/audio/iqra/1/kha.mp3' } },
    ]
};

const MOCK_IQRA_PAGE_2: IqraPage = {
    pageNumber: 2,
    cells: [
        { id: 'c7', x: 15, y: 20, width: 25, height: 15, content: { arabic: 'دَ', transliteration: 'Da', audioUrl: '/audio/iqra/1/da.mp3' } },
        { id: 'c8', x: 50, y: 20, width: 25, height: 15, content: { arabic: 'ذَ', transliteration: 'Dha', audioUrl: '/audio/iqra/1/dha.mp3' } },
        { id: 'c9', x: 15, y: 50, width: 25, height: 15, content: { arabic: 'رَ', transliteration: 'Ra', audioUrl: '/audio/iqra/1/ra.mp3' } },
        { id: 'c10', x: 50, y: 50, width: 25, height: 15, content: { arabic: 'زَ', transliteration: 'Za', audioUrl: '/audio/iqra/1/za.mp3' } },
    ]
};

const MOCK_IQRA_PAGE_3: IqraPage = {
    pageNumber: 3,
    cells: [
        { id: 'c11', x: 20, y: 30, width: 30, height: 20, content: { arabic: 'سَ', transliteration: 'Sa', audioUrl: '/audio/iqra/1/sa.mp3' } },
        { id: 'c12', x: 55, y: 30, width: 30, height: 20, content: { arabic: 'شَ', transliteration: 'Sha', audioUrl: '/audio/iqra/1/sha.mp3' } },
    ]
};

const MOCK_PAGES: Record<number, IqraPage> = {
    1: MOCK_IQRA_PAGE_1,
    2: MOCK_IQRA_PAGE_2,
    3: MOCK_IQRA_PAGE_3
};

// --- DATA: DIGITAL IQRA CONTENT ---
const IQRA_BOOKS_DATA = [
  { id: 'iqra-1', title: "Iqra' 1", file: '/books/buku-iqra-1 (1).pdf', color: "from-pink-500 to-rose-500", shadow: "shadow-pink-500/20", icon: "1" },
  { id: 'iqra-2', title: "Iqra' 2", file: '/books/buku-iqra-2 (1).pdf', color: "from-orange-500 to-amber-500", shadow: "shadow-orange-500/20", icon: "2" },
  { id: 'iqra-3', title: "Iqra' 3", file: '/books/buku-iqra-3-1 (1).pdf', color: "from-yellow-500 to-lime-500", shadow: "shadow-yellow-500/20", icon: "3" },
  { id: 'iqra-4', title: "Iqra' 4", file: '/books/buku-iqra-4 (1).pdf', color: "from-green-500 to-emerald-500", shadow: "shadow-green-500/20", icon: "4" },
  { id: 'iqra-5', title: "Iqra' 5", file: '/books/buku-iqra-5 (1).pdf', color: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/20", icon: "5" },
  { id: 'iqra-6', title: "Iqra' 6", file: '/books/buku-iqra-6 (1).pdf', color: "from-purple-500 to-indigo-500", shadow: "shadow-purple-500/20", icon: "6" },
];

// --- DATA: TAJWEED TUTORIALS ---
const TAJWEED_TUTORIALS = [
    {
        id: 'qalqalah',
        title: 'The Qalqalah (Echo)',
        description: 'Learn how to bounce the sound of Qaf, Toa, Ba, Jim, Dal.',
        icon: 'fa-wave-square',
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

interface IqraProps {
    user?: UserProfile;
    onUpdateUser?: (user: UserProfile) => void;
}

const Iqra: React.FC<IqraProps> = ({ user, onUpdateUser }) => {
  // Mode State
  const [mode, setMode] = useState<'READ' | 'COACH' | 'VISION_COACH' | 'TUTORIALS' | 'VOCAB' | 'ANALYTICS'>('READ');

  // Book Reader State
  const [currentBookId, setCurrentBookId] = useState('iqra-1');
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [inputPage, setInputPage] = useState('1');

  // Tutorial State
  const [selectedTutorial, setSelectedTutorial] = useState<typeof TAJWEED_TUTORIALS[0] | null>(null);
  const [tutorialVideoUrl, setTutorialVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  // Derived Data
  const currentBook = IQRA_BOOKS_DATA.find(b => b.id === currentBookId) || IQRA_BOOKS_DATA[0];

  useEffect(() => {
      // Keyboard Navigation
      const handleKeyDown = (e: KeyboardEvent) => {
          if (mode !== 'READ') return;
          if (e.key === 'ArrowRight') changePage(1);
          if (e.key === 'ArrowLeft') changePage(-1);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pageNumber, numPages, mode]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setInputPage('1');
  }

  const changePage = (offset: number) => {
    const newPage = Math.min(Math.max(1, pageNumber + offset), numPages || 1);
    setPageNumber(newPage);
    setInputPage(newPage.toString());
  };

  const handlePageSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const p = parseInt(inputPage);
      if (!isNaN(p) && p >= 1 && p <= (numPages || 1)) {
          setPageNumber(p);
      } else {
          setInputPage(pageNumber.toString());
      }
  };

  const handleGenerateLesson = async () => {
      if (!selectedTutorial) return;
      setIsGeneratingVideo(true);
      try {
          const videoUrl = await generateIslamicVideo(selectedTutorial.prompt);
          setTutorialVideoUrl(videoUrl);
      } catch (e) {
          console.error("Video Gen Error:", e);
          alert("Failed to generate video. Try again.");
      } finally {
          setIsGeneratingVideo(false);
      }
  };

  // Smart Mode State
  const [isSmartMode, setIsSmartMode] = useState(false);

    const handleCellClick = (cell: IqraCell) => {
        const audio = new Audio(cell.content.audioUrl);
        audio.play().catch(e => console.log("Audio play failed (mock)", e));
        alert(`Smart Cell: ${cell.content.transliteration} (${cell.content.arabic})`);
    };

    // --- RENDER HELPERS ---
    const renderSmartCells = () => {
        if (!isSmartMode) return null;

        const currentPageData = MOCK_PAGES[pageNumber];
        if (!currentPageData) return null;

        return currentPageData.cells.map(cell => (
            <motion.div
                key={cell.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(56, 189, 248, 0.3)' }}
                className="absolute border-2 border-sky-400/50 rounded-lg cursor-pointer flex items-center justify-center group z-10 left-[var(--cell-left)] top-[var(--cell-top)] w-[var(--cell-width)] h-[var(--cell-height)]"
                style={{
                    '--cell-left': `${cell.x}%`,
                    '--cell-top': `${cell.y}%`,
                    '--cell-width': `${cell.width}%`,
                    '--cell-height': `${cell.height}%`,
                } as React.CSSProperties}
                onClick={() => handleCellClick(cell)}
            >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {cell.content.transliteration}
                </div>
                <i className="fa-solid fa-volume-high text-sky-400 opacity-50 group-hover:opacity-100"></i>
            </motion.div>
        ));
    };

  // Coach Mode State
  const [isRecording, setIsRecording] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
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

  const renderCoach = () => (
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
                          {analysisResult.tajweed_errors.map((err: any, idx: number) => (
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

  const renderReader = () => (
    <div className="h-full flex flex-col animate-fade-in gap-4">
        {/* Enhanced Book Selector */}
        <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar shrink-0 px-1">
            {IQRA_BOOKS_DATA.map(book => (
                <button 
                    key={book.id}
                    onClick={() => setCurrentBookId(book.id)}
                    className={`flex-shrink-0 w-16 h-20 rounded-xl font-bold transition-all relative overflow-hidden group ${
                        currentBookId === book.id 
                        ? `bg-gradient-to-br ${book.color} text-white shadow-lg ${book.shadow} scale-105 ring-2 ring-white/20` 
                        : 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-300'
                    }`}
                >
                    <span className="absolute top-1 left-2 text-[10px] uppercase opacity-70">Vol</span>
                    <span className="text-2xl">{book.icon}</span>
                    {currentBookId === book.id && (
                        <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>
                    )}
                </button>
            ))}
        </div>

        {/* Modern PDF Viewer Container */}
        <div className="flex-1 bg-slate-950/50 rounded-3xl border border-slate-800 overflow-hidden relative flex flex-col items-center justify-center shadow-inner">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="w-full h-full overflow-auto flex justify-center items-start custom-scrollbar p-4 md:p-8 z-10">
                <Document
                    file={currentBook.file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                            <p className="text-slate-400 animate-pulse">Opening Book...</p>
                        </div>
                    }
                    error={
                        <div className="text-red-400 text-center p-8 bg-red-900/10 rounded-2xl border border-red-900/30">
                            <i className="fa-solid fa-triangle-exclamation text-4xl mb-4"></i>
                            <p className="font-bold">Failed to load PDF</p>
                            <p className="text-xs mt-2 text-slate-500">Please check your internet connection.</p>
                        </div>
                    }
                >
                    <div className="shadow-2xl shadow-black/50 rounded-lg overflow-hidden transition-transform duration-200 ease-out relative scale-[var(--zoom-scale)]" style={{ '--zoom-scale': scale } as React.CSSProperties}>
                        <Page 
                            pageNumber={pageNumber} 
                            scale={1.0} // Internal scale fixed, we scale container
                            renderTextLayer={false} 
                            renderAnnotationLayer={false}
                            className="bg-white"
                        />
                        {renderSmartCells()}
                    </div>
                </Document>
            </div>

            {/* Floating Controls Bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl pl-4 pr-2 py-2 rounded-full shadow-2xl border border-slate-700 flex items-center gap-4 z-20 transition-all hover:scale-105">
                {/* Navigation */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => changePage(-1)} 
                        disabled={pageNumber <= 1}
                        className="w-8 h-8 rounded-full bg-slate-800 hover:bg-primary hover:text-black text-white disabled:opacity-30 disabled:hover:bg-slate-800 disabled:hover:text-white transition-all flex items-center justify-center"
                        title="Previous Page (Left Arrow)"
                    >
                        <i className="fa-solid fa-chevron-left text-xs"></i>
                    </button>
                    
                    <form onSubmit={handlePageSubmit} className="flex items-center gap-1 bg-slate-950 rounded-lg px-2 py-1 border border-slate-800 focus-within:border-primary transition-colors">
                        <input 
                            type="text" 
                            value={inputPage}
                            onChange={(e) => setInputPage(e.target.value)}
                            className="w-8 bg-transparent text-center text-sm font-bold text-white outline-none"
                            aria-label="Page Number"
                            title="Page Number"
                        />
                        <span className="text-xs text-slate-500">/ {numPages || '--'}</span>
                    </form>

                    <button 
                        onClick={() => changePage(1)} 
                        disabled={pageNumber >= (numPages || 1)}
                        className="w-8 h-8 rounded-full bg-slate-800 hover:bg-primary hover:text-black text-white disabled:opacity-30 disabled:hover:bg-slate-800 disabled:hover:text-white transition-all flex items-center justify-center"
                        title="Next Page (Right Arrow)"
                    >
                        <i className="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                </div>

                <div className="w-px h-6 bg-slate-700"></div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1">
                    <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="w-8 h-8 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors" title="Zoom Out" aria-label="Zoom Out"><i className="fa-solid fa-minus text-xs"></i></button>
                    <button onClick={() => setScale(1.0)} className="text-xs font-mono text-slate-300 w-10 text-center hover:text-primary cursor-pointer" title="Reset Zoom">{Math.round(scale * 100)}%</button>
                    <button onClick={() => setScale(s => Math.min(2.0, s + 0.1))} className="w-8 h-8 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors" title="Zoom In" aria-label="Zoom In"><i className="fa-solid fa-plus text-xs"></i></button>
                </div>

                <div className="w-px h-6 bg-slate-700"></div>

                {/* Smart Mode Toggle */}
                <button 
                    onClick={() => setIsSmartMode(!isSmartMode)}
                    className={`h-8 px-3 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${isSmartMode ? 'bg-teal-500 text-black shadow-lg shadow-teal-500/20' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    {isSmartMode ? 'Smart ON' : 'Smart OFF'}
                </button>
            </div>
        </div>
    </div>
  );

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



    const renderAnalytics = () => {
        // Mock data + LocalStorage logic
        const [stats, setStats] = useState({
            totalRead: 0,
            avgScore: 0,
            streak: 0,
            history: [65, 70, 75, 72, 80, 85, 82] // Mock weekly history
        });

        useEffect(() => {
            const saved = localStorage.getItem('iqra_progress');
            if (saved) {
                const parsed = JSON.parse(saved);
                setStats(prev => ({ ...prev, ...parsed }));
            }
        }, []);

        return (
            <div className="h-full overflow-y-auto p-6 space-y-8 animate-in fade-in zoom-in duration-500 pb-24">
                <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => setMode('READ')} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white" aria-label="Back" title="Back">
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <h2 className="text-2xl font-bold text-white">Your Progress</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-primary/50 transition-colors">
                        <div className="text-slate-400 text-sm mb-2 uppercase font-bold tracking-wider">Total Pages Read</div>
                        <div className="text-4xl font-bold text-primary">{stats.totalRead}</div>
                        <div className="text-xs text-slate-500 mt-2">Keep going!</div>
                    </div>
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-colors">
                        <div className="text-slate-400 text-sm mb-2 uppercase font-bold tracking-wider">Avg. Tajweed Score</div>
                        <div className="text-4xl font-bold text-emerald-400">{stats.avgScore}%</div>
                        <div className="text-xs text-slate-500 mt-2">Based on AI analysis</div>
                    </div>
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-colors">
                        <div className="text-slate-400 text-sm mb-2 uppercase font-bold tracking-wider">Current Streak</div>
                        <div className="text-4xl font-bold text-amber-400">{stats.streak} Days</div>
                        <div className="text-xs text-slate-500 mt-2">Consistency is key</div>
                    </div>
                </div>

                {/* Simple CSS Bar Chart */}
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <i className="fa-solid fa-chart-simple text-primary"></i> Weekly Activity
                    </h3>
                    <div className="flex items-end justify-between h-48 gap-2">
                        {stats.history.map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-slate-700 rounded-t-lg relative overflow-hidden transition-all hover:bg-primary/20 h-[var(--chart-height)]" style={{ '--chart-height': `${val}%` } as React.CSSProperties}>
                                    <div className="absolute bottom-0 left-0 right-0 bg-primary/50 h-full transition-all group-hover:bg-primary"></div>
                                </div>
                                <span className="text-xs text-slate-500">Day {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };
    const renderVisionCoach = () => (
        <div className="h-full flex flex-col relative bg-black">
            <div className="absolute inset-0 overflow-hidden">
                <img 
                    src="/images/iqra-book-open.jpg" 
                    alt="Camera Feed" 
                    className="w-full h-full object-cover opacity-60"
                    onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x800/1e293b/white?text=Camera+Feed+Simulation';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
                
                {/* AR Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] border-2 border-teal-500/50 rounded-3xl shadow-[0_0_50px_rgba(20,184,166,0.3)] animate-pulse">
                    <div className="absolute top-4 left-4 bg-teal-500 text-black text-xs font-bold px-2 py-1 rounded animate-bounce">
                        <i className="fa-solid fa-expand mr-1"></i> Tracking Page 1
                    </div>
                    
                    {/* AR Smart Cells */}
                    {MOCK_IQRA_PAGE_1.cells.map((cell) => (
                        <div
                            key={cell.id}
                            className="absolute border-2 border-dashed border-teal-400/70 bg-teal-500/10 hover:bg-teal-500/30 cursor-pointer transition-all rounded-lg flex items-center justify-center group left-[var(--cell-left)] top-[var(--cell-top)] w-[var(--cell-width)] h-[var(--cell-height)]"
                            style={{
                                '--cell-left': `${cell.x}%`,
                                '--cell-top': `${cell.y}%`,
                                '--cell-width': `${cell.width}%`,
                                '--cell-height': `${cell.height}%`,
                            } as React.CSSProperties}
                            onClick={() => {
                                const audio = new Audio(cell.content.audioUrl);
                                audio.play().catch(e => console.log("Audio play failed (mock)", e));
                            }}
                        >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-teal-400 text-sm font-bold px-3 py-1 rounded-full border border-teal-500/30 whitespace-nowrap pointer-events-none backdrop-blur-md">
                                <i className="fa-solid fa-volume-high mr-2"></i>
                                {cell.content.transliteration}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AR Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center z-10">
                <p className="text-white text-center mb-6 font-medium text-shadow-lg">
                    Point your camera at <span className="text-teal-400 font-bold">Iqra' Volume 1, Page 1</span>
                </p>
                <div className="flex gap-4">
                    <button className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center text-xl shadow-xl hover:scale-110 transition-transform" title="Capture Image" aria-label="Capture Image">
                        <i className="fa-solid fa-camera"></i>
                    </button>
                    <button 
                        onClick={() => setMode('READ')}
                        className="w-14 h-14 rounded-full bg-slate-800/80 backdrop-blur text-white flex items-center justify-center text-xl border border-slate-600 hover:bg-slate-700 transition-colors"
                        title="Close AR Mode"
                        aria-label="Close AR Mode"
                    >
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    );

  return (
    <div className="h-full flex flex-col p-4 pb-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <i className="fa-solid fa-book-quran text-primary"></i> Digital Iqra
                </h1>
                <p className="text-slate-400 text-xs">Master the Quran, one page at a time.</p>
            </div>
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-[200px] md:max-w-none no-scrollbar">
                <button 
                    onClick={() => setMode('READ')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${mode === 'READ' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white'}`}
                >
                    <i className="fa-solid fa-book-open"></i> Read
                </button>
                <button 
                    onClick={() => setMode('VOCAB')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${mode === 'VOCAB' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white'}`}
                >
                    <i className="fa-solid fa-shapes"></i> Vocab
                </button>
                <button 
                    onClick={() => setMode('TUTORIALS')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${mode === 'TUTORIALS' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white'}`}
                >
                    <i className="fa-solid fa-graduation-cap"></i> Lessons
                </button>
                <button 
                    onClick={() => setMode('COACH')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${mode === 'COACH' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white'}`}
                >
                    <i className="fa-solid fa-microphone"></i> Voice Coach
                </button>
                <button 
                    onClick={() => setMode('VISION_COACH')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${mode === 'VISION_COACH' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white'}`}
                >
                    <i className="fa-solid fa-glasses"></i> AR Mode
                </button>
                <button 
                    onClick={() => setMode('ANALYTICS')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${mode === 'ANALYTICS' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white'}`}
                >
                    <i className="fa-solid fa-chart-pie"></i> Stats
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
            {mode === 'READ' && renderReader()}
            {mode === 'VOCAB' && <VocabBuilder isDark={true} />}
            {mode === 'TUTORIALS' && renderTutorials()}
            {mode === 'ANALYTICS' && renderAnalytics()}
            {mode === 'VISION_COACH' && renderVisionCoach()}
            {mode === 'COACH' && renderCoach()}
        </div>
    </div>
  );
};

export default Iqra;
