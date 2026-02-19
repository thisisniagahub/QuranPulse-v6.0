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
    { label: 'Facebook', Icon: SocialIcons.Facebook, href: 'https://facebook.com/quranpulse', bg: 'hover:bg-[#1877F2]/20' },
    { label: 'TikTok', Icon: SocialIcons.TikTok, href: 'https://tiktok.com/@quranpulse', bg: 'hover:bg-gray-500/20' },
    { label: 'X', Icon: SocialIcons.X, href: 'https://x.com/quranpulse', bg: 'hover:bg-gray-500/20' },
    { label: 'YouTube', Icon: SocialIcons.YouTube, href: 'https://youtube.com/@quranpulse', bg: 'hover:bg-red-500/20' }
];

const Footer: React.FC = () => {
    return (
        <footer className="bg-white pt-24 pb-8 border-t border-raudhah-teal/5 relative overflow-hidden">
            {/* Background subtle */}
            <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-raudhah-teal/5 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Main Footer Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <img loading="lazy"
                                src="/logo-primary.png"
                                alt="QuranPulse Logo"
                                className="w-12 h-12 object-contain"
                            />
                            <span className="font-bold text-2xl font-raudhah text-raudhah-ink">
                                Quran<span className="text-raudhah-teal">Pulse</span>
                            </span>
                        </div>

                        <p className="text-raudhah-ink/50 text-sm leading-relaxed mb-6 max-w-sm font-normal">
                            Menghubungkan hikmah ilahi abadi dengan teknologi moden. Membina masa depan digital Ummah dengan kualiti & ketenangan.
                        </p>

                        <div className="text-xs font-bold text-raudhah-teal tracking-widest uppercase mb-8 font-mono">
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
                        <h4 className="font-bold text-raudhah-ink mb-6 font-raudhah">Produk</h4>
                        <ul className="space-y-4">
                            {FOOTER_LINKS.produk.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-raudhah-ink/50 hover:text-raudhah-teal transition-colors text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Syarikat Column */}
                    <div>
                        <h4 className="font-bold text-raudhah-ink mb-6 font-raudhah">Syarikat</h4>
                        <ul className="space-y-4">
                            {FOOTER_LINKS.syarikat.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-raudhah-ink/50 hover:text-raudhah-teal transition-colors text-sm flex items-center gap-1 font-normal"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Undang-undang Column */}
                    <div>
                        <h4 className="font-bold text-raudhah-ink mb-6 font-raudhah">Undang-undang</h4>
                        <ul className="space-y-4">
                            {FOOTER_LINKS.undangUndang.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-raudhah-ink/50 hover:text-raudhah-teal transition-colors text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* JAKIM Badge */}
                        <div className="mt-8 p-4 bg-raudhah-teal/5 border border-raudhah-teal/10 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Shield className="w-8 h-8 text-raudhah-teal opacity-50" />
                                <div>
                                    <div className="text-xs font-bold text-raudhah-teal">Patuh JAKIM</div>
                                    <div className="text-[10px] text-raudhah-ink/30">Kandungan Disahkan</div>
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
                            className={`w-12 h-12 rounded-xl bg-raudhah-ink/5 border border-raudhah-ink/10 flex items-center justify-center hover:scale-110 transition-all ${social.bg} shadow-sm group`}
                            aria-label={social.label}
                        >
                            <social.Icon />
                        </a>
                    ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-raudhah-ink/10 to-transparent mb-8"></div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <div className="text-raudhah-ink/20 text-[10px] font-mono uppercase tracking-widest">
                        © {new Date().getFullYear()} QuranPulse. Hak Cipta Terpelihara.
                    </div>

                    <div className="flex items-center gap-2 text-raudhah-ink/20 text-[10px] font-mono uppercase tracking-widest">
                        <MapPin className="w-3 h-3" />
                        <span>Dibina di Malaysia 🇲🇾</span>
                    </div>

                    <div className="text-raudhah-gold text-[10px] font-bold uppercase tracking-widest font-mono">
                        Teknologi untuk Taqwa
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

