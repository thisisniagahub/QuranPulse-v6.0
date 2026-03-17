import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Star, Zap } from 'lucide-react';
import { AppStoreButton, GooglePlayButton } from '@/components/DownloadButtons';
import { Magnet } from '../ui/Magnet';

interface FinalCtaProps {
    onGetStarted?: () => void;
}

const TRUST_ITEMS = [
    { icon: Shield, label: 'Patuh JAKIM' },
    { icon: Star, label: 'Jaminan Tiada Iklan' },
    { icon: Zap, label: 'Made in Malaysia 🇲🇾' },
] as const;

const FinalCta: React.FC<FinalCtaProps> = ({ onGetStarted }) => {
    return (
        <section className="relative overflow-hidden bg-raudhah-ink py-24 md:py-32">
            {/* === Background layers === */}
            {/* Radial teal glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-raudhah-teal/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-raudhah-gold/10 rounded-full blur-[100px]" />
            </div>

            {/* Subtle dot grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{ backgroundImage: 'radial-gradient(circle, #FAFAF5 1px, transparent 1px)', backgroundSize: '32px 32px' }}
            />

            {/* Top border glow line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-raudhah-teal/50 to-transparent" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-raudhah-teal/15 border border-raudhah-teal/30 text-raudhah-teal text-[10px] font-bold tracking-[0.3em] uppercase mb-10 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-raudhah-gold animate-pulse" />
                        Tersedia Sekarang
                    </div>

                    {/* Headline */}
                    <h2 className="text-5xl md:text-7xl font-raudhah font-bold text-white mb-6 tracking-tight leading-[1.1]">
                        Mula Perjalanan<br />
                        <span className="bg-gradient-to-r from-raudhah-teal via-emerald-400 to-raudhah-gold bg-clip-text text-transparent">
                            Quran Anda Hari Ini
                        </span>
                    </h2>

                    <p className="text-lg text-white/50 mb-14 max-w-xl mx-auto leading-relaxed">
                        Percuma untuk bermula. Sertai 1,000 ummah pertama untuk akses PRO selamanya.
                    </p>

                    {/* App Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                        <Magnet strength={0.25}>
                            <AppStoreButton variant="glass" />
                        </Magnet>
                        <Magnet strength={0.25}>
                            <GooglePlayButton variant="teal" />
                        </Magnet>
                    </div>

                    {/* Web fallback */}
                    <button
                        onClick={onGetStarted}
                        className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors group mt-2"
                    >
                        Atau akses terus di pelayar web
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Divider */}
                    <div className="mt-16 pt-10 border-t border-white/[0.06]">
                        <div className="flex flex-wrap items-center justify-center gap-10">
                            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-2.5 text-white/30 group">
                                    <Icon className="w-3.5 h-3.5 text-raudhah-teal/60 group-hover:text-raudhah-teal transition-colors" />
                                    <span className="text-[11px] font-mono uppercase tracking-widest group-hover:text-white/50 transition-colors">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalCta;
