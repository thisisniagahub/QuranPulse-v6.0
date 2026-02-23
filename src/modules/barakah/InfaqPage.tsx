import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CheckoutModal from './components/CheckoutModal';
import { AnalyticsService } from '../../services/analyticsService';

const InfaqPage: React.FC = () => {
  const navigate = useNavigate();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(30);

  useEffect(() => {
    AnalyticsService.track('INFAQ_VIEW', { source: 'BarakahHub' });
  }, []);

  const handleInfaqSuccess = () => {
    AnalyticsService.track('INFAQ_SUCCESS', { amount: selectedAmount, package: selectedAmount === 30 ? 'wakaf_digital_basic' : 'jumaat_food_pack' });
    // Success tracked via AnalyticsService above
  };

  const handleInitiate = (amount: number) => {
    AnalyticsService.track('INFAQ_INITIATE', { amount });
    setSelectedAmount(amount);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="text-2xl font-bold font-kufi text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
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
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded border border-emerald-500/30">
            WAKAF DIGITAL
          </span>
        </div>
        <h2 className="text-xl font-bold mb-2 text-white">Saham Akhirat Anda</h2>
        <p className="text-slate-300 text-sm mb-4 italic">
          "Apabila mati anak Adam, terputuslah amalannya kecuali tiga perkara: sedekah jariah..." (Muslim)
        </p>
        <p className="text-slate-400 text-xs mb-6 leading-relaxed">
          Wakafkan akses premium <strong>Ustaz AI</strong> & <strong>Iqra Digital</strong> kepada <span className="text-white font-bold">5 pelajar asnaf</span> setiap bulan. Biar teknologi menjadi asbab pahala berpanjangan.
        </p>

        <div className="flex items-end gap-2 mb-6">
          <span className="text-3xl font-bold text-emerald-400">RM 30</span>
          <span className="text-slate-500 text-sm mb-1">/ bulan</span>
        </div>

        <button
          onClick={() => handleInitiate(30)}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-hand-holding-heart"></i>
          Mula Berwakaf
        </button>
      </motion.div>

      {/* --- SEDEQAH JUMAAT SPECIAL --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 mb-8 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-amber-500 text-black text-[10px] font-black rounded uppercase tracking-wider">Jumaat Special</span>
            <span className="text-amber-400 text-xs font-bold flex items-center gap-1"><i className="fa-solid fa-clock"></i> Tutup: 11:59 PM</span>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Pek Makanan Asnaf</h3>
          <p className="text-sm text-slate-300 mb-4">
            "Sebaik-baik sedekah adalah sedekah pada hari Jumaat."
          </p>

          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div className="bg-black/30 p-2 rounded-lg border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase">Target</p>
              <p className="text-lg font-bold text-amber-400">500</p>
              <p className="text-[8px] text-slate-500">Pek</p>
            </div>
            <div className="bg-black/30 p-2 rounded-lg border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase">Lokasi</p>
              <p className="text-lg font-bold text-white">Gombak</p>
              <p className="text-[8px] text-slate-500">& PPR Desa</p>
            </div>
            <div className="bg-black/30 p-2 rounded-lg border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase">Impak</p>
              <p className="text-lg font-bold text-emerald-400">500+</p>
              <p className="text-[8px] text-slate-500">Keluarga</p>
            </div>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full mb-4 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full w-[65%]"></div>
          </div>
          <p className="text-xs text-right text-amber-400 mb-4 font-mono">325 / 500 Terkumpul</p>

          <button
            onClick={() => handleInitiate(20)}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-bowl-food"></i>
            Infaq RM 20 / Pek
          </button>
        </div>
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
        amount={selectedAmount}
        onSuccess={handleInfaqSuccess}
      />
    </div>
  );
};

export default InfaqPage;
