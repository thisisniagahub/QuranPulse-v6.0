import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, ArrowRight } from 'lucide-react';
import { AppStoreButton, GooglePlayButton } from '@/components/DownloadButtons';
import { Magnet } from '../ui/Magnet';

interface FinalCtaProps {
    onGetStarted?: () => void;
}

const FinalCta: React.FC<FinalCtaProps> = ({ onGetStarted }) => {
    return (
        <section className="py-24 bg-raudhah-ivory relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-raudhah-teal/5 via-transparent to-transparent opacity-50"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-raudhah-teal/10 rounded-full blur-[150px] pointer-events-none"></div>
            </div>

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000,transparent)]"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-raudhah-teal/5 border border-raudhah-teal/10 text-raudhah-teal text-[10px] font-bold tracking-widest uppercase mb-8 font-mono">
                        <Rocket className="w-3 h-3" />
                        Mula Sekarang
                    </div>

                    {/* Headline */}
                    <h2 className="text-5xl md:text-7xl font-raudhah font-bold text-raudhah-ink mb-8 tracking-tighter leading-[0.95]">
                        Mula Perjalanan Quran<br />
                        <span className="text-raudhah-teal">
                            Anda Hari Ini
                        </span>
                    </h2>

                    {/* Subheadline */}
                    <p className="text-xl text-raudhah-ink/60 mb-12 max-w-2xl mx-auto leading-relaxed font-normal">
                        Percuma untuk bermula. Sertai 1,000 ummah pertama untuk akses PRO selamanya.
                        <span className="text-raudhah-gold font-bold"> Jaminan Tanpa Iklan.</span>
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                        <Magnet strength={0.3}>
                            <AppStoreButton dark />
                        </Magnet>
                        <Magnet strength={0.3}>
                            <GooglePlayButton dark />
                        </Magnet>
                    </div>

                    {/* Web App Link */}
                    <button
                        onClick={onGetStarted}
                        className="inline-flex items-center gap-2 text-raudhah-teal font-bold text-sm hover:gap-3 transition-all group"
                    >
                        Atau akses terus di pelayar
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Trust indicators */}
                    <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-raudhah-ink/30 text-[10px] font-mono uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-raudhah-teal"></div>
                            <span>Patuh JAKIM</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-raudhah-teal"></div>
                            <span>Privacy-First</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-raudhah-gold"></div>
                            <span>Made in Malaysia 🇲🇾</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalCta;
