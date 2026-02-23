import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  BookOpen, CheckCircle2, Volume2, ArrowRight, X,
  Layers, PlayCircle, Star, Sparkles, ChevronRight,
  Trophy, MessageSquare
} from 'lucide-react';

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

const fetchLessons = async () => {
  const { data, error } = await supabase
    .from('vocab_lessons')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as Lesson[];
};

const VocabBuilder: React.FC = () => {
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

  const { data: lessons, isLoading, error } = useQuery({
    queryKey: ['vocab_lessons'],
    queryFn: fetchLessons
  });

  if (activeLesson) {
    const word = activeLesson.words[currentWordIndex];
    const progress = ((currentWordIndex + 1) / activeLesson.words.length) * 100;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-raudhah-ink/40 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          className="w-full max-w-md bg-raudhah-ivory border border-raudhah-teal/10 rounded-[3.5rem] p-10 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-raudhah-teal via-raudhah-gold to-raudhah-teal" />

          {/* Close Button */}
          <button onClick={closeLesson} className="absolute top-8 right-8 text-raudhah-teal/40 hover:text-raudhah-red p-2 rounded-2xl hover:bg-raudhah-teal/5 transition-all" aria-label="Close Lesson">
            <X size={24} />
          </button>

          {completed ? (
            <div className="text-center py-10 space-y-8 animate-fade-in">
              <div className="w-24 h-24 bg-raudhah-teal/10 rounded-full flex items-center justify-center mx-auto relative">
                <div className="absolute inset-0 bg-raudhah-teal/5 animate-ping rounded-full" />
                <Trophy className="w-12 h-12 text-raudhah-teal" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-raudhah-ink tracking-tight uppercase">Misi Selesai</h2>
                <p className="text-raudhah-teal/60 font-medium italic">Anda telah menguasai {activeLesson.words.length} kosa kata baru hari ini!</p>
              </div>
              <button onClick={closeLesson} className="w-full py-5 bg-raudhah-teal hover:bg-raudhah-ink text-white rounded-2xl font-black transition-all shadow-warm uppercase tracking-widest text-sm active:scale-95">
                Teruskan
              </button>
            </div>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="w-full h-3 bg-raudhah-teal/10 rounded-full mb-12 overflow-hidden border border-raudhah-teal/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-raudhah-teal shadow-glow"
                />
              </div>

              {/* Flashcard */}
              <div className="text-center py-8 cursor-pointer space-y-8 group" onClick={() => setShowTranslation(!showTranslation)}>
                <h3 className="text-7xl font-arabic text-raudhah-ink tracking-normal drop-shadow-sm group-hover:scale-110 transition-transform duration-500">{word.arabic}</h3>

                <div className="h-24 flex flex-col items-center justify-center">
                  <AnimatePresence mode="wait">
                    {showTranslation ? (
                      <motion.div
                        key="translation"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-1"
                      >
                        <p className="text-2xl text-raudhah-teal font-black tracking-tight">{word.transliteration}</p>
                        <p className="text-lg text-raudhah-teal/60 font-medium italic">{word.translation}</p>
                      </motion.div>
                    ) : (
                      <motion.p
                        key="hint"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] text-raudhah-gold font-black uppercase tracking-[0.4em] animate-pulse"
                      >
                        Sentuh untuk Terjemahan
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-12 flex gap-4">
                <button className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] glass-v7 text-raudhah-teal border border-raudhah-teal/10 hover:bg-white transition-all shadow-sm flex items-center justify-center gap-2">
                  <Volume2 size={18} /> Listen
                </button>
                <button
                  onClick={nextWord}
                  disabled={!showTranslation}
                  className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-warm ${showTranslation
                      ? 'bg-raudhah-teal text-white hover:bg-raudhah-ink'
                      : 'bg-raudhah-teal/5 text-raudhah-teal/20 border border-raudhah-teal/5 cursor-not-allowed'
                    }`}
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  if (isLoading) return (
    <div className="text-center p-12 space-y-4">
      <div className="w-12 h-12 border-4 border-raudhah-teal/10 border-t-raudhah-teal rounded-full animate-spin mx-auto" />
      <p className="text-[10px] font-black text-raudhah-teal/40 uppercase tracking-widest">Memuatkan Kosa Kata...</p>
    </div>
  );

  if (error) return <div className="text-center p-12 text-red-500 font-black uppercase tracking-widest text-xs">Gagal memuatkan data kosa kata</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-raudhah-teal rounded-full" />
          <h2 className="text-2xl font-black text-raudhah-ink tracking-tight uppercase">Kosa Kata</h2>
        </div>
        <span className="text-[10px] text-raudhah-gold font-black uppercase tracking-[0.2em] bg-raudhah-gold/5 px-2 py-1 rounded-md border border-raudhah-gold/10">ThinkQuran Edition</span>
      </div>

      <div className="grid gap-6">
        {lessons?.map(lesson => (
          <motion.div
            key={lesson.id}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => startLesson(lesson)}
            className="p-6 rounded-[2.5rem] glass-v7 border border-raudhah-teal/10 cursor-pointer transition-all hover:bg-white hover:shadow-warm group"
          >
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-sm ${lesson.difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-600' :
                  lesson.difficulty === 'intermediate' ? 'bg-raudhah-gold/10 text-raudhah-gold' :
                    'bg-red-500/10 text-red-600'
                }`}>
                <Layers size={28} />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-raudhah-ink text-lg leading-tight group-hover:text-raudhah-teal transition-colors tracking-tight uppercase">{lesson.title}</h3>
                <p className="text-[10px] text-raudhah-teal/40 font-black uppercase tracking-widest mt-1">
                  {lesson.words.length} Patah Perkataan • {lesson.difficulty}
                </p>
              </div>
              <div className="w-12 h-12 bg-raudhah-teal/5 rounded-2xl flex items-center justify-center text-raudhah-teal group-hover:bg-raudhah-teal group-hover:text-white transition-all">
                <PlayCircle size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VocabBuilder;
