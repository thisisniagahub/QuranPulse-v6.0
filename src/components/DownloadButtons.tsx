import React from "react";

interface ButtonProps {
    dark?: boolean;
    variant?: 'teal' | 'dark' | 'glass';
    href?: string;
}

// App Store Button — Raudhah-themed
export const AppStoreButton = ({ dark = false, variant = 'teal', href = '#' }: ButtonProps) => {
    const styles = {
        teal: 'bg-raudhah-teal text-white border border-raudhah-teal/20 hover:bg-raudhah-teal/90 shadow-lg shadow-raudhah-teal/20',
        dark: 'bg-raudhah-ink text-white border border-white/10 hover:bg-raudhah-ink/80',
        glass: 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20',
    };

    return (
        <a
            href={href}
            className={`group relative flex items-center gap-3 rounded-2xl px-6 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl overflow-hidden ${styles[variant]}`}
        >
            {/* shimmer on hover */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            <svg viewBox="0 0 384 512" fill="currentColor" className="h-7 w-7 flex-shrink-0 relative z-10">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
            </svg>
            <div className="flex flex-col items-start leading-none relative z-10">
                <span className="text-[9px] font-semibold tracking-widest uppercase opacity-70">Download on the</span>
                <span className="text-lg font-bold tracking-tight">App Store</span>
            </div>
        </a>
    );
};

// Google Play Button — Raudhah-themed
export const GooglePlayButton = ({ dark = false, variant = 'glass', href = '#' }: ButtonProps) => {
    const styles = {
        teal: 'bg-raudhah-teal text-white border border-raudhah-teal/20 hover:bg-raudhah-teal/90 shadow-lg shadow-raudhah-teal/20',
        dark: 'bg-raudhah-ink text-white border border-white/10 hover:bg-raudhah-ink/80',
        glass: 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20',
    };

    return (
        <a
            href={href}
            className={`group relative flex items-center gap-3 rounded-2xl px-6 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl overflow-hidden ${styles[variant]}`}
        >
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            <svg viewBox="0 0 512 512" className="h-7 w-7 flex-shrink-0 relative z-10">
                <defs>
                    <linearGradient id="playGradientRaudhah" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="33%" stopColor="#facc15" />
                        <stop offset="66%" stopColor="#fb923c" />
                        <stop offset="100%" stopColor="#f87171" />
                    </linearGradient>
                </defs>
                <path fill="url(#playGradientRaudhah)" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
            </svg>
            <div className="flex flex-col items-start leading-none relative z-10">
                <span className="text-[9px] font-semibold tracking-widest uppercase opacity-70">Get it on</span>
                <span className="text-lg font-bold tracking-tight">Google Play</span>
            </div>
        </a>
    );
};

// Social Media Icons with real brand colors
export const SocialIcons = {
    WhatsApp: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#25D366">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    ),
    Instagram: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
            <defs>
                <linearGradient id="igGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FEDA75" />
                    <stop offset="20%" stopColor="#FA7E1E" />
                    <stop offset="40%" stopColor="#D62976" />
                    <stop offset="60%" stopColor="#962FBF" />
                    <stop offset="100%" stopColor="#4F5BD5" />
                </linearGradient>
            </defs>
            <path fill="url(#igGradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
    ),
    Facebook: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    ),
    TikTok: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#000000">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>
    ),
    X: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#000000">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    YouTube: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#FF0000">
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    )
};
