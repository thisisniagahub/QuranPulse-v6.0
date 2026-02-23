import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface LessonFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
}

const LessonFeedback: React.FC<LessonFeedbackProps> = ({ isOpen, onClose, lessonTitle }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ lessonTitle, rating, comment });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setRating(0);
      setComment('');
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-raudhah-ink/40 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-labelledby="feedback-title"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="bg-raudhah-ivory border border-raudhah-teal/10 rounded-[3rem] p-10 w-full max-w-md relative shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-raudhah-teal via-raudhah-gold to-raudhah-teal rounded-t-[3rem]" />

            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-raudhah-teal/40 hover:text-raudhah-teal p-2 rounded-2xl hover:bg-raudhah-teal/5 transition-all focus:outline-none focus:ring-2 focus:ring-raudhah-teal"
              aria-label="Tutup"
            >
              <X className="w-6 h-6" />
            </button>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-black text-raudhah-gold uppercase tracking-[0.3em]">Penambahbaikan</span>
                  <h3 id="feedback-title" className="text-3xl font-black text-raudhah-ink tracking-tight uppercase">
                    Bagaimana Sesi Ini?
                  </h3>
                  <p className="text-raudhah-teal/60 font-medium text-sm leading-relaxed px-4">
                    Maklum balas anda membantu kami menambah baik pengalaman <span className="text-raudhah-ink font-bold">{lessonTitle}</span>.
                  </p>
                </div>

                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1.5 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-raudhah-teal rounded-full group ${rating >= star ? 'text-raudhah-gold' : 'text-raudhah-teal/10'
                        }`}
                      aria-label={`Beri ${star} bintang`}
                    >
                      <Star className={`w-10 h-10 ${rating >= star ? 'fill-current' : ''} group-hover:scale-110 transition-transform`} />
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <label htmlFor="comment" className="text-[10px] font-black text-raudhah-teal/60 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Cadangan Peribadi
                  </label>
                  <textarea
                    id="comment"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Contoh: Suara ustaz terlalu laju..."
                    className="w-full bg-raudhah-teal/5 border border-raudhah-teal/10 rounded-2xl p-4 text-raudhah-ink text-sm font-medium focus:outline-none focus:border-raudhah-teal focus:ring-2 focus:ring-raudhah-teal/20 transition-all placeholder:text-raudhah-teal/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={rating === 0}
                  className="w-full py-5 bg-raudhah-teal hover:bg-raudhah-ink disabled:opacity-30 disabled:cursor-not-allowed text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-warm uppercase tracking-widest text-sm"
                >
                  <Send className="w-5 h-5" />
                  Hantar Maklum Balas
                </button>
              </form>
            ) : (
              <div className="text-center py-10 space-y-6">
                <div className="w-24 h-24 bg-raudhah-teal/10 rounded-full flex items-center justify-center mx-auto relative">
                  <div className="absolute inset-0 bg-raudhah-teal/5 animate-ping rounded-full" />
                  <CheckCircle2 className="w-12 h-12 text-raudhah-teal relative z-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-raudhah-ink uppercase tracking-tight">Terima Kasih!</h3>
                  <p className="text-raudhah-teal/60 font-medium italic">Insya-Allah, kami akan meneliti setiap cadangan anda.</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LessonFeedback;
