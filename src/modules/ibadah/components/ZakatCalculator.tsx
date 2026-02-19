import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-24">

      {/* Header Card */}
      <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="relative z-10 text-center">
          <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mb-1">Zakat {activeTab === 'INCOME' ? 'Pendapatan' : 'Perniagaan'}</p>
          <h2 className="text-4xl font-black text-white mb-1">
            <span className="text-sm align-top opacity-50 mr-1">RM</span>
            {result?.amount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <p className={`text-xs font-bold px-3 py-1 rounded-full inline-block mt-2 ${result?.eligible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
            {result?.eligible ? 'WAJIB DIBAYAR' : 'BELUM CUKUP NISAB'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-900/80 rounded-xl border border-slate-800">
        {(['INCOME', 'BUSINESS'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            {tab === 'INCOME' ? 'Pendapatan' : 'Perniagaan'}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 space-y-4">

        {activeTab === 'INCOME' ? (
          <>
            <h3 className="text-sm font-bold text-white mb-2 border-b border-white/10 pb-2">Pendapatan Tahunan</h3>
            <div className="space-y-3">
              <InputGroup label="Gaji Kasar (Setahun)" value={income.grossIncome} onChange={v => setIncome({ ...income, grossIncome: v })} />
              <InputGroup label="Bonus / Elaun" value={income.bonus} onChange={v => setIncome({ ...income, bonus: v })} />
            </div>

            <h3 className="text-sm font-bold text-white mt-6 mb-2 border-b border-white/10 pb-2">Tolakan (Had Kifayah)</h3>
            <div className="space-y-3">
              <InputGroup label="Diri Sendiri" value={deductions.self} readOnly />
              <InputGroup label="Isteri (RM5k/org)" value={deductions.wife} onChange={v => setDeductions({ ...deductions, wife: v })} />
              <InputGroup label="KWSP (EPF)" value={deductions.epf} onChange={v => setDeductions({ ...deductions, epf: v })} />
            </div>
          </>
        ) : (
          <>
            <h3 className="text-sm font-bold text-white mb-2 border-b border-white/10 pb-2">Kewangan Bisnes</h3>
            <div className="space-y-3">
              <InputGroup label="Aset Semasa (Tunai/Stok)" value={business.currentAssets} onChange={v => setBusiness({ ...business, currentAssets: v })} />
              <InputGroup label="Liabiliti Semasa (Hutang)" value={business.currentLiabilities} onChange={v => setBusiness({ ...business, currentLiabilities: v })} />
              <InputGroup label="Pelarasan (Stok Lupus)" value={business.adjustments || 0} onChange={v => setBusiness({ ...business, adjustments: v })} />
            </div>
          </>
        )}

      </div>

      {/* Pay Action */}
      {result?.eligible && (
        <button
          onClick={() => alert("Membuka Payment Gateway ke Pusat Zakat...")}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 transition-all"
        >
          <i className="fa-solid fa-credit-card"></i>
          Bayar Zakat Sekarang
        </button>
      )}

    </div>
  );
};

// Helper Input Component
const InputGroup: React.FC<{ label: string, value: number, onChange?: (val: number) => void, readOnly?: boolean }> = ({ label, value, onChange, readOnly }) => (
  <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5 focus-within:border-indigo-500/50 transition-colors">
    <label className="text-xs text-slate-400">{label}</label>
    <div className="flex items-center gap-1">
      <span className="text-xs text-slate-500">RM</span>
      <input
        type="number"
        value={value}
        readOnly={readOnly}
        onChange={e => onChange && onChange(parseFloat(e.target.value) || 0)}
        className="bg-transparent text-right text-sm font-mono text-white outline-none w-24 placeholder-slate-600"
      />
    </div>
  </div>
);

export default ZakatCalculator;
