import React from 'react';
import { DAILY_QUOTE } from '../../constants';

interface DailyQuoteProps {
  isDark: boolean;
}

const DailyQuote: React.FC<DailyQuoteProps> = ({ isDark }) => {
  const handleShareQuote = async () => {
    const text = `"${DAILY_QUOTE.translation}"\n\n${DAILY_QUOTE.arabic}\n\n- ${DAILY_QUOTE.ref}\n\nShared via Quran Pulse`;
    if (navigator.share) {
      try { 
        await navigator.share({ title: 'Daily Inspiration', text: text }); 
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Quote copied!');
    }
  };

  return (
    <div className="relative p-[1px] rounded-3xl bg-gradient-to-r from-teal-500/30 via-purple-500/30 to-amber-500/30 shadow-lg">
      <div className={`rounded-[23px] p-6 relative overflow-hidden text-center ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-purple-500 to-amber-500 opacity-50"></div>
        <i className="fa-solid fa-quote-left text-3xl opacity-5 absolute top-6 left-6"></i>
        
        <div className={`font-arabic text-2xl mb-4 leading-loose drop-shadow-md ${isDark ? 'text-slate-100' : 'text-slate-800'}`} dir="rtl">
          {DAILY_QUOTE.arabic}
        </div>
        <p className="text-slate-500 italic text-sm mb-3 font-light">"{DAILY_QUOTE.translation}"</p>
        <div className="inline-block px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-teal-400 uppercase tracking-widest">
          {DAILY_QUOTE.ref}
        </div>
        
        <button 
          onClick={handleShareQuote}
          className="mt-6 text-slate-500 hover:text-teal-500 transition-colors text-xs flex items-center justify-center gap-2 w-full"
        >
          <i className="fa-solid fa-share-nodes"></i> Share with friends
        </button>
      </div>
    </div>
  );
};

export default DailyQuote;