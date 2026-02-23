/**
 * 💰 Zakat Calculator
 * Modern financial calculator for spiritual obligations in Raudhah theme
 * 
 * Features:
 * - Raudhah Ivory/Teal interface
 * - Income and Business zakat calculations
 * - Tactile input fields and dynamic result displays
 * - Integration with ZakatService for accurate Malaysian (WLY) calculations
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Calculator, ArrowRight, Info,
  ChevronRight, Wallet, Briefcase, PlusCircle,
  AlertCircle, CheckCircle2, Sparkles
} from 'lucide-react';
import { ZakatService, IncomeData, DeductionsData, BusinessData } from '../../../services/zakatService';

const ZakatCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'INCOME' | 'BUSINESS'>('INCOME');
  const [result, setResult] = useState<{ amount: number, eligible: boolean } | null>(null);

  // Income State
  const [income, setIncome] = useState<IncomeData>({ grossIncome: 0, bonus: 0, otherIncome: 0 });
  const [deductions, setDeductions] = useState<DeductionsData>({
    self: 12000, wife: 5000, children: 0, epf: 0, tabungHaji: 0, parents: 0
  });

  // Business State
  const [business, setBusiness] = useState<BusinessData>({
    currentAssets: 0, currentLiabilities: 0, adjustments: 0
  });

  // Calculate Logic
  useEffect(() => {
    if (activeTab === 'INCOME') {
      const res = ZakatService.calculateIncomeZakat(income, deductions, 'WLY');
      setResult({ amount: res.zakatAmount, eligible: res.isEligible });
    } else {
      const res = ZakatService.calculateBusinessZakat(business, 'WLY');
      setResult({ amount: res.zakatAmount, eligible: res.isEligible });
    }
  }, [income, deductions, business, activeTab]);

  return (
    <div className="w-full max-w-lg mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-24 px-4">

      {/* Header Card (Result Display) */}
      <div className="bg-white/80 backdrop-blur-md border-2 border-raudhah-teal/10 rounded-[2.5rem] p-8 relative overflow-hidden shadow-sm glass-v7">
        <div className="absolute top-0 right-0 w-48 h-48 bg-raudhah-teal/5 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
        <div className="relative z-10 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calculator size={14} className="text-raudhah-teal" />
            <p className="text-[10px] text-raudhah-teal/40 font-black uppercase tracking-[0.3em]">Anggaran Zakat {activeTab === 'INCOME' ? 'Pendapatan' : 'Perniagaan'}</p>
          </div>

          <div className="flex items-baseline justify-center gap-2">
            <span className="text-2xl font-black text-raudhah-teal/30">RM</span>
            <h2 className="text-6xl font-black text-raudhah-ink tracking-tighter">
              {result?.amount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>

          <div className="pt-4">
            <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm ${result?.eligible
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100 flex items-center justify-center gap-2 mx-auto w-fit'
              : 'bg-raudhah-teal/5 text-raudhah-teal/30 border-raudhah-teal/10 flex items-center justify-center gap-2 mx-auto w-fit italic'
              }`}>
              {result?.eligible ? (
                <>
                  <CheckCircle2 size={12} /> WAJIB DIBAYAR
                </>
              ) : (
                <>
                  <AlertCircle size={12} /> BELUM CUKUP NISAB
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-2 bg-white/40 rounded-[2rem] border-2 border-raudhah-teal/5 glass-v7">
        {(['INCOME', 'BUSINESS'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest rounded-[1.5rem] transition-all flex items-center justify-center gap-3 ${activeTab === tab
              ? 'bg-raudhah-teal text-white shadow-lg shadow-raudhah-teal/20 border-b-4 border-raudhah-ink translate-y-[-2px]'
              : 'text-raudhah-teal/40 hover:text-raudhah-ink hover:bg-white/50'
              }`}
          >
            {tab === 'INCOME' ? <Wallet size={16} /> : <Briefcase size={16} />}
            {tab === 'INCOME' ? 'Pendapatan' : 'Bisnes'}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-white/60 backdrop-blur-md border-2 border-raudhah-teal/5 rounded-[2.5rem] p-8 space-y-8 glass-v7 shadow-sm">

        {activeTab === 'INCOME' ? (
          <>
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <PlusCircle size={14} className="text-raudhah-teal" />
                <h3 className="text-[10px] font-black text-raudhah-teal/40 uppercase tracking-[0.2em]">Pendapatan Tahunan</h3>
              </div>
              <div className="grid gap-4">
                <InputGroup label="Gaji Kasar" icon={<Wallet size={14} />} value={income.grossIncome} onChange={v => setIncome({ ...income, grossIncome: v })} />
                <InputGroup label="Bonus / Elaun" icon={<Sparkles size={14} />} value={income.bonus} onChange={v => setIncome({ ...income, bonus: v })} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <Info size={14} className="text-raudhah-gold" />
                <h3 className="text-[10px] font-black text-raudhah-gold/40 uppercase tracking-[0.2em]">Pelepasan (Had Kifayah)</h3>
              </div>
              <div className="grid gap-4">
                <InputGroup label="Diri Sendiri" value={deductions.self} readOnly />
                <InputGroup label="Isteri/Suami" value={deductions.wife} onChange={v => setDeductions({ ...deductions, wife: v })} />
                <InputGroup label="Caruman KWSP" value={deductions.epf} onChange={v => setDeductions({ ...deductions, epf: v })} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <Briefcase size={14} className="text-raudhah-teal" />
                <h3 className="text-[10px] font-black text-raudhah-teal/40 uppercase tracking-[0.2em]">Aset & Liabiliti Bisnes</h3>
              </div>
              <div className="grid gap-4">
                <InputGroup label="Aset Semasa" value={business.currentAssets} onChange={v => setBusiness({ ...business, currentAssets: v })} />
                <InputGroup label="Liabiliti Semasa" value={business.currentLiabilities} onChange={v => setBusiness({ ...business, currentLiabilities: v })} />
                <InputGroup label="Pelarasan Stok" value={business.adjustments || 0} onChange={v => setBusiness({ ...business, adjustments: v })} />
              </div>
            </div>
          </>
        )}

      </div>

      {/* Pay Action */}
      <AnimatePresence>
        {result?.eligible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="pt-4"
          >
            <button
              onClick={() => alert("Membuka Payment Gateway ke Pusat Zakat...")}
              className="w-full py-6 bg-raudhah-teal text-white font-black rounded-3xl shadow-xl shadow-raudhah-teal/20 flex items-center justify-center gap-4 transition-all active:scale-95 border-b-8 border-raudhah-ink active:border-b-0 active:translate-y-2 uppercase tracking-widest text-sm"
            >
              <CreditCard size={20} />
              Tunaikan Zakat
              <ChevronRight size={18} />
            </button>
            <p className="text-[9px] text-raudhah-teal/30 text-center mt-6 font-bold uppercase tracking-widest italic">
              Pembayaran diproses secara telus melalui gerbang rasmi JAKIM / Pusat Zakat.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Helper Input Component
const InputGroup: React.FC<{ label: string, icon?: React.ReactNode, value: number, onChange?: (val: number) => void, readOnly?: boolean }> = ({ label, icon, value, onChange, readOnly }) => (
  <div className={`flex justify-between items-center bg-white p-4 rounded-2xl border-2 transition-all shadow-sm group ${readOnly ? 'border-raudhah-teal/5 bg-raudhah-teal/5' : 'border-raudhah-teal/10 hover:border-raudhah-teal'}`}>
    <div className="flex items-center gap-3">
      <div className={`text-raudhah-teal/30 group-hover:text-raudhah-teal transition-colors ${readOnly ? 'opacity-20' : ''}`}>
        {icon}
      </div>
      <label className={`text-xs font-black uppercase tracking-tight ${readOnly ? 'text-raudhah-teal/30' : 'text-raudhah-ink'}`}>{label}</label>
    </div>
    <div className="flex items-center gap-1">
      <span className="text-[10px] font-black text-raudhah-teal/20 italic">RM</span>
      <input
        type="number"
        value={value}
        readOnly={readOnly}
        onChange={e => onChange && onChange(parseFloat(e.target.value) || 0)}
        className={`bg-transparent text-right text-base font-black text-raudhah-ink outline-none w-28 placeholder-raudhah-teal/10 no-scrollbar ${readOnly ? 'opacity-40' : ''}`}
      />
    </div>
  </div>
);

export default ZakatCalculator;
