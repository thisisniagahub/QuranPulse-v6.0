import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaymentService, PaymentIntent } from '../../../services/paymentService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: () => void;
  userEmail?: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, amount, onSuccess, userEmail = "guest@example.com" }) => {
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'FAILED'>('IDLE');
  
  const handlePayment = async () => {
    setStatus('PROCESSING');
    try {
      // 1. Create Intent
      const intent = await PaymentService.createInfaqIntent(amount, userEmail);
      
      // 2. Simulate User Paying (Delay)
      await new Promise(r => setTimeout(r, 2000));
      
      // 3. Record Success (Simulated Webhook)
      await PaymentService.recordTransaction({ ...intent, status: 'SUCCESS' }, 'current-user-id');
      
      setStatus('SUCCESS');
      setTimeout(() => {
        onSuccess();
        onClose();
        setStatus('IDLE');
      }, 2000);

    } catch (e) {
      setStatus('FAILED');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
      >
        {status === 'SUCCESS' ? (
          <div className="p-8 text-center bg-emerald-900/20">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <i className="fa-solid fa-check text-2xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2" id="modal-title">Alhamdulillah!</h3>
            <p className="text-slate-300 text-sm">Sumbangan anda telah diterima.</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-white/10 bg-slate-800/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white" id="modal-title">Ringkasan Infaq</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Jumlah</p>
                  <p className="text-3xl font-bold text-emerald-400">RM {amount}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Sponsor</p>
                  <p className="text-sm text-white">5 Pelajar</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500 text-center mb-2">Pilih kaedah pembayaran selamat:</p>
              
              <button 
                onClick={handlePayment}
                disabled={status === 'PROCESSING'}
                className="w-full py-3 rounded-xl border border-slate-600 bg-slate-800/50 hover:bg-slate-700 flex items-center justify-center gap-3 transition-all"
              >
                <img src="https://toyyibpay.com/assets/img/logo.png" alt="FPX" className="h-6 opacity-80 bg-white rounded px-1" />
                <span className="text-sm font-bold text-white">FPX / Online Banking</span>
              </button>

              <button 
                onClick={handlePayment}
                disabled={status === 'PROCESSING'}
                className="w-full py-3 rounded-xl border border-slate-600 bg-slate-800/50 hover:bg-slate-700 flex items-center justify-center gap-3 transition-all"
              >
                <i className="fa-brands fa-cc-visa text-xl text-white"></i>
                <span className="text-sm font-bold text-white">Kad Debit/Kredit</span>
              </button>

              {status === 'PROCESSING' && (
                <div className="text-center pt-2">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-xs text-emerald-400 animate-pulse">Memproses transaksi...</p>
                </div>
              )}
              
              {status === 'FAILED' && (
                <p className="text-xs text-red-400 text-center">Transaksi gagal. Sila cuba lagi.</p>
              )}
            </div>

            <div className="p-4 bg-slate-950 text-center">
              <p className="text-[10px] text-slate-600">
                <i className="fa-solid fa-lock mr-1"></i> 
                Pembayaran dilindungi enkripsi SSL 256-bit
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default CheckoutModal;
