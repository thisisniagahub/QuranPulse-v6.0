import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    XCircle,
    ShieldCheck,
    Layers,
    LayoutGrid,
    Search,
    BrainCircuit,
    Zap,
    Sparkles,
    Trash2,
    CheckCircle2
} from 'lucide-react';
import { ProductFrame } from './ProductFrame';
import SplitText from '../ui/SplitText';
import ShinyText from '../ui/ShinyText';

const PainTransformation: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    const TRANSFORMATIONS = [
        {
            title: "Iklan Mengganggu Khushuk",
            problem: "Tengah bermunajat, tiba-tiba keluar iklan yang tidak sepatutnya. Hilang mood & barakah.",
            solution: "100% Ad-Free Sanctuary. Tiada gangguan, tiada komersialisme. Fokus anda hanya pada Pencipta.",
            icon: <XCircle className="w-6 h-6 text-red-500" />,
            solutionIcon: <ShieldCheck className="w-6 h-6 text-raudhah-teal" />,
            visual: "ads"
        },
        {
            title: "Lambakan App Berasingan",
            problem: "Satu app untuk Solat, satu untuk Quran. Phone serabut dan memori penuh.",
            solution: "Unified Islamic Core. Integrasi penuh Dashboard Ibadah dalam satu ekosistem elegan.",
            icon: <Layers className="w-6 h-6 text-orange-500" />,
            solutionIcon: <LayoutGrid className="w-6 h-6 text-raudhah-gold" />,
            visual: "clutter"
        },
        {
            title: "Tiada Bimbingan Sahih",
            problem: "Google sering memberi jawapan umum. Sukar mencari rujukan pantas & berautoriti.",
            solution: "Authored Intelligence. Rujukan Shafi'i yang verified & pantas 24/7 di hujung jari.",
            icon: <Search className="w-6 h-6 text-slate-500" />,
            solutionIcon: <BrainCircuit className="w-6 h-6 text-raudhah-teal" />,
            visual: "authority"
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header with Scroll Trigger */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-raudhah-gold/5 border border-raudhah-gold/10 mb-8">
                            <ShinyText
                                text="PENYELESAIAN BERAUTORITI"
                                speed={3}
                                color="rgba(196, 151, 42, 0.4)"
                                shineColor="rgba(196, 151, 42, 0.9)"
                                className="text-[10px] font-bold uppercase tracking-[0.3em] text-raudhah-gold"
                            />
                        </div>
                        <SplitText
                            text="Bukan Sekadar Aplikasi Biasa"
                            className="text-4xl md:text-5xl lg:text-6xl font-raudhah font-bold text-raudhah-ink tracking-tight"
                            tag="h2"
                            splitType="words"
                            duration={0.8}
                            staggerChildren={0.05}
                            from={{ opacity: 0, y: 25 }}
                            to={{ opacity: 1, y: 0 }}
                        />
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">

                    {/* Sticky Sidebar Selectors */}
                    <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-32 transition-all duration-700">
                        {TRANSFORMATIONS.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(i)}
                                className={`w-full text-left p-6 rounded-[2rem] transition-all duration-500 relative overflow-hidden group border
                                    ${activeTab === i
                                        ? 'bg-raudhah-teal text-white border-transparent shadow-2xl shadow-raudhah-teal/20 scale-[1.02]'
                                        : 'bg-raudhah-ivory text-raudhah-ink border-raudhah-teal/5 hover:bg-white hover:shadow-xl'}`}
                            >
                                <div className="flex items-center gap-4 mb-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                                        ${activeTab === i ? 'bg-white/10' : 'bg-raudhah-teal/5'}`}>
                                        {activeTab === i ? item.solutionIcon : item.icon}
                                    </div>
                                    <p className={`text-sm font-bold uppercase tracking-wider ${activeTab === i ? 'text-raudhah-gold' : 'text-raudhah-ink/40'}`}>
                                        Masalah #{i + 1}
                                    </p>
                                </div>
                                <h3 className="text-xl font-bold mb-2 font-raudhah">{item.title}</h3>
                                <p className={`text-sm leading-relaxed ${activeTab === i ? 'text-white/70' : 'text-raudhah-ink/50'}`}>
                                    {activeTab === i ? item.solution : item.problem}
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* Visual Stage - wrapped in ProductFrame */}
                    <div className="lg:col-span-7">
                        <ProductFrame
                            title={TRANSFORMATIONS[activeTab].title}
                            badge="SOLUSI"
                            glowColor={activeTab === 0 ? 'rgba(239, 68, 68, 0.1)' : activeTab === 1 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(20, 184, 166, 0.1)'}
                        >
                            <div className="h-[520px] p-8 relative overflow-hidden flex items-center justify-center">

                                <AnimatePresence mode="wait">
                                    {activeTab === 0 && (
                                        <motion.div
                                            key="ads"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ type: "spring", damping: 15 }}
                                            className="w-full h-full flex flex-col items-center justify-center"
                                        >
                                            <div className="relative w-64 h-[420px] bg-white/[0.05] rounded-[2rem] border border-white/[0.08] overflow-hidden p-4">
                                                {/* Mushaf View */}
                                                <div className="h-full w-full bg-white/[0.03] rounded-xl flex flex-col p-6 items-center justify-center opacity-40">
                                                    <div className="w-full h-2 bg-white/10 rounded-full mb-2"></div>
                                                    <div className="w-3/4 h-2 bg-white/10 rounded-full mb-2"></div>
                                                    <div className="w-full h-2 bg-white/10 rounded-full mb-8"></div>
                                                </div>

                                                {/* THE ADS - VISUAL TRASH */}
                                                <motion.div
                                                    animate={{
                                                        opacity: [1, 0, 1],
                                                        y: [0, -10, 0]
                                                    }}
                                                    transition={{ duration: 4, repeat: Infinity }}
                                                    className="absolute top-16 left-3 right-3 bg-red-500/90 p-3 rounded-xl shadow-lg text-white z-20"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-[10px] font-bold">SPONSORED AD</p>
                                                        <XCircle className="w-3 h-3 opacity-50" />
                                                    </div>
                                                    <p className="text-xs font-black">GAME JUDI ONLINE?!</p>
                                                </motion.div>

                                                <div className="absolute top-48 left-3 right-3 bg-blue-500/80 p-3 rounded-xl shadow-lg text-white z-20 transform rotate-2">
                                                    <p className="text-xs font-black">FAST LOAN NO CREDIT?!</p>
                                                </div>

                                                {/* THE PURIFICATION BEAM */}
                                                <motion.div
                                                    initial={{ y: "100%" }}
                                                    animate={{ y: "-100%" }}
                                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                    className="absolute inset-x-0 h-24 bg-gradient-to-t from-transparent via-raudhah-teal/30 to-transparent z-30"
                                                ></motion.div>

                                                {/* Shield overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center z-40">
                                                    <motion.div
                                                        animate={{
                                                            scale: [1, 1.1, 1],
                                                            opacity: [0.5, 1, 0.5]
                                                        }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="bg-raudhah-teal text-white px-5 py-2.5 rounded-full font-bold shadow-2xl flex items-center gap-2 text-sm"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        PURIFIED
                                                    </motion.div>
                                                </div>
                                            </div>
                                            <p className="mt-6 text-white/30 font-bold uppercase tracking-widest text-xs">Ads Purification Engine</p>
                                        </motion.div>
                                    )}

                                    {activeTab === 1 && (
                                        <motion.div
                                            key="clutter"
                                            initial={{ opacity: 0, y: 40 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -40 }}
                                            className="w-full h-full flex flex-col items-center justify-center relative"
                                        >
                                            <div className="w-full max-w-sm relative aspect-square">
                                                {/* Scattered app icons */}
                                                {[
                                                    { label: "Solat", color: "bg-blue-500/20 text-blue-400", pos: "top-0 left-0" },
                                                    { label: "Quran", color: "bg-emerald-500/20 text-emerald-400", pos: "top-0 right-0" },
                                                    { label: "Qibla", color: "bg-red-500/20 text-red-400", pos: "bottom-0 left-0" },
                                                    { label: "Hijri", color: "bg-orange-500/20 text-orange-400", pos: "bottom-0 right-0" },
                                                    { label: "Chat", color: "bg-purple-500/20 text-purple-400", pos: "top-1/4 left-1/4" }
                                                ].map((app, i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{
                                                            x: [0, (Math.random() - 0.5) * 10, 0],
                                                            y: [0, (Math.random() - 0.5) * 10, 0]
                                                        }}
                                                        transition={{ duration: i + 2, repeat: Infinity }}
                                                        className={`absolute ${app.pos} w-16 h-16 ${app.color} bg-white/[0.05] rounded-2xl border border-white/[0.08] flex items-center justify-center flex-col z-10`}
                                                    >
                                                        <span className="text-[10px] font-bold">{app.label}</span>
                                                        <div className="w-8 h-1 bg-white/10 mt-1 rounded-full"></div>
                                                    </motion.div>
                                                ))}

                                                {/* THE CORE SINGULARITY */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <motion.div
                                                        animate={{
                                                            boxShadow: ["0 0 0px rgba(20,184,166,0)", "0 0 60px rgba(20,184,166,0.4)", "0 0 0px rgba(20,184,166,0)"]
                                                        }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="w-32 h-32 bg-raudhah-teal/20 rounded-[2rem] border border-raudhah-teal/30 flex items-center justify-center relative z-20"
                                                    >
                                                        <img src="/logo-primary.png" className="w-20 h-20 brightness-0 invert opacity-80" alt="Raudhah" />
                                                        <div className="absolute inset-0 border-2 border-raudhah-gold/20 rounded-[2rem] animate-ping opacity-20"></div>
                                                    </motion.div>
                                                </div>
                                            </div>
                                            <div className="mt-6 text-center">
                                                <p className="text-white font-bold font-raudhah">"All-in-One Convergence"</p>
                                                <p className="text-white/30 text-xs uppercase tracking-widest mt-1">Menyatukan Seluruh Keperluan</p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 2 && (
                                        <motion.div
                                            key="authority"
                                            initial={{ opacity: 0, x: 60 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -60 }}
                                            className="w-full h-full flex flex-col items-center justify-center"
                                        >
                                            <div className="w-full max-w-lg space-y-4">
                                                {/* SEARCH NOISE */}
                                                <div className="relative">
                                                    <div className="text-[10px] text-white/20 font-bold mb-2">GOOGLE SEARCH (GENERAL)</div>
                                                    <div className="space-y-2 opacity-20">
                                                        <div className="h-3 bg-white/10 rounded-lg w-full"></div>
                                                        <div className="h-3 bg-white/10 rounded-lg w-5/6"></div>
                                                    </div>
                                                </div>

                                                {/* THE FILTRATION GATE */}
                                                <motion.div
                                                    animate={{
                                                        borderColor: ["rgba(196,151,42,0.2)", "rgba(196,151,42,0.6)", "rgba(196,151,42,0.2)"]
                                                    }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                    className="py-8 px-6 border-2 border-dashed border-raudhah-gold/30 rounded-2xl relative"
                                                >
                                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-raudhah-gold text-white px-3 py-0.5 rounded-full text-[10px] font-bold">FATWA GUARD</div>

                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="flex gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-raudhah-teal/10 flex items-center justify-center animate-bounce">
                                                                <Search className="w-4 h-4 text-raudhah-teal" />
                                                            </div>
                                                            <div className="w-10 h-10 rounded-full bg-raudhah-gold/10 flex items-center justify-center animate-bounce" style={{ animationDelay: '0.3s' }}>
                                                                <Sparkles className="w-4 h-4 text-raudhah-gold" />
                                                            </div>
                                                        </div>

                                                        <div className="w-full bg-white/[0.05] p-5 rounded-xl border-l-4 border-raudhah-teal">
                                                            <p className="text-[10px] text-raudhah-teal font-bold uppercase mb-2">Jawapan Berautoriti (Shafi'i)</p>
                                                            <p className="text-sm italic font-medium text-white/70">
                                                                "Bagi kemusykilan anda, menurut pandangan muktamad dalam Mazhab Shafi'i..."
                                                            </p>
                                                            <div className="mt-3 flex items-center gap-2">
                                                                <div className="w-4 h-4 bg-raudhah-teal rounded-full flex items-center justify-center">
                                                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                                                </div>
                                                                <span className="text-[8px] font-bold text-white/30 tracking-widest uppercase">SYARIAH COMPLIANCE VERIFIED</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                {/* FINAL RESULT */}
                                                <div className="flex justify-center pt-2">
                                                    <div className="flex items-center gap-2 text-raudhah-gold font-bold text-sm">
                                                        <Zap className="w-4 h-4 fill-raudhah-gold" />
                                                        RESPON PANTAS & SAHIH
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </div>
                        </ProductFrame>

                        {/* Ambient Glows */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-raudhah-teal/5 rounded-full blur-[100px] -z-10"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-raudhah-gold/5 rounded-full blur-[100px] -z-10"></div>
                    </div>
                </div>

                {/* Final Hook */}
                <div className="mt-20 text-center">
                    <p className="text-raudhah-ink/60 text-lg max-w-3xl mx-auto leading-relaxed">
                        Kami tidak hanya membina aplikasi. Kami membina <span className="text-raudhah-teal font-bold italic">Rumah Digital</span> yang suci, bersepadu, dan berautoriti untuk perjalanan rohani anda.
                    </p>
                </div>

            </div>
        </section>
    );
};

export default PainTransformation;
