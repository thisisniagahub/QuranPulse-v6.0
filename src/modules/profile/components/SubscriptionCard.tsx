import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <span className="bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20">
          Premium Access
        </span>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">Upgrade Keahlian</h3>
      <p className="text-slate-400 text-sm mb-6">Nikmati pengalaman tanpa had & sokong pembangunan aplikasi.</p>

      {/* Plan Switcher */}
      <div className="flex bg-slate-950 p-1 rounded-2xl mb-8 border border-white/5">
        {SUBSCRIPTION_PLANS.map(plan => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(plan)}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${selectedPlan.id === plan.id ? 'bg-primary text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            {plan.name}
          </button>
        ))}
      </div>

      {/* Plan Details */}
      <div className="space-y-4 mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-white">RM {selectedPlan.price.toFixed(2)}</span>
          <span className="text-slate-500 text-sm">/ bulan</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {selectedPlan.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
              <i className="fa-solid fa-check text-emerald-400"></i>
              {f}
            </div>
          ))}
        </div>
      </div>

      {!showGateways ? (
        <button 
          onClick={() => setShowGateways(true)}
          className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all flex items-center justify-center gap-2"
        >
          Langgan Sekarang
          <i className="fa-solid fa-arrow-right text-xs opacity-50"></i>
        </button>
      ) : (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest text-center mb-2">Pilih Kaedah Pembayaran</p>
          
          <button 
            disabled={isProcessing}
            onClick={() => handleSubscribe('tng')}
            className="w-full py-3 bg-[#005cb9] hover:bg-[#004a96] rounded-xl flex items-center justify-center gap-3 transition-all"
          >
            <i className="fa-solid fa-wallet text-white"></i>
            <span className="text-sm font-bold text-white">Touch 'n Go eWallet</span>
          </button>

          <button 
            disabled={isProcessing}
            onClick={() => handleSubscribe('billplz')}
            className="w-full py-3 bg-[#00adef] hover:bg-[#008ecb] rounded-xl flex items-center justify-center gap-3 transition-all"
          >
            <span className="text-sm font-bold text-white">Billplz (Online Banking)</span>
          </button>

          <button 
            disabled={isProcessing}
            onClick={() => handleSubscribe('chip')}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center gap-3 transition-all"
          >
            <span className="text-sm font-bold text-white text-center italic">CHIP-IN</span>
          </button>

          <button 
            onClick={() => setShowGateways(false)}
            className="w-full py-2 text-xs text-slate-500 hover:text-white transition-colors"
          >
            Batal
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-primary font-bold animate-pulse">Menghubungkan ke Gateway...</p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCard;
