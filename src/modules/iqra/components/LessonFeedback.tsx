import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, MessageSquare, Send } from 'lucide-react';

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
    // Simulate API call
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
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-labelledby="feedback-title"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md relative shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-raudhah-teal"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                  <h3 id="feedback-title" className="text-xl font-bold text-white mb-2">
                    Bagaimana sesi bacaan ini?
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Maklum balas anda membantu kami menambah baik {lessonTitle}.
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-raudhah-teal rounded-full ${
                        rating >= star ? 'text-amber-400' : 'text-slate-600'
                      }`}
                      aria-label={`Beri ${star} bintang`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label htmlFor="comment" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Cadangan (Pilihan)
                  </label>
                  <textarea
                    id="comment"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Adakah arahan jelas? Suara jelas?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-raudhah-teal focus:ring-1 focus:ring-raudhah-teal transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={rating === 0}
                  className="w-full py-3 bg-cyan-600 hover:bg-raudhah-teal disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-raudhah-teal focus:ring-offset-black"
                >
                  <Send className="w-4 h-4" />
                  Hantar Maklum Balas
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Terima Kasih!</h3>
                <p className="text-slate-400">Maklum balas anda telah direkodkan.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LessonFeedback;
