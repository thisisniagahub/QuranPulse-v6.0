import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ChevronRight, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { DAM_VIOLATIONS, DAM_TYPES } from '../data/damData';
import { DamViolation } from '../types';

const DamCalculator: React.FC = () => {
  const [selectedViolation, setSelectedViolation] = useState<DamViolation | null>(null);
  const [step, setStep] = useState<'select' | 'result'>('select');

  const handleSelect = (violation: DamViolation) => {
    setSelectedViolation(violation);
    setStep('result');
  };

  const handleBack = () => {
    setSelectedViolation(null);
    setStep('select');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20">
          <Calculator className="text-red-400" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Kalkulator Dam</h3>
          <p className="text-xs text-slate-400">Kira denda pelanggaran ihram</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'select' ? (
          <motion.div
            key="select"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-2"
          >
            {/* Dam Type Legend */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-amber-400 font-semibold text-sm">{DAM_TYPES.TAKHYIR.name}</p>
                <p className="text-xs text-slate-400 mt-1">Boleh pilih salah satu</p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-red-400 font-semibold text-sm">{DAM_TYPES.TARTIB.name}</p>
                <p className="text-xs text-slate-400 mt-1">Ikut urutan wajib</p>
              </div>
            </div>

            {/* Violation List */}
            <p className="text-sm text-slate-400 mb-2">Pilih pelanggaran yang berlaku:</p>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {DAM_VIOLATIONS.map((violation) => (
                <button
                  key={violation.id}
                  onClick={() => handleSelect(violation)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-raudhah-teal/50 hover:bg-slate-800 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      violation.category === 'takhyir'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {violation.category === 'takhyir' ? 'Takhyir' : 'Tartib'}
                    </span>
                    <div className="text-left">
                      <p className="text-white text-sm font-medium">{violation.name}</p>
                      <p className="text-xs text-slate-500">{violation.nameAr}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-500 group-hover:text-raudhah-teal transition-colors" size={18} />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-raudhah-teal hover:text-raudhah-teal transition-colors"
            >
              <ChevronRight className="rotate-180" size={16} />
              Kembali ke senarai
            </button>

            {/* Selected Violation */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-400 mt-1" size={24} />
                <div>
                  <h4 className="text-lg font-semibold text-white">{selectedViolation?.name}</h4>
                  <p className="text-sm text-slate-400 mt-1">{selectedViolation?.description}</p>
                  <p className="text-lg font-arabic text-amber-400 mt-2">{selectedViolation?.nameAr}</p>
                </div>
              </div>
            </div>

            {/* Dam Type */}
            <div className={`p-3 rounded-lg ${
              selectedViolation?.category === 'takhyir'
                ? 'bg-amber-500/10 border border-amber-500/30'
                : 'bg-red-500/10 border border-red-500/30'
            }`}>
              <p className={`font-semibold ${
                selectedViolation?.category === 'takhyir' ? 'text-amber-400' : 'text-red-400'
              }`}>
                {selectedViolation?.category === 'takhyir' ? DAM_TYPES.TAKHYIR.name : DAM_TYPES.TARTIB.name}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {selectedViolation?.category === 'takhyir'
                  ? DAM_TYPES.TAKHYIR.description
                  : DAM_TYPES.TARTIB.description}
              </p>
            </div>

            {/* Penalty Options */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-white">
                {selectedViolation?.category === 'takhyir' 
                  ? '⚖️ Pilih SATU daripada berikut:' 
                  : '📋 Wajib ikut urutan berikut:'}
              </p>
              {selectedViolation?.penalty.map((p, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    selectedViolation.category === 'takhyir'
                      ? 'bg-raudhah-teal/10 text-raudhah-teal'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {selectedViolation.category === 'tartib' ? index + 1 : '○'}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{p.description}</p>
                    <p className="text-xs text-slate-500 font-arabic">{p.descriptionAr}</p>
                  </div>
                  {p.type === 'kambing' && (
                    <span className="text-2xl">🐑</span>
                  )}
                  {p.type === 'puasa' && (
                    <span className="text-2xl">🌙</span>
                  )}
                  {p.type === 'fidyah' && (
                    <span className="text-2xl">🍚</span>
                  )}
                  {p.type === 'mud' && (
                    <span className="text-2xl">🌾</span>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleBack}
                className="flex-1 py-3 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-all"
              >
                Kira Semula
              </button>
              <button
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-raudhah-teal to-blue-500 text-black font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all"
              >
                Tanya Ustaz AI
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disclaimer */}
      <div className="text-xs text-slate-500 text-center p-2 bg-slate-800/30 rounded-lg">
        ⚠️ Rujuk mufti atau ustaz yang berkelayakan untuk kepastian hukum
      </div>
    </div>
  );
};

export default DamCalculator;
