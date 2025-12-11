import React from 'react';
import { motion } from 'framer-motion';

export const WhatsAppButton = () => (
    <motion.a
        href="https://wa.me/601155559999?text=Salam%20Team%20QuranPulse,%20I'm%20interested%20in%20the%20Genesis%20Batch."
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,211,102,0.5)] cursor-pointer group"
    >
        {/* Lighting Pulse Animation */}
        <div className="absolute inset-0 rounded-full border-2 border-[#25D366] opacity-0 animate-ping-slow"></div>
        <div className="absolute inset-0 rounded-full border border-[#25D366] opacity-0 animate-ping delay-75"></div>
        
        <i className="fa-brands fa-whatsapp text-2xl sm:text-3xl text-white z-10"></i>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 bg-white text-black px-3 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
            Chat with Us
        </div>
    </motion.a>
);
