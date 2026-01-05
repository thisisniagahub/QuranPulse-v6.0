import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaymentService, SUBSCRIPTION_PLANS, PaymentGateway } from '../../../services/paymentService';

interface SubscriptionCardProps {
  userId: string;
  onSuccess: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ userId, onSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState(SUBSCRIPTION_PLANS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGateways, setShowGateways] = useState(false);

  const handleSubscribe = async (gateway: PaymentGateway) => {
    setIsProcessing(true);
    try {
      const intent = await PaymentService.createSubscription(selectedPlan.id, gateway, userId);
      // Redirect to mock payment URL
      window.open(intent.paymentUrl, '_blank');
      
      // Simulate polling for success
      setTimeout(() => {
        onSuccess();
        setIsProcessing(false);
        setShowGateways(false);
      }, 3000);
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#0c224b]/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">    
      {/* Background Decorative Orbs */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px]"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]"></div>

      <div className="absolute top-6 right-6">
        <div className="bg-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          Genesis Tier
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight flex items-center gap-3">
            <span className="w-2 h-8 bg-cyan-500 rounded-full animate-pulse"></span>
            Upgrade Keahlian
        </h3>
        <p className="text-slate-400 text-sm mb-8 font-medium">Buka potensi penuh rohani digital anda.</p>

        {/* Plan Switcher (Cyber Capsule) */}
        <div className="flex bg-black/40 p-1.5 rounded-2xl mb-8 border border-white/5 relative">
            <motion.div 
                className="absolute top-1.5 bottom-1.5 bg-cyan-600 rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.4)] z-0"
                initial={false}
                animate={{
                    left: selectedPlan.id === 'plan_pro' ? '6px' : '50%',
                    right: selectedPlan.id === 'plan_pro' ? '50%' : '6px',
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            {SUBSCRIPTION_PLANS.map(plan => (
                <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest relative z-10 transition-colors ${selectedPlan.id === plan.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    {plan.name.replace('QuranPulse ', '')}
                </button>
            ))}
        </div>

        {/* Plan Details (HUD Style) */}
        <div className="bg-white/5 rounded-3xl p-6 border border-white/5 mb-8 backdrop-blur-sm relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">RM {selectedPlan.price.toFixed(2)}</span>
                <span className="text-slate-500 text-xs font-bold uppercase">/ bulan</span>
            </div>

            <div className="space-y-4 relative z-10">
                {selectedPlan.features.map((f, i) => (
                    <motion.div 
                        key={i + selectedPlan.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 text-xs text-slate-300"
                    >
                        <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                            <i className="fa-solid fa-check text-[10px] text-cyan-400"></i>
                        </div>
                        <span className="font-medium">{f}</span>
                    </motion.div>
                ))}
            </div>
        </div>

        {!showGateways ? (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowGateways(true)}
                className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-[0.2em] text-sm rounded-2xl shadow-xl shadow-cyan-600/20 border border-cyan-400 transition-all flex items-center justify-center gap-3"
            >
                AKTIFKAN SEKARANG
                <ChevronRight size={18} />
            </motion.button>
        ) : (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest text-center mb-4">Pilih Gerbang Pembayaran</p>

                <div className="grid grid-cols-1 gap-3">
                    <button
                        disabled={isProcessing}
                        onClick={() => handleSubscribe('tng')}
                        className="w-full py-4 bg-white/5 hover:bg-[#005cb9]/20 border border-white/10 hover:border-[#005cb9]/50 rounded-2xl flex items-center justify-between px-6 transition-all group"
                    >
                        <span className="text-sm font-bold text-slate-300 group-hover:text-white">Touch 'n Go eWallet</span>
                        <i className="fa-solid fa-wallet text-[#005cb9]"></i>
                    </button>

                    <button
                        disabled={isProcessing}
                        onClick={() => handleSubscribe('billplz')}
                        className="w-full py-4 bg-white/5 hover:bg-[#00adef]/20 border border-white/10 hover:border-[#00adef]/50 rounded-2xl flex items-center justify-between px-6 transition-all group"
                    >
                        <span className="text-sm font-bold text-slate-300 group-hover:text-white">FPX Online Banking</span>
                        <i className="fa-solid fa-university text-[#00adef]"></i>
                    </button>

                    <button
                        disabled={isProcessing}
                        onClick={() => handleSubscribe('stripe')}
                        className="w-full py-4 bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/50 rounded-2xl flex items-center justify-between px-6 transition-all group"
                    >
                        <span className="text-sm font-bold text-slate-300 group-hover:text-white">Kad Kredit/Debit</span>
                        <i className="fa-brands fa-stripe text-purple-400 text-2xl"></i>
                    </button>
                </div>

                <button
                    onClick={() => setShowGateways(false)}
                    className="w-full py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors mt-2"
                >
                    BATALKAN
                </button>
            </div>
        )}
      </div>

      {isProcessing && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-50 p-8 text-center">
          <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
              <div className="absolute inset-4 bg-cyan-500/10 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-shield-halved text-cyan-400 text-xl animate-pulse"></i>
              </div>
          </div>
          <h4 className="text-white font-black uppercase tracking-[0.3em] mb-2">Mengamankan Sambungan</h4>
          <p className="text-slate-500 text-xs leading-relaxed">Sila tunggu seketika sementara kami menghubungkan anda ke gerbang pembayaran yang selamat.</p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCard;
