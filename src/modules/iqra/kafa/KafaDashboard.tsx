import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ChevronRight, PenTool, Languages, Users, Scroll, BookHeart, HeartHandshake } from 'lucide-react';
import { KAFA_SUBJECTS, KafaSubject } from './data/kafa-subjects';

// Icon Mapper helper
const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'PenTool': return <PenTool className="w-5 h-5 text-white" />;
    case 'Languages': return <Languages className="w-5 h-5 text-white" />;
    case 'Users': return <Users className="w-5 h-5 text-white" />;
    case 'Scroll': return <Scroll className="w-5 h-5 text-white" />;
    case 'BookHeart': return <BookHeart className="w-5 h-5 text-white" />;
    case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-white" />;
    default: return <Lock className="w-5 h-5 text-white" />;
  }
};

interface KafaDashboardProps {
  onSelectSubject: (subjectId: string) => void;
}

const KafaDashboard: React.FC<KafaDashboardProps> = ({ onSelectSubject }) => {
  return (
    <div className="px-6 pb-24">
      <h2 className="text-white font-bold mb-4 flex items-center gap-2">
        <span className="text-cyan-400">🏫</span>
        Pilih Subjek KAFA
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {KAFA_SUBJECTS.map((subject, index) => (
          <motion.button
            key={subject.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => !subject.locked && onSelectSubject(subject.id)}
            className={`relative overflow-hidden rounded-2xl p-6 text-left group transition-all ${subject.locked ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-[1.02] cursor-pointer'}`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
            <div className="absolute inset-0 border border-white/5 rounded-2xl group-hover:border-white/20 transition-colors" />

            <div className="relative z-10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-bold text-white">{subject.title}</h3>
                </div>
                <p className="text-cyan-400 font-arabic text-lg mb-1">{subject.arabicTitle}</p>
                <p className="text-slate-400 text-sm line-clamp-2">{subject.description}</p>
              </div>
              
              {subject.locked ? (
                <Lock className="w-5 h-5 text-slate-500" />
              ) : (
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform`}>
                  {getIcon(subject.icon)}
                </div>
              )}
            </div>

            {/* Progress Bar (Mock for now) */}
            {!subject.locked && (
              <div className="mt-6">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Progres</span>
                  <span>0%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-0" />
                </div>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default KafaDashboard;
