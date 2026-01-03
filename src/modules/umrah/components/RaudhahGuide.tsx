import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Church, Clock, Smartphone, ExternalLink, ChevronDown, ChevronUp, Star, Users } from 'lucide-react';

interface NusukStep {
    step: number;
    title: string;
    description: string;
    image?: string;
}

const NUSUK_TUTORIAL: NusukStep[] = [
    {
        step: 1,
        title: 'Muat Turun Aplikasi Nusuk',
        description: 'Muat turun aplikasi "Nusuk" dari App Store atau Google Play. Pastikan anda muat turun aplikasi rasmi dari kerajaan Arab Saudi.',
    },
    {
        step: 2,
        title: 'Daftar Akaun',
        description: 'Daftar menggunakan nombor telefon atau e-mel anda. Anda akan menerima kod pengesahan melalui SMS.',
    },
    {
        step: 3,
        title: 'Lengkapkan Profil',
        description: 'Masukkan maklumat pasport, nombor visa, dan butiran peribadi anda. Pastikan semua maklumat tepat.',
    },
    {
        step: 4,
        title: 'Pilih "Raudhah"',
        description: 'Di halaman utama, pilih "Raudhah" atau "Rawdah Sharif" untuk memohon slot lawatan.',
    },
    {
        step: 5,
        title: 'Pilih Tarikh & Masa',
        description: 'Pilih tarikh dan slot masa yang dikehendaki. Slot untuk wanita dan lelaki berbeza.',
    },
    {
        step: 6,
        title: 'Simpan QR Code',
        description: 'Setelah berjaya, anda akan menerima QR Code. SIMPAN screenshot ini - ia diperlukan untuk masuk ke Raudhah.',
    },
];

const RAUDHAH_TIPS = [
    { icon: '⏰', title: 'Masa Terbaik Mohon', description: 'Slot biasanya dibuka jam 10:00 pagi waktu Saudi (3:00 petang waktu Malaysia)' },
    { icon: '📱', title: 'Internet Stabil', description: 'Pastikan internet stabil. Slot cepat habis dalam beberapa minit.' },
    { icon: '👥', title: 'Slot Lelaki & Wanita', description: 'Slot lelaki: Selepas Subuh hingga Zohor. Slot wanita: Selepas Isyak.' },
    { icon: '🎫', title: 'QR Code Wajib', description: 'Tanpa QR Code dari Nusuk, anda TIDAK dibenarkan masuk ke Raudhah.' },
    { icon: '📅', title: 'Mohon Lebih Awal', description: 'Cuba mohon 2-3 hari lebih awal. Jangan tunggu saat akhir.' },
];

const RaudhahGuide: React.FC = () => {
    const [expandedStep, setExpandedStep] = useState<number | null>(null);
    const [showTutorial, setShowTutorial] = useState(true);

    const toggleStep = (step: number) => {
        setExpandedStep(prev => prev === step ? null : step);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                    <Church className="text-green-400" size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">Panduan Raudhah</h3>
                    <p className="text-xs text-slate-400">Taman Syurga di Masjid Nabawi</p>
                </div>
            </div>

            {/* Raudhah Info Card */}
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-xl">
                <div className="flex items-start gap-3">
                    <span className="text-3xl">🕌</span>
                    <div>
                        <h4 className="text-green-400 font-semibold">Raudhah (الروضة)</h4>
                        <p className="text-sm text-slate-300 mt-1">
                            Kawasan antara mimbar dan rumah Nabi ﷺ. Rasulullah ﷺ bersabda:
                            <span className="text-amber-400 font-arabic block mt-1">
                                "ما بين بيتي ومنبري روضة من رياض الجنة"
                            </span>
                        </p>
                        <p className="text-xs text-slate-400 mt-1">"Antara rumahku dan mimbarku adalah taman dari taman-taman syurga."</p>
                    </div>
                </div>
            </div>

            {/* Quick Tips */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-white flex items-center gap-2">
                    <Star className="text-amber-400" size={16} />
                    Tips Penting
                </p>
                <div className="grid gap-2">
                    {RAUDHAH_TIPS.map((tip, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                        >
                            <span className="text-xl">{tip.icon}</span>
                            <div>
                                <p className="text-sm font-medium text-white">{tip.title}</p>
                                <p className="text-xs text-slate-400">{tip.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Nusuk Tutorial Toggle */}
            <button
                onClick={() => setShowTutorial(!showTutorial)}
                className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all"
            >
                <div className="flex items-center gap-2">
                    <Smartphone className="text-cyan-400" size={18} />
                    <span className="text-white font-medium">Tutorial Aplikasi Nusuk</span>
                </div>
                {showTutorial ? <ChevronUp className="text-slate-400" size={18} /> : <ChevronDown className="text-slate-400" size={18} />}
            </button>

            {/* Nusuk Tutorial Steps */}
            <AnimatePresence>
                {showTutorial && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                    >
                        {NUSUK_TUTORIAL.map((step) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: step.step * 0.05 }}
                                className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleStep(step.step)}
                                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-800/80 transition-all"
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${expandedStep === step.step
                                            ? 'bg-cyan-500 text-black'
                                            : 'bg-slate-700 text-slate-400'
                                        }`}>
                                        {step.step}
                                    </div>
                                    <span className={`flex-1 ${expandedStep === step.step ? 'text-cyan-400' : 'text-white'}`}>
                                        {step.title}
                                    </span>
                                    {expandedStep === step.step ? (
                                        <ChevronUp className="text-slate-400" size={16} />
                                    ) : (
                                        <ChevronDown className="text-slate-400" size={16} />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {expandedStep === step.step && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="px-4 pb-4"
                                        >
                                            <div className="pl-11">
                                                <p className="text-sm text-slate-300">{step.description}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Download Nusuk Button */}
            <a
                href="https://apps.apple.com/app/nusuk/id1559103463"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all"
            >
                <ExternalLink size={18} />
                Muat Turun Aplikasi Nusuk
            </a>

            {/* Slot Timing Prediction */}
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                    <Clock className="text-cyan-400" size={18} />
                    <p className="text-white font-medium">Anggaran Slot Dibuka</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-500/10 rounded-lg text-center">
                        <p className="text-2xl">👨</p>
                        <p className="text-sm font-medium text-blue-400">Lelaki</p>
                        <p className="text-xs text-slate-400">Selepas Subuh - Zohor</p>
                        <p className="text-xs text-slate-500">(5:00AM - 12:00PM Saudi)</p>
                    </div>
                    <div className="p-3 bg-pink-500/10 rounded-lg text-center">
                        <p className="text-2xl">👩</p>
                        <p className="text-sm font-medium text-pink-400">Wanita</p>
                        <p className="text-xs text-slate-400">Selepas Isyak</p>
                        <p className="text-xs text-slate-500">(8:00PM - 2:00AM Saudi)</p>
                    </div>
                </div>
            </div>

            {/* Important Warning */}
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-xs text-red-400">
                    ⚠️ <strong>Amaran:</strong> Tanpa QR Code dari Nusuk, anda tidak akan dibenarkan masuk ke kawasan Raudhah. Mohon slot lebih awal!
                </p>
            </div>
        </div>
    );
};

export default RaudhahGuide;
