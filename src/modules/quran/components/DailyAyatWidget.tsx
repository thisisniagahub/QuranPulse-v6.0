/**
 * 📖 Daily Ayat Widget
 * Displays a personalized verse of the day with share functionality
 * 
 * Features:
 * - Dynamic verse selection based on user progress
 * - Beautiful Raudhah themed card with Arabic text
 * - Share to social media
 * - PWA notification integration
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Share2, RefreshCw, Bell, BellOff,
    Heart, Copy, Check, ChevronRight
} from 'lucide-react';

interface DailyAyat {
    surahNumber: number;
    surahName: string;
    surahNameAr: string;
    verseNumber: number;
    arabicText: string;
    translation: string;
    theme?: string;
}

interface DailyAyatWidgetProps {
    onVerseClick?: (surahNumber: number, verseNumber: number) => void;
    compact?: boolean;
    className?: string;
}

// Curated daily verses with themes
const DAILY_VERSES: DailyAyat[] = [
    {
        surahNumber: 2, verseNumber: 286,
        surahName: 'Al-Baqarah', surahNameAr: 'البقرة',
        arabicText: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
        translation: 'Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.',
        theme: 'Kesabaran'
    },
    {
        surahNumber: 94, verseNumber: 5,
        surahName: 'Ash-Sharh', surahNameAr: 'الشرح',
        arabicText: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
        translation: 'Maka sesungguhnya bersama kesulitan ada kemudahan.',
        theme: 'Harapan'
    },
    {
        surahNumber: 3, verseNumber: 139,
        surahName: 'Ali \'Imran', surahNameAr: 'آل عمران',
        arabicText: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ',
        translation: 'Dan janganlah kamu bersikap lemah, dan janganlah pula bersedih hati, padahal kamulah orang-orang yang paling tinggi (derajatnya), jika kamu beriman.',
        theme: 'Kekuatan'
    },
    {
        surahNumber: 65, verseNumber: 3,
        surahName: 'At-Talaq', surahNameAr: 'الطلاق',
        arabicText: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
        translation: 'Dan barangsiapa yang bertawakkal kepada Allah, nescaya Allah akan mencukupkan (keperluan)nya.',
        theme: 'Tawakkal'
    },
    {
        surahNumber: 39, verseNumber: 53,
        surahName: 'Az-Zumar', surahNameAr: 'الزمر',
        arabicText: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ',
        translation: 'Katakanlah: "Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri, janganlah kamu berputus asa dari rahmat Allah."',
        theme: 'Pengampunan'
    },
    {
        surahNumber: 2, verseNumber: 152,
        surahName: 'Al-Baqarah', surahNameAr: 'البقرة',
        arabicText: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
        translation: 'Maka ingatlah kepada-Ku, Aku pun akan ingat kepadamu. Bersyukurlah kepada-Ku, dan janganlah kamu ingkar kepada-Ku.',
        theme: 'Syukur'
    },
    {
        surahNumber: 13, verseNumber: 28,
        surahName: 'Ar-Ra\'d', surahNameAr: 'الرعد',
        arabicText: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
        translation: 'Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.',
        theme: 'Ketenangan'
    },
];

const safeSetStorage = (key: string, value: string): void => {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Ignore storage errors
    }
};

const DailyAyatWidget: React.FC<DailyAyatWidgetProps> = ({
    onVerseClick,
    compact = false,
    className = ''
}) => {
    const [ayat, setAyat] = useState<DailyAyat | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Get today's verse (deterministic based on date)
    useEffect(() => {
        const today = new Date();
        const dayOfYear = Math.floor(
            (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
        );
        const verseIndex = dayOfYear % DAILY_VERSES.length;

        // Simulate loading for smooth UX
        setTimeout(() => {
            setAyat(DAILY_VERSES[verseIndex]);
            setIsLoading(false);
        }, 300);

        // Check notification permission
        if ('Notification' in window) {
            setNotificationsEnabled(Notification.permission === 'granted');
        }
    }, []);

    const handleShare = async () => {
        if (!ayat) return;

        const shareText = `📖 ${ayat.surahName} (${ayat.surahNumber}:${ayat.verseNumber})\n\n${ayat.arabicText}\n\n${ayat.translation}\n\n— QuranPulse`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Ayat Hari Ini - ${ayat.surahName}`,
                    text: shareText,
                });
            } catch (err) {
                // User cancelled or error
            }
        } else {
            // Fallback to clipboard
            handleCopy();
        }
    };

    const handleCopy = async () => {
        if (!ayat) return;

        const text = `${ayat.arabicText}\n\n${ayat.translation}\n\n— ${ayat.surahName} ${ayat.surahNumber}:${ayat.verseNumber}`;

        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleNotificationToggle = async () => {
        if (!('Notification' in window)) {
            alert('Browser ini tidak menyokong notifikasi');
            return;
        }

        if (Notification.permission === 'granted') {
            setNotificationsEnabled(!notificationsEnabled);
            safeSetStorage('dailyAyatNotifications', String(!notificationsEnabled));
        } else if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setNotificationsEnabled(true);
                safeSetStorage('dailyAyatNotifications', 'true');

                // Show test notification
                new Notification('📖 Ayat Hari Ini Aktif!', {
                    body: 'Anda akan menerima ayat inspirasi setiap hari.',
                    icon: '/icons/icon-192x192.png'
                });
            }
        }
    };

    const handleRefresh = () => {
        setIsLoading(true);
        const randomIndex = Math.floor(Math.random() * DAILY_VERSES.length);
        setTimeout(() => {
            setAyat(DAILY_VERSES[randomIndex]);
            setIsLoading(false);
        }, 300);
    };

    if (isLoading) {
        return (
            <div className={`glass-v7 rounded-2xl p-6 animate-pulse ${className}`}>
                <div className="h-6 w-32 bg-raudhah-teal/10 rounded mb-4" />
                <div className="h-16 bg-raudhah-teal/10 rounded mb-4" />
                <div className="h-12 bg-raudhah-teal/10 rounded" />
            </div>
        );
    }

    if (!ayat) return null;

    if (compact) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-raudhah-teal/5 border border-raudhah-teal/10 
                    rounded-xl p-4 cursor-pointer group ${className}`}
                onClick={() => onVerseClick?.(ayat.surahNumber, ayat.verseNumber)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-raudhah-teal rounded-full flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-raudhah-teal/60 font-bold uppercase tracking-wider">Ayat Hari Ini</p>
                            <p className="text-sm text-raudhah-ink font-bold">{ayat.surahName}</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-raudhah-teal/40 group-hover:text-raudhah-teal transition-colors" />
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative overflow-hidden rounded-2xl glass-v7 border border-raudhah-teal/10 ${className}`}
        >
            {/* Background Texture */}
            <div className="absolute inset-0 bg-pattern-dots-raudhah opacity-[0.03] pointer-events-none" />

            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-raudhah-teal rounded-lg flex items-center justify-center shadow-warm">
                            <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-raudhah-ink uppercase tracking-wider">Ayat Hari Ini</h3>
                            {ayat.theme && (
                                <p className="text-[10px] text-raudhah-gold font-black uppercase tracking-widest">{ayat.theme}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={handleNotificationToggle}
                            className="p-2 hover:bg-raudhah-teal/5 rounded-lg transition-colors"
                            aria-label={notificationsEnabled ? 'Matikan notifikasi harian' : 'Aktifkan notifikasi harian'}
                            title={notificationsEnabled ? 'Matikan notifikasi' : 'Aktifkan notifikasi harian'}
                        >
                            {notificationsEnabled ? (
                                <Bell className="w-4 h-4 text-raudhah-gold" />
                            ) : (
                                <BellOff className="w-4 h-4 text-raudhah-teal/30" />
                            )}
                        </button>
                        <button
                            onClick={handleRefresh}
                            className="p-2 hover:bg-raudhah-teal/5 rounded-lg transition-colors"
                            aria-label="Ayat lain"
                            title="Ayat lain"
                        >
                            <RefreshCw className="w-4 h-4 text-raudhah-teal/30 hover:text-raudhah-teal transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Arabic Text */}
                <motion.div
                    key={ayat.arabicText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                >
                    <p className="text-2xl md:text-3xl font-arabic text-right text-raudhah-ink leading-loose mb-4">
                        {ayat.arabicText}
                    </p>

                    {/* Translation */}
                    <div className="bg-raudhah-teal/5 rounded-xl p-4 border border-raudhah-teal/10">
                        <p className="text-sm text-raudhah-ink/70 leading-relaxed italic">
                            "{ayat.translation}"
                        </p>
                    </div>
                </motion.div>

                {/* Source */}
                <div className="flex items-center justify-between pt-4 border-t border-raudhah-teal/10">
                    <button
                        onClick={() => onVerseClick?.(ayat.surahNumber, ayat.verseNumber)}
                        className="text-[10px] font-bold text-raudhah-teal/60 hover:text-raudhah-teal transition-colors uppercase tracking-widest"
                    >
                        {ayat.surahName} • {ayat.surahNumber}:{ayat.verseNumber}
                    </button>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsLiked(!isLiked)}
                            className={`p-2 rounded-lg transition-all ${isLiked ? 'bg-pink-500/10 text-pink-500' : 'hover:bg-raudhah-teal/5 text-raudhah-teal/30'
                                }`}
                            aria-label={isLiked ? 'Buang dari kegemaran' : 'Tambah ke kegemaran'}
                            title={isLiked ? 'Buang kegemaran' : 'Tambah kegemaran'}
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={handleCopy}
                            className="p-2 hover:bg-raudhah-teal/5 rounded-lg transition-colors text-raudhah-teal/30 hover:text-raudhah-teal"
                            aria-label="Salin ayat"
                            title="Salin ayat"
                        >
                            {isCopied ? (
                                <Check className="w-4 h-4 text-green-500" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </button>

                        <button
                            onClick={handleShare}
                            className="p-2 bg-raudhah-teal rounded-lg text-white hover:bg-raudhah-ink transition-all shadow-warm"
                            aria-label="Kongsi ayat ini"
                            title="Kongsi ayat ini"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DailyAyatWidget;
