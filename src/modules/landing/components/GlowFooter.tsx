import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Instagram, Youtube, Send, ArrowRight, Heart, ShieldCheck } from 'lucide-react';

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Send, href: '#', label: 'Telegram' },
];

const footerLinks = {
  product: [
    { name: 'Ciri-ciri', href: '#features' },
    { name: 'Harga', href: '#pricing' },
    { name: 'Ustaz AI', href: '#' },
    { name: 'Iqra Digital', href: '#' },
  ],
  resources: [
    { name: 'Dokumentasi', href: '#' },
    { name: 'API', href: '#' },
    { name: 'Komuniti', href: '#' },
    { name: 'Sokongan', href: '#' },
  ],
  company: [
    { name: 'Tentang Kami', href: '#about' },
    { name: 'Blog', href: '#' },
    { name: 'Kerjaya', href: '#' },
    { name: 'Hubungi', href: '#' },
  ],
  legal: [
    { name: 'Polisi Privasi', href: '/privacy' },
    { name: 'Terma Perkhidmatan', href: '#' },
    { name: 'Patuh Syariah', href: '#' },
  ],
};

export const GlowFooter = () => {
  return (
    <footer className="relative z-10 border-t border-raudhah-teal/10 bg-gradient-to-b from-white to-raudhah-ivory/80">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-raudhah-teal/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-20 bg-gradient-to-b from-raudhah-teal/5 to-transparent blur-2xl" />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        {/* Main Content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 relative flex items-center justify-center group">
                <div className="absolute inset-0 bg-raudhah-teal/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  loading="lazy"
                  src="/logo-primary.png"
                  alt="QuranPulse"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain scale-125 relative z-10"
                />
              </div>
              <span className="font-bold text-xl font-raudhah">
                <span className="text-raudhah-teal">Quran</span>
                <span className="text-raudhah-gold">Pulse</span>
              </span>
            </div>
            <p className="text-raudhah-ink/50 text-sm leading-relaxed mb-6 max-w-xs">
              Masa depan kecerdasan Islamik. Alami Al-Quran dengan cara yang tidak pernah anda bayangkan.
            </p>

            {/* Newsletter */}
            <div className="mb-8 max-w-xs">
              <p className="text-xs text-raudhah-ink/40 font-bold uppercase tracking-wider mb-3">
                Sertai Genesis Batch
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email anda"
                  className="flex-1 bg-white border border-raudhah-teal/15 rounded-xl px-3 py-2.5 text-sm text-raudhah-ink placeholder:text-raudhah-ink/30 focus:outline-none focus:border-raudhah-teal/40 focus:ring-2 focus:ring-raudhah-teal/10 transition-all"
                />
                <button aria-label="Hantar email" className="bg-raudhah-teal hover:bg-raudhah-teal/90 text-white rounded-xl px-4 py-2.5 transition-colors shadow-lg shadow-raudhah-teal/20">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-raudhah-ivory border border-raudhah-teal/10 flex items-center justify-center text-raudhah-ink/40 hover:text-raudhah-teal hover:border-raudhah-teal/30 hover:bg-raudhah-teal/5 transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-raudhah-ink text-sm mb-4 uppercase tracking-wider">
                {category === 'product' ? 'Produk' : category === 'resources' ? 'Sumber' : category === 'company' ? 'Syarikat' : 'Undang-undang'}
              </h4>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-raudhah-ink/50 text-sm hover:text-raudhah-teal transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-raudhah-teal/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-raudhah-ink/40 text-sm flex items-center gap-1">
            © {new Date().getFullYear()} QuranPulse. Dibuat dengan{' '}
            <Heart className="w-3 h-3 text-red-400 fill-red-400 inline" />{' '}
            di Malaysia.
          </p>

          <div className="flex items-center gap-4 text-xs text-raudhah-ink/40">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-raudhah-teal" />
              Patuh JAKIM
            </span>
            <span className="text-raudhah-ink/20">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Sistem aktif
            </span>
            <span className="text-raudhah-ink/20">•</span>
            <span>v6.0 Genesis</span>
          </div>
        </div>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-pattern-grid bg-[size:60px_60px]" />
    </footer>
  );
};

export default GlowFooter;
