import React from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen, BrainCircuit, Clock, BookHeart,
    Compass, Trophy, ArrowRight, Sparkles
} from 'lucide-react';
import { PixelCard } from '../ui/PixelCard';
import { Magnet } from '../ui/Magnet';
import SplitText from '../ui/SplitText';

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
        title: "Iqra' Digital & Adaptive Learning",
        description: "Transformasi data pembelajaran kepada hikmah. Setiap makhraj & tajwid dipantau secara real-time untuk memastikan keberkatan ilmu yang tidak terputus.",
        tag: "EKSKLUSIF",
        color: "#1B6B5A",
        wide: true
    },
    {
        icon: <BrainCircuit className="w-7 h-7" />,
        title: "Ustazah AI (Spiritual Intelligence)",
        description: "Bukan sekadar bot, ia adalah peneman 24/7 untuk bimbingan berautoriti. Patuh Shafi'i & sentiasa sedia untuk tadabbur mendalam.",
        color: "#1B6B5A"
    },
    {
        icon: <Clock className="w-7 h-7" />,
        title: "Pulse Command Center",
        description: "Mission Control rohani anda. Waktu solat tepat, baki masa solat, & peringatan sunah dalam satu dashboard yang harmoni.",
        color: "#C4972A"
    },
    {
        icon: <BookHeart className="w-7 h-7" />,
        title: "Digital Ummah Ecosystem",
        description: "Hubungan tanpa sempadan bersama 10k+ ummah. Sertai 'Ummah Circle' untuk bimbingan rohani yang sahih & berintegriti.",
        color: "#1B6B5A"
    },
    {
        icon: <Trophy className="w-7 h-7" />,
        title: "Genesis Waitlist: Akses Kehidupan",
        description: "Dapatkan status 'Genesis Member' — akses PRO percuma selamanya untuk 1,000 ummah terawal. Tinggalkan impak spiritual yang abadi.",
        tag: "AMAT TERHAD",
        color: "#C4972A",
        wide: true
    }
];

const FeaturesBento: React.FC = () => {
    return (
        <section className="py-24 bg-raudhah-ivory relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-pattern-dots-raudhah"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-raudhah-teal/5 border border-raudhah-teal/10 text-raudhah-teal text-[10px] font-bold tracking-widest uppercase mb-6 font-mono">
                        <Sparkles className="w-3 h-3" />
                        Ekosistem Raudhah
                    </span>
                    <SplitText
                        text="Satu App, Seribu Keberkatan"
                        className="text-4xl md:text-5xl font-raudhah font-bold text-raudhah-ink mb-6 tracking-tight"
                        tag="h2"
                        splitType="words"
                        duration={0.8}
                        staggerChildren={0.06}
                        from={{ opacity: 0, y: 30 }}
                        to={{ opacity: 1, y: 0 }}
                    />
                    <p className="text-raudhah-ink/60 text-lg max-w-2xl leading-relaxed font-normal">
                        Platform integrasi gaya hidup Muslim moden. Semua yang anda perlukan untuk perjalanan rohani — dipermudahkan dengan AI.
                    </p>
                </motion.div>

                {/* Bento Grid with Spring Physics */}
                <div className="grid md:grid-cols-3 gap-6">
                    {FEATURES.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                type: "spring",
                                stiffness: 50,
                                damping: 15,
                                delay: index * 0.1
                            }}
                            className={`${feature.wide ? 'md:col-span-2' : 'md:col-span-1'} h-full`}
                        >
                            <PixelCard
                                className={`relative p-8 rounded-[2.5rem] transition-all duration-700 group overflow-hidden shadow-2xl shadow-raudhah-teal/5 border border-transparent h-full
                                         ${feature.tag === 'AMAT TERHAD' ? 'bg-raudhah-gold/5 border-raudhah-gold/20' : 'glass-v7'}`}
                                pixelColor={feature.color === '#C4972A' ? 'rgba(196, 151, 42, 0.2)' : 'rgba(27, 107, 90, 0.2)'}
                            >
                                {/* Decorative Corner (Premium Feel) */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-raudhah-gold/20 rounded-tl-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-raudhah-gold/20 rounded-br-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                {/* Tag */}
                                {feature.tag && (
                                    <div
                                        className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider dynamic-bg-15 dynamic-text"
                                        style={{ '--dynamic-color': feature.color } as React.CSSProperties}
                                    >
                                        {feature.tag}
                                    </div>
                                )}

                                {/* Icon */}
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-sm dynamic-bg-15 dynamic-text dynamic-border-30 border"
                                    style={{ '--dynamic-color': feature.color } as React.CSSProperties}
                                >
                                    {feature.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-xl md:text-2xl font-bold text-raudhah-ink mb-3 font-raudhah">
                                    {feature.title}
                                </h3>
                                <p className="text-raudhah-ink/60 leading-relaxed text-sm md:text-base font-normal">
                                    {feature.description}
                                </p>

                                {/* Explore link */}
                                <Magnet strength={0.2} className="mt-6">
                                    <div
                                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 dynamic-text cursor-pointer"
                                        style={{ '--dynamic-color': feature.color } as React.CSSProperties}
                                    >
                                        Teroka <ArrowRight className="w-3 h-3" />
                                    </div>
                                </Magnet>
                            </PixelCard>
                        </motion.div>
                    ))}
                </div>
            </div>        </section>
    );
};

export default FeaturesBento;
