import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, ArrowRight } from 'lucide-react';
import { AppStoreButton, GooglePlayButton } from '@/components/DownloadButtons';

interface FinalCtaProps {
    onGetStarted?: () => void;
}

const FinalCta: React.FC<FinalCtaProps> = ({ onGetStarted }) => {
    return (
        <section className="py-24 bg-transparent relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-cyan-100 via-transparent to-transparent opacity-50"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-200/20 rounded-full blur-[150px] pointer-events-none"></div>
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
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/20 text-[#22d3ee] text-xs font-bold tracking-widest uppercase mb-8">
                        <Rocket className="w-3 h-3" />
                        Mula Sekarang
                    </div>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-6xl font-[Montserrat] font-bold text-slate-800 mb-6 tracking-tight leading-tight">
                        Mula Perjalanan Quran<br />
                        <span className="text-cyan-600">
                            Anda Hari Ini
                        </span>
                    </h2>

                    {/* Subheadline */}
                    <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                        Percuma untuk bermula. Tiada kad kredit diperlukan.
                        <span className="text-cyan-600 font-bold"> Batal bila-bila masa.</span>
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                        <AppStoreButton dark />
                        <GooglePlayButton dark />
                    </div>

                    {/* Web App Link */}
                    <button
                        onClick={onGetStarted}
                        className="inline-flex items-center gap-2 text-cyan-700 font-bold text-sm hover:gap-3 transition-all group"
                    >
                        Atau akses Web App sekarang
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Trust indicators */}
                    <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-slate-500 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span>Patuh JAKIM</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#22d3ee]"></div>
                            <span>Privacy-First</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span>Made in Malaysia 🇲🇾</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalCta;
