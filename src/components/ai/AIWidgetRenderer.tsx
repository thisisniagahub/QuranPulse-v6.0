import React from 'react';
import { motion } from 'framer-motion';
import ZakatCalculator from '../../modules/ibadah/components/ZakatCalculator';
import { useNavigate } from 'react-router-dom';

interface AIWidgetRendererProps {
  content: string;
}

export const AIWidgetRenderer: React.FC<AIWidgetRendererProps> = ({ content }) => {
  const navigate = useNavigate();

  // 1. Detect Widget
  const widgetMatch = content.match(/<<<WIDGET:(.*?)>>>/);
  
  // If no widget, just return text (rendered by parent usually, but this component might be used for the widget part only)
  // Actually, let's assume this component is used *alongside* the text renderer.
  if (!widgetMatch) return null;

  const jsonString = widgetMatch[1];
  let widgetData: { id: string, props?: any } | null = null;
  
  try {
      widgetData = JSON.parse(jsonString);
  } catch (e) {
      console.error("Failed to parse AI Widget:", e);
      return null;
  }

  if (!widgetData) return null;

  // 2. Render Widget
  switch (widgetData.id) {
      case 'ZAKAT_CALC':
          return (
              <div className="my-4 p-4 bg-slate-900/50 rounded-2xl border border-indigo-500/30">
                  <p className="text-xs text-indigo-400 font-bold mb-2 uppercase">AI Tool: Kalkulator Zakat</p>
                  <ZakatCalculator />
              </div>
          );
      
      case 'INFAQ_CARD':
          return (
              <div className="my-4 p-4 bg-gradient-to-r from-emerald-900/50 to-slate-900 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
                  <div>
                      <p className="text-sm font-bold text-white">Sumbangan Infaq</p>
                      <p className="text-xs text-slate-400">Sasaran: Asnaf & Masjid</p>
                  </div>
                  <button 
                    onClick={() => navigate('/barakah')}
                    className="px-4 py-2 bg-emerald-500 text-black text-xs font-bold rounded-lg hover:scale-105 transition-transform"
                  >
                      Derma RM {widgetData.props?.amount || 10}
                  </button>
              </div>
          );

      case 'PRAYER_TIMES':
          return (
              <button 
                onClick={() => navigate('/ibadah')}
                className="w-full my-2 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl font-bold text-sm hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                  <i className="fa-solid fa-clock"></i>
                  Lihat Waktu Solat Penuh
              </button>
          );

      case 'IQRA_LESSON':
          return (
              <button 
                onClick={() => navigate('/iqra')}
                className="w-full my-2 py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl font-bold text-sm hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                  <i className="fa-solid fa-book-quran"></i>
                  Mula Kelas Iqra Digital
              </button>
          );

      default:
          return null;
  }
};

// Helper to strip widget code from text for display
export const cleanAIResponse = (text: string) => {
    return text.replace(/<<<WIDGET:.*?>>>/g, '').trim();
};
