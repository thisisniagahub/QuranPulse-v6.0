import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CheckoutModal from './components/CheckoutModal';
import { AnalyticsService } from '../../services/analyticsService';

const InfaqPage: React.FC = () => {
  const navigate = useNavigate();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    AnalyticsService.track('INFAQ_VIEW', { source: 'BarakahHub' });
  }, []);

  const handleInfaqSuccess = () => {
    AnalyticsService.track('INFAQ_SUCCESS', { amount: 50, package: 'student_pack_5' });
    console.log("Infaq Success!");
  };

  const handleInitiate = () => {
    AnalyticsService.track('INFAQ_INITIATE', { amount: 50 });
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="text-2xl font-bold font-kufi text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          Barakah Hub
        </h1>
      </div>

      {/* Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-900/50 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 mb-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <h2 className="text-xl font-bold mb-2">Sponsor a Student</h2>
        <p className="text-slate-300 text-sm mb-4">
          "The best of you are those who learn the Quran and teach it." (Bukhari)
        </p>
        <p className="text-slate-400 text-xs mb-6">
          Help 5 students from B40 families access QuranPulse PRO features. Your contribution creates a lasting Sadaqah Jariyah.
        </p>
        
        <div className="flex items-end gap-2 mb-6">
          <span className="text-3xl font-bold text-emerald-400">RM 50</span>
          <span className="text-slate-500 text-sm mb-1">/ pack</span>
        </div>

        <button 
          onClick={handleInitiate}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-hand-holding-heart"></i>
          Infaq Sekarang
        </button>
      </motion.div>

      {/* Transparency Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 text-center">
          <h3 className="text-2xl font-bold text-white">1,240</h3>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Pelajar Ditaja</p>
        </div>
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 text-center">
          <h3 className="text-2xl font-bold text-emerald-400">RM 62k</h3>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Dana Terkumpul</p>
        </div>
      </div>

      {/* Recent Sponsors */}
      <h3 className="text-lg font-bold mb-4">Penyumbang Terkini</h3>
      <div className="space-y-3">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="flex items-center gap-3 bg-slate-900/30 p-3 rounded-lg border border-white/5">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-500">
              <i className="fa-solid fa-user"></i>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-200">Hamba Allah</p>
              <p className="text-xs text-slate-500">Menaja 1 pek (5 pelajar)</p>
            </div>
            <span className="ml-auto text-xs text-slate-600">2m ago</span>
          </div>
        ))}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
        amount={50}
        onSuccess={handleInfaqSuccess}
      />
    </div>
  );
};

export default InfaqPage;
