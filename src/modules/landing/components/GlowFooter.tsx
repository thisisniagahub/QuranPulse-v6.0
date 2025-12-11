import React from 'react';
import { motion } from 'framer-motion';

export const GlowFooter = () => {
  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Premium', href: '#premium' },
      { name: 'Roadmap', href: '#roadmap' },
      { name: 'Changelog', href: '#' },
    ],
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'API', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'Support', href: '#' },
    ],
    company: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Shariah Compliance', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: 'fa-brands fa-twitter', href: '#', label: 'Twitter' },
    { icon: 'fa-brands fa-instagram', href: '#', label: 'Instagram' },
    { icon: 'fa-brands fa-youtube', href: '#', label: 'YouTube' },
    { icon: 'fa-brands fa-tiktok', href: '#', label: 'TikTok' },
    { icon: 'fa-brands fa-telegram', href: '#', label: 'Telegram' },
  ];

  return (
    <footer className="relative z-10 border-t border-white/5 bg-black/60 backdrop-blur-xl">
      {/* Gradient glow at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-20 bg-gradient-to-b from-cyan-500/10 to-transparent blur-2xl" />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-12 mb-12">
          {/* Brand Column & Newsletter */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-black rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                <img src="/logo-full.png" alt="QuranPulse" className="w-full h-full object-contain p-1" />
              </div>
              <span className="font-bold text-xl text-white">QuranPulse</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              The future of Islamic intelligence. Experience the Quran like never before with AI-powered insights.
            </p>

            {/* Newsletter Input */}
            <div className="mb-8 max-w-xs">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Join Genesis Batch</p>
                <div className="flex gap-2">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                    <button className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg px-3 py-2 transition-colors">
                        <i className="fa-solid fa-arrow-right text-sm"></i>
                    </button>
                </div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300"
                >
                  <i className={`${social.icon} text-sm`} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-slate-400 text-sm hover:text-cyan-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-slate-400 text-sm hover:text-cyan-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-slate-400 text-sm hover:text-cyan-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-slate-400 text-sm hover:text-cyan-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} QuranPulse. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              All systems operational
            </span>
            <span className="mx-2 text-slate-700">•</span>
            <span>v6.0 Genesis Edition</span>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-maze opacity-30 pointer-events-none" />
    </footer>
  );
};

export default GlowFooter;
