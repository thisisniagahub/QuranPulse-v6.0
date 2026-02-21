import React from 'react';
import { motion } from 'framer-motion';
import {
    BrainCircuit,
    History,
    Users,
    CheckCircle2,
    ArrowRight,
    PlayCircle,
    Mic,
    BookOpen,
    Target,
    Zap,
} from 'lucide-react';
import { ProductFrame } from './ProductFrame';
import SplitText from '../ui/SplitText';
import ShinyText from '../ui/ShinyText';

/**
 * FeatureShowcase — "Show Don't Tell" Antigravity-style feature sections.
 * Each feature has: text left/right + actual product UI in ProductFrame.
 */
const FeatureShowcase: React.FC = () => {
    return (
        <section className="py-12 md:py-16 bg-raudhah-ivory relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Section Label */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-raudhah-gold/5 border border-raudhah-gold/10 mb-6">
                        <ShinyText
                            text="TEROKAI KUASA"
                            speed={3}
                            color="rgba(196, 151, 42, 0.4)"
                            shineColor="rgba(196, 151, 42, 0.9)"
                            className="text-[10px] font-bold uppercase tracking-[0.3em] text-raudhah-gold"
                        />
                    </div>
                    <SplitText
                        text="Lihat sendiri. Bukan sekadar janji."
                        className="text-4xl sm:text-5xl lg:text-6xl font-raudhah font-bold text-raudhah-ink tracking-tight leading-tight"
                        tag="h2"
                        splitType="words"
                        duration={0.8}
                        staggerChildren={0.05}
                        from={{ opacity: 0, y: 25, filter: 'blur(4px)' }}
                        to={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    />
                </motion.div>

                {/* ═══════════ Feature 1: Ustaz AI ═══════════ */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-40">
                    {/* Text Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-raudhah-teal/10 flex items-center justify-center">
                                <BrainCircuit className="w-5 h-5 text-raudhah-teal" />
                            </div>
                            <span className="text-raudhah-gold font-bold text-xs tracking-widest uppercase">Kefahaman Mendalam</span>
                        </div>
                        <h3 className="text-4xl lg:text-5xl font-raudhah font-bold text-raudhah-ink mb-6 leading-tight">
                            Ustaz AI <span className="text-raudhah-teal">2.5</span>
                        </h3>
                        <p className="text-raudhah-ink/60 text-lg mb-8 leading-relaxed max-w-lg">
                            Bukan sekadar terjemahan. AI kami menganalisis konteks ayat, asbabun nuzul, dan memberikan tadabbur yang relevan dengan kehidupan anda.
                        </p>
                        <div className="space-y-3">
                            {[
                                "Analisis Kontekstual Shafi'i",
                                "Tadabbur Peribadi 24/7",
                                "Rujukan Kitab Klasik Digital",
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-raudhah-teal flex-shrink-0" />
                                    <span className="text-raudhah-ink/70 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Product Demo Side */}
                    <ProductFrame title="Ustaz AI" badge="AKTIF" glowColor="rgba(20, 184, 166, 0.12)">
                        <div className="p-5 sm:p-6">
                            {/* Chat Header */}
                            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/[0.06]">
                                <div className="w-9 h-9 rounded-full bg-raudhah-teal/20 flex items-center justify-center">
                                    <BrainCircuit className="w-4 h-4 text-raudhah-teal" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">Ustaz AI — Shafi'i Mode</div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-[10px] text-white/40">Online · Gemini 2.5 Flash</span>
                                    </div>
                                </div>
                            </div>

                            {/* Verse Card */}
                            <div className="bg-white/[0.05] rounded-xl p-5 mb-4 border border-white/[0.06]">
                                <p className="text-2xl font-arabic text-white text-center leading-[2.2] mb-2" dir="rtl">
                                    إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ
                                </p>
                                <p className="text-[10px] text-white/30 text-center uppercase tracking-widest">Surah Al-Fatihah : 5</p>
                            </div>

                            {/* AI Response */}
                            <div className="bg-raudhah-teal/20 border border-raudhah-teal/20 p-4 rounded-xl rounded-tl-none mb-3">
                                <p className="text-xs text-white/80 leading-relaxed">
                                    Ayat ini adalah inti kehambaan. "<strong className="text-raudhah-teal">Iyyaka Na'budu</strong>" bermaksud kita hanya menyembah Allah, manakala "<strong className="text-raudhah-teal">Iyyaka Nasta'in</strong>" menekankan bahawa pertolongan hanya dari-Nya.
                                </p>
                                <p className="text-xs text-white/50 mt-2 italic">
                                    💡 Tadabbur: Bagaimana anda boleh praktikkan ini dalam cabaran kerja hari ini?
                                </p>
                            </div>

                            {/* Action Row */}
                            <div className="flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.08] text-white/60 py-2.5 rounded-lg text-[11px] font-medium transition-colors">
                                    <History className="w-3 h-3" /> Tadabbur Lagi
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 bg-raudhah-gold/20 text-raudhah-gold py-2.5 rounded-lg text-[11px] font-bold transition-colors">
                                    <BookOpen className="w-3 h-3" /> Simpan Nota
                                </button>
                            </div>
                        </div>
                    </ProductFrame>
                </div>

                {/* ═══════════ Feature 2: Iqra Digital — Reversed Layout ═══════════ */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-40">
                    {/* Product Demo Side — LEFT */}
                    <ProductFrame title="Iqra Digital" badge="INTERAKTIF" glowColor="rgba(245, 158, 11, 0.12)">
                        <div className="p-5 sm:p-6">
                            {/* Learning Header */}
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <div className="text-xs text-white/40 uppercase tracking-wider font-bold">Iqra' Buku 3</div>
                                    <div className="text-lg font-bold text-white mt-0.5">Halaman 12 · Latihan 5</div>
                                </div>
                                <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg">
                                    <Target className="w-3 h-3" />
                                    <span className="text-[10px] font-bold">85% Tepat</span>
                                </div>
                            </div>

                            {/* Arabic Display */}
                            <div className="bg-white/[0.05] rounded-xl p-6 mb-4 border border-white/[0.06] text-center">
                                <p className="text-4xl font-arabic text-white leading-[2]" dir="rtl">
                                    بَ تَ ثَ
                                </p>
                                <div className="flex justify-center gap-3 mt-3">
                                    {['ba', 'ta', 'tha'].map((label, i) => (
                                        <span key={i} className="text-[10px] text-white/30 bg-white/[0.04] px-3 py-1 rounded-md">{label}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Audio Waveform */}
                            <div className="bg-white/[0.04] rounded-xl p-4 mb-4 border border-white/[0.06]">
                                <div className="flex items-center gap-3">
                                    <button aria-label="Play recitation audio" className="w-10 h-10 rounded-full bg-raudhah-gold flex items-center justify-center flex-shrink-0">
                                        <Mic className="w-4 h-4 text-raudhah-ink" />
                                    </button>
                                    <div className="flex-1 flex items-end gap-[2px] h-8">
                                        {Array.from({ length: 40 }, (_, i) => (
                                            <motion.div
                                                key={i}
                                                className="flex-1 rounded-sm bg-gradient-to-t from-raudhah-gold/60 to-raudhah-gold"
                                                initial={{ height: '20%' }}
                                                animate={{ height: `${20 + Math.random() * 80}%` }}
                                                transition={{ duration: 0.3, repeat: Infinity, repeatType: 'reverse', delay: i * 0.03 }}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-white/40 font-mono">0:03</span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="flex items-center justify-between text-[10px] text-white/30 mb-2">
                                <span>Progress Buku 3</span>
                                <span className="text-raudhah-gold font-bold">12 / 28 halaman</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/[0.06]">
                                <div className="h-full w-[43%] rounded-full bg-gradient-to-r from-raudhah-gold to-orange-400" />
                            </div>
                        </div>
                    </ProductFrame>

                    {/* Text Side — RIGHT */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-raudhah-gold/10 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-raudhah-gold" />
                            </div>
                            <span className="text-raudhah-gold font-bold text-xs tracking-widest uppercase">Belajar Mengaji</span>
                        </div>
                        <h3 className="text-4xl lg:text-5xl font-raudhah font-bold text-raudhah-ink mb-6 leading-tight">
                            Iqra Digital <span className="text-raudhah-gold">1-6</span>
                        </h3>
                        <p className="text-raudhah-ink/60 text-lg mb-8 leading-relaxed max-w-lg">
                            Belajar mengaji dari zero hingga lancar membaca Al-Quran. AI mendengar bacaan dan membetulkan tajwid secara real-time.
                        </p>
                        <div className="space-y-3">
                            {[
                                "AI Tajwid Correction Real-time",
                                "6 Buku Iqra Lengkap Interaktif",
                                "Audio Waveform Analysis",
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-raudhah-gold flex-shrink-0" />
                                    <span className="text-raudhah-ink/70 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ═══════════ Feature 3: Halaqah Komuniti ═══════════ */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Text Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-raudhah-teal/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-raudhah-teal" />
                            </div>
                            <span className="text-raudhah-gold font-bold text-xs tracking-widest uppercase">Ukhuwah Digital</span>
                        </div>
                        <h3 className="text-4xl lg:text-5xl font-raudhah font-bold text-raudhah-ink mb-6 leading-tight">
                            Halaqah <span className="text-raudhah-teal">Komuniti</span>
                        </h3>
                        <p className="text-raudhah-ink/60 text-lg mb-8 leading-relaxed max-w-lg">
                            Sertai majlis ilmu secara maya. Sistem Halaqah Live membolehkan anda semak bacaan bersama dengan bimbingan moderator bertauliah.
                        </p>
                        <button className="flex items-center gap-2 text-raudhah-teal font-bold text-lg group">
                            Cari Halaqah Terdekat <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </motion.div>

                    {/* Product Demo Side */}
                    <ProductFrame title="Halaqah Live" badge="3 AKTIF" glowColor="rgba(20, 184, 166, 0.12)">
                        <div className="p-5 sm:p-6 space-y-3">
                            {[
                                { name: "Tadabbur Juz Amma", users: 45, status: 'live', desc: "Ustaz Ahmad · Shafi'i" },
                                { name: "Tahsin Al-Fatihah", users: 12, status: 'scheduled', time: "10:30 PM", desc: "Ustazah Fatimah" },
                                { name: "Kelas Tajwid Asas", users: 89, status: 'live', desc: "Ustaz Yusuf · Mula dari 0" },
                            ].map((group, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    className="group/item p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] hover:border-raudhah-teal/20 transition-all cursor-pointer"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-white text-sm mb-0.5">{group.name}</p>
                                            <p className="text-[10px] text-white/30">{group.desc}</p>
                                        </div>
                                        {group.status === 'live' ? (
                                            <div className="flex items-center gap-1.5 bg-red-500/20 text-red-400 px-2.5 py-1 rounded-lg">
                                                <PlayCircle className="w-3 h-3" />
                                                <span className="text-[10px] font-bold">LIVE</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-bold text-raudhah-teal bg-raudhah-teal/10 px-2.5 py-1 rounded-lg">{group.time}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className="flex -space-x-1.5">
                                            {[1, 2, 3].map(j => (
                                                <div key={j} className="w-5 h-5 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/10" />
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-white/30 font-medium">{group.users} ahli bersama</span>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Join CTA */}
                            <button className="w-full py-3 rounded-xl bg-raudhah-teal/20 border border-raudhah-teal/20 text-raudhah-teal text-sm font-bold hover:bg-raudhah-teal/30 transition-colors flex items-center justify-center gap-2">
                                <Zap className="w-4 h-4" /> Sertai Halaqah Sekarang
                            </button>
                        </div>
                    </ProductFrame>
                </div>

            </div>
        </section>
    );
};

export default FeatureShowcase;
