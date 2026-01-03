import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { AppStoreButton, GooglePlayButton, SocialIcons } from '@/components/DownloadButtons';

const FOOTER_LINKS = {
    produk: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Testimonials', href: '#testimonials' },
        { label: 'Download', href: '#download' }
    ],
    syarikat: [
        { label: 'Tentang Kami', href: '/about' },
        { label: 'Hubungi', href: '/contact' },
        { label: 'Kerjaya', href: '/careers' },
        { label: 'Blog', href: '/blog' }
    ],
    undangUndang: [
        { label: 'Polisi Privasi', href: '/privacy' },
        { label: 'Terma Perkhidmatan', href: '/terms' },
        { label: 'Polisi Bayaran Balik', href: '/refund' },
        { label: 'Pematuhan JAKIM', href: '/compliance' }
    ]
};

const SOCIAL_LINKS = [
    { label: 'WhatsApp', Icon: SocialIcons.WhatsApp, href: 'https://wa.me/60123456789', bg: 'hover:bg-[#25D366]/20' },
    { label: 'Instagram', Icon: SocialIcons.Instagram, href: 'https://instagram.com/quranpulse', bg: 'hover:bg-pink-500/20' },
    { label: 'TikTok', Icon: SocialIcons.TikTok, href: 'https://tiktok.com/@quranpulse', bg: 'hover:bg-white/20' },
    { label: 'YouTube', Icon: SocialIcons.YouTube, href: 'https://youtube.com/@quranpulse', bg: 'hover:bg-red-500/20' }
];

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#020617] pt-24 pb-8 border-t border-white/5 relative overflow-hidden">
            {/* Background subtle */}
            <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-[#22d3ee]/5 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Main Footer Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <img
                                src="/logo-primary.png"
                                alt="QuranPulse Logo"
                                className="w-12 h-12 object-contain"
                            />
                            <span className="font-bold text-2xl font-[Montserrat]">
                                Quran<span className="text-[#22d3ee]">Pulse</span>
                            </span>
                        </div>

                        <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
                            Menghubungkan hikmat ilahi abadi dengan teknologi moden. Membina masa depan digital Ummah dengan Ihsan.
                        </p>

                        <div className="text-xs font-bold text-[#22d3ee] tracking-widest uppercase mb-8">
                            Teknologi untuk Taqwa
                        </div>

                        {/* Download Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <AppStoreButton dark />
                            <GooglePlayButton dark />
                        </div>
                    </div>

                    {/* Produk Column */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Produk</h4>
                        <ul className="space-y-4">
                            {FOOTER_LINKS.produk.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-slate-400 hover:text-[#22d3ee] transition-colors text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Syarikat Column */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Syarikat</h4>
                        <ul className="space-y-4">
                            {FOOTER_LINKS.syarikat.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-slate-400 hover:text-[#22d3ee] transition-colors text-sm flex items-center gap-1"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Undang-undang Column */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Undang-undang</h4>
                        <ul className="space-y-4">
                            {FOOTER_LINKS.undangUndang.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-slate-400 hover:text-[#22d3ee] transition-colors text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* JAKIM Badge */}
                        <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Shield className="w-8 h-8 text-emerald-400" />
                                <div>
                                    <div className="text-xs font-bold text-emerald-400">Patuh JAKIM</div>
                                    <div className="text-[10px] text-slate-500">Kandungan Disahkan</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                    {SOCIAL_LINKS.map((social) => (
                        <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:scale-110 transition-all ${social.bg}`}
                            aria-label={social.label}
                        >
                            <social.Icon />
                        </a>
                    ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <div className="text-slate-600 text-xs font-mono">
                        © {new Date().getFullYear()} QuranPulse. Hak Cipta Terpelihara.
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 text-xs">
                        <MapPin className="w-3 h-3" />
                        <span>Dibina dengan ❤️ di Kuala Lumpur, Malaysia</span>
                    </div>

                    <div className="text-[#22d3ee] text-xs font-bold">
                        Teknologi untuk Taqwa
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
