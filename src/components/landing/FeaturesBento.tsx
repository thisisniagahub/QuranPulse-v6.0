import React from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen, BrainCircuit, Clock, BookHeart,
    Compass, Trophy, ArrowRight, Sparkles
} from 'lucide-react';

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
    tag?: string;
    color: string;
    wide?: boolean;
}

const FEATURES: Feature[] = [
    {
        icon: <BookOpen className="w-8 h-8" />,
        title: "Iqra Digital 1-6",
        description: "Iqra 1-6 lengkap dengan audio guru. Setiap huruf, setiap baris — pembelajaran sistematik.",
        tag: "EKSKLUSIF",
        color: "#22D3EE",
        wide: true
    },
    {
        icon: <BrainCircuit className="w-7 h-7" />,
        title: "AI Ustaz 24/7",
        description: "Tanya apa sahaja, dapat jawapan dengan dalil. Patuh mazhab Syafi'i.",
        color: "#10B981"
    },
    {
        icon: <Clock className="w-7 h-7" />,
        title: "Waktu Solat JAKIM",
        description: "Tepat mengikut zon, notifikasi automatik sebelum azan.",
        color: "#6366F1"
    },
    {
        icon: <BookHeart className="w-7 h-7" />,
        title: "Koleksi Doa & Zikir",
        description: "500+ doa harian dengan audio dan terjemahan.",
        color: "#EC4899"
    },
    {
        icon: <Compass className="w-7 h-7" />,
        title: "Kompas Kiblat",
        description: "Cari arah kiblat di mana sahaja dengan AR.",
        color: "#F59E0B"
    },
    {
        icon: <Trophy className="w-7 h-7" />,
        title: "Gamifikasi",
        description: "XP, Badges, Streaks — motivasi konsisten setiap hari.",
        tag: "POPULAR",
        color: "#8B5CF6",
        wide: true
    }
];

const FeaturesBento: React.FC = () => {
    return (
        <section id="features" className="py-24 bg-transparent relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-cyan-200/20 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/20 text-[#22d3ee] text-xs font-bold tracking-widest uppercase mb-6">
                        <Sparkles className="w-3 h-3" />
                        Ekosistem Lengkap
                    </span>
                    <h2 className="text-4xl md:text-5xl font-[Poppins] font-bold text-slate-800 mb-6 tracking-tight">
                        Satu App, <span className="text-cyan-600">Pelbagai Dimensi</span>
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl leading-relaxed font-medium">
                        Platform integrasi untuk gaya hidup Muslim moden. Semua yang anda perlukan untuk perjalanan rohani — dalam genggaman.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {FEATURES.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, borderColor: `${feature.color}50` }}
                            className={`relative p-8 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/80 
                         hover:bg-white/80 transition-all duration-300 group overflow-hidden shadow-sm hover:shadow-md
                         ${feature.wide ? 'md:col-span-2' : 'md:col-span-1'}`}
                        >
                            {/* Glow effect on hover */}
                            <div
                                className="absolute top-0 right-0 w-48 h-48 blur-[80px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none dynamic-bg"
                                style={{ '--dynamic-color': feature.color } as React.CSSProperties}
                            ></div>

                            {/* Tag */}
                            {feature.tag && (
                                <div
                                    className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider dynamic-bg-20 dynamic-text"
                                    style={{ '--dynamic-color': feature.color } as React.CSSProperties}
                                >
                                    {feature.tag}
                                </div>
                            )}

                            {/* Icon */}
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-transform group-hover:scale-110 dynamic-bg-15 dynamic-border-30 dynamic-text"
                                style={{ '--dynamic-color': feature.color } as React.CSSProperties}
                            >
                                {feature.icon}
                            </div>

                            {/* Content */}
                            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-3 font-[Poppins]">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-sm md:text-base font-medium">
                                {feature.description}
                            </p>

                            {/* Explore link */}
                            <div
                                className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 dynamic-text"
                                style={{ '--dynamic-color': feature.color } as React.CSSProperties}
                            >
                                Explore <ArrowRight className="w-3 h-3" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesBento;
