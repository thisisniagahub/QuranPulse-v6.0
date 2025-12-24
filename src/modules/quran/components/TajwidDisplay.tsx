import React from 'react';
import { motion } from 'framer-motion';

// Tajwid rule definitions with Bahasa Malaysia
export const TAJWID_RULES = {
  idgham_ghunnah: {
    name: 'Idgham Bila Ghunnah',
    color: '#F472B6', // pink
    description: 'Gabungkan huruf nun mati atau tanwin dengan huruf seterusnya tanpa dengung.',
    letters: ['ل', 'ر'],
  },
  idgham_bighunnah: {
    name: 'Idgham Bi Ghunnah', 
    color: '#A78BFA', // purple
    description: 'Gabungkan huruf nun mati atau tanwin dengan dengung 2 harakat.',
    letters: ['ي', 'ن', 'م', 'و'],
  },
  ikhfa: {
    name: 'Ikhfa',
    color: '#60A5FA', // blue
    description: 'Sembunyikan bunyi nun mati dengan dengung.',
    letters: ['ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ف', 'ق', 'ك'],
  },
  iqlab: {
    name: 'Iqlab',
    color: '#34D399', // green
    description: 'Tukar nun mati kepada mim dengan dengung.',
    letters: ['ب'],
  },
  izhar: {
    name: 'Izhar',
    color: '#FBBF24', // amber
    description: 'Lafazkan nun mati dengan jelas tanpa dengung.',
    letters: ['ء', 'ه', 'ع', 'ح', 'غ', 'خ'],
  },
  qalqalah: {
    name: 'Qalqalah',
    color: '#F87171', // red
    description: 'Bunyi pantulan pada huruf mati.',
    letters: ['ق', 'ط', 'ب', 'ج', 'د'],
  },
  mad_asli: {
    name: 'Mad Asli',
    color: '#38BDF8', // cyan
    description: 'Panjangkan bacaan 2 harakat.',
    markers: ['ٰ', 'ا', 'ى', 'و', 'ي'],
  },
  mad_wajib: {
    name: 'Mad Wajib Muttasil',
    color: '#818CF8', // indigo
    description: 'Panjangkan bacaan 4-5 harakat.',
  },
  ghunnah: {
    name: 'Ghunnah',
    color: '#FB7185', // rose
    description: 'Dengung pada huruf nun atau mim bertasydid.',
    letters: ['نّ', 'مّ'],
  },
};

interface TajwidRuleCardProps {
  ruleKey: string;
  rule: typeof TAJWID_RULES[keyof typeof TAJWID_RULES];
  onLearn?: () => void;
}

export const TajwidRuleCard: React.FC<TajwidRuleCardProps> = ({ ruleKey, rule, onLearn }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50"
  >
    <div className="flex items-center gap-3">
      <div 
        className="w-3 h-3 rounded-full" 
        style={{ backgroundColor: rule.color }}
      />
      <div>
        <p className="text-white font-bold text-sm">{rule.name}</p>
        <p className="text-slate-400 text-xs max-w-[250px]">{rule.description}</p>
      </div>
    </div>
    {onLearn && (
      <button
        onClick={onLearn}
        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
        style={{ 
          color: rule.color, 
          backgroundColor: `${rule.color}20`,
          borderColor: `${rule.color}40`,
          borderWidth: 1
        }}
      >
        Belajar
      </button>
    )}
  </motion.div>
);

interface TajwidDisplayProps {
  detectedRules: string[]; // Array of rule keys
  onLearnRule?: (ruleKey: string) => void;
}

const TajwidDisplay: React.FC<TajwidDisplayProps> = ({ detectedRules, onLearnRule }) => {
  if (detectedRules.length === 0) return null;

  return (
    <div className="mt-4 space-y-3">
      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
        Hukum Tajwid:
      </p>
      <div className="space-y-2">
        {detectedRules.map((ruleKey) => {
          const rule = TAJWID_RULES[ruleKey as keyof typeof TAJWID_RULES];
          if (!rule) return null;
          return (
            <TajwidRuleCard
              key={ruleKey}
              ruleKey={ruleKey}
              rule={rule}
              onLearn={onLearnRule ? () => onLearnRule(ruleKey) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
};

// Utility function to detect tajwid rules in Arabic text
export const detectTajwidRules = (arabicText: string): string[] => {
  const detected: string[] = [];
  
  // Simple detection based on character patterns
  // In production, this would use proper Arabic NLP
  
  if (arabicText.includes('نّ') || arabicText.includes('مّ')) {
    detected.push('ghunnah');
  }
  
  // Check for Mad markers
  if (arabicText.includes('ٰ') || arabicText.includes('آ') || arabicText.includes('ـٓ')) {
    detected.push('mad_asli');
  }
  
  // Check for Qalqalah letters when sukun
  const qalqalahLetters = ['قْ', 'طْ', 'بْ', 'جْ', 'دْ'];
  if (qalqalahLetters.some(letter => arabicText.includes(letter))) {
    detected.push('qalqalah');
  }
  
  // Check for Idgham patterns (simplified)
  if (arabicText.includes('نۢ') || arabicText.includes('نّْ')) {
    detected.push('idgham_bighunnah');
  }
  
  return detected;
};

export default TajwidDisplay;
