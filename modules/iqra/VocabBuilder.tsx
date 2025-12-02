import React, { useState } from 'react';

interface Word {
  arabic: string;
  transliteration: string;
  translation: string;
  audio_url?: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  words: Word[];
}

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/src/lib/supabase';

// ... interfaces ...

const fetchLessons = async () => {
  const { data, error } = await supabase
    .from('vocab_lessons')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data as Lesson[];
};

const VocabBuilder: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [completed, setCompleted] = useState(false);

  const startLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentWordIndex(0);
    setShowTranslation(false);
    setCompleted(false);
  };

  const nextWord = () => {
    if (activeLesson && currentWordIndex < activeLesson.words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setShowTranslation(false);
    } else {
      setCompleted(true);
    }
  };

  const closeLesson = () => {
    setActiveLesson(null);
  };

  if (activeLesson) {
    const word = activeLesson.words[currentWordIndex];
    const progress = ((currentWordIndex + 1) / activeLesson.words.length) * 100;

    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-xl`}>
        <div className={`w-full max-w-md rounded-3xl p-8 relative overflow-hidden ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200'} shadow-2xl`}>
            
            {/* Close Button */}
            <button onClick={closeLesson} className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition-colors" aria-label="Close Lesson">
                <i className="fa-solid fa-times text-xl"></i>
            </button>

            {completed ? (
                <div className="text-center py-10 animate-fade-in">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fa-solid fa-check text-4xl text-green-500"></i>
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Lesson Complete!</h2>
                    <p className="text-slate-500 mb-8">You've mastered {activeLesson.words.length} new words.</p>
                    <button onClick={closeLesson} className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/30">
                        Continue
                    </button>
                </div>
            ) : (
                <>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-700/30 rounded-full mb-8 overflow-hidden">
                        <div className="h-full bg-cyan-500 transition-all duration-300 w-[var(--progress-width)]" 
                        // eslint-disable-next-line
                        style={{ '--progress-width': `${progress}%` } as React.CSSProperties}></div>
                    </div>

                    {/* Flashcard */}
                    <div className="text-center py-6 cursor-pointer" onClick={() => setShowTranslation(!showTranslation)}>
                        <h3 className={`text-5xl font-arabic mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{word.arabic}</h3>
                        
                        <div className={`transition-all duration-300 ${showTranslation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <p className="text-xl text-cyan-400 font-bold mb-2">{word.transliteration}</p>
                            <p className="text-lg text-slate-500">{word.translation}</p>
                        </div>
                        
                        {!showTranslation && (
                            <p className="text-sm text-slate-500 mt-8 animate-pulse">Tap to reveal</p>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="mt-10 flex gap-4">
                        <button className={`flex-1 py-3 rounded-xl font-bold border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            <i className="fa-solid fa-volume-high mr-2"></i> Listen
                        </button>
                        <button 
                            onClick={nextWord}
                            disabled={!showTranslation}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                                showTranslation 
                                ? 'bg-cyan-500 text-white hover:bg-cyan-400 shadow-lg shadow-cyan-500/30' 
                                : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                            }`}
                        >
                            Next <i className="fa-solid fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </>
            )}
        </div>
      </div>
    );
  }

  const { data: lessons, isLoading, error } = useQuery({
    queryKey: ['vocab_lessons'],
    queryFn: fetchLessons
  });

  if (isLoading) return <div className="text-center p-8 text-slate-500">Loading lessons...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Failed to load lessons</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Vocab Builder</h2>
        <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">ThinkQuran Style</span>
      </div>

      <div className="grid gap-4">
        {lessons?.map(lesson => (
            <div 
                key={lesson.id}
                onClick={() => startLesson(lesson)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${
                    isDark 
                    ? 'bg-slate-900/40 border-slate-700 hover:border-cyan-500/50' 
                    : 'bg-white border-slate-200 hover:border-cyan-500/50'
                }`}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                        lesson.difficulty === 'beginner' ? 'bg-green-500/20 text-green-500' :
                        lesson.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-red-500/20 text-red-500'
                    }`}>
                        <i className="fa-solid fa-layer-group"></i>
                    </div>
                    <div>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{lesson.title}</h3>
                        <p className="text-xs text-slate-500">{lesson.words.length} words • {lesson.difficulty}</p>
                    </div>
                    <div className="ml-auto">
                        <i className="fa-solid fa-play-circle text-2xl text-cyan-500 opacity-50 group-hover:opacity-100"></i>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default VocabBuilder;
