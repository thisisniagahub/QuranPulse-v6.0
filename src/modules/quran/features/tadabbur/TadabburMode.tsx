import React, { useMemo, useState } from 'react';
import { Brain, Save, Sparkles } from 'lucide-react';
import { storage } from '@/lib/storage';

interface ReflectionEntry {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
}

interface TadabburModeProps {
  title?: string;
  contextText?: string;
}

const QUESTIONS = [
  'Apakah mesej utama ayat ini untuk diri saya hari ini?',
  'Perubahan kecil apa yang boleh saya amalkan selepas memahami ayat ini?',
  'Dalam keadaan apa saya perlu paling banyak bergantung kepada Allah?',
];

const STORAGE_KEY = 'quranpulse_tadabbur_journal';

const safeLoadEntries = (): ReflectionEntry[] => {
  return storage.get<ReflectionEntry[]>(STORAGE_KEY) || [];
};

const safeSaveEntries = (entries: ReflectionEntry[]): void => {
  storage.set(STORAGE_KEY, entries);
};

const TadabburMode: React.FC<TadabburModeProps> = ({
  title = 'Tadabbur Mode',
  contextText = 'Luangkan masa untuk merenung, menulis, dan menghubungkan ayat dengan amalan harian.',
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [entries, setEntries] = useState<ReflectionEntry[]>(safeLoadEntries);

  const question = QUESTIONS[questionIndex];
  const recentEntries = useMemo(() => entries.slice(0, 6), [entries]);

  const saveCurrentReflection = () => {
    const trimmed = answer.trim();
    if (!trimmed) return;

    const entry: ReflectionEntry = {
      id: `${Date.now()}`,
      question,
      answer: trimmed,
      createdAt: new Date().toISOString(),
    };

    const updated = [entry, ...entries];
    setEntries(updated);
    safeSaveEntries(updated);
    setAnswer('');
    setQuestionIndex((prev) => (prev + 1) % QUESTIONS.length);
  };

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-5 text-white">
        <div className="mb-3 flex items-center gap-2 text-emerald-300">
          <Brain className="h-5 w-5" />
          <p className="text-sm font-bold uppercase tracking-wider">{title}</p>
        </div>
        <p className="text-sm text-slate-300">{contextText}</p>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-raudhah-teal">Soalan Renungan</p>
        <p className="mb-4 text-lg font-semibold text-white">{question}</p>
        <textarea
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Tulis renungan anda di sini..."
          className="mb-4 h-36 w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-sm text-white outline-none transition-colors focus:border-raudhah-teal"
        />
        <button
          type="button"
          onClick={saveCurrentReflection}
          className="inline-flex items-center gap-2 rounded-xl bg-raudhah-teal px-4 py-2.5 text-sm font-bold text-black transition-colors hover:bg-raudhah-teal"
        >
          <Save className="h-4 w-4" />
          Simpan Renungan
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-5">
        <div className="mb-3 flex items-center gap-2 text-amber-300">
          <Sparkles className="h-4 w-4" />
          <p className="text-sm font-bold uppercase tracking-wider">Jurnal Terkini</p>
        </div>
        {recentEntries.length === 0 ? (
          <p className="text-sm text-slate-400">Belum ada catatan. Mulakan renungan pertama anda.</p>
        ) : (
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <div key={entry.id} className="rounded-xl border border-slate-700 bg-slate-800/70 p-3">
                <p className="text-xs font-bold text-raudhah-teal">{entry.question}</p>
                <p className="mt-1 text-sm text-slate-200">{entry.answer}</p>
                <p className="mt-2 text-[11px] text-slate-500">
                  {new Date(entry.createdAt).toLocaleString('ms-MY')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TadabburMode;
