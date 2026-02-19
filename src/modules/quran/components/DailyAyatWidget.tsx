/**
 * 📖 Daily Ayat Widget
 * Displays a personalized verse of the day with share functionality
 * 
 * Features:
 * - Dynamic verse selection based on user progress
 * - Beautiful gradient card with Arabic text
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
            <div className={`bg-gradient-to-br from-cyan-500/10 to-purple-500/10 
                       rounded-2xl p-6 animate-pulse ${className}`}>
                <div className="h-6 w-32 bg-slate-700 rounded mb-4" />
                <div className="h-16 bg-slate-700 rounded mb-4" />
                <div className="h-12 bg-slate-700 rounded" />
            </div>
        );
    }

    if (!ayat) return null;

    if (compact) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-r from-cyan-500/20 to-purple-500/20 
                    rounded-xl p-4 cursor-pointer group ${className}`}
                onClick={() => onVerseClick?.(ayat.surahNumber, ayat.verseNumber)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 
                           rounded-full flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-cyan-400">Ayat Hari Ini</p>
                            <p className="text-sm text-white font-medium">{ayat.surahName}</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative overflow-hidden rounded-2xl ${className}`}
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 blur-2xl rounded-full" />

            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 
                           rounded-lg flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white">Ayat Hari Ini</h3>
                            {ayat.theme && (
                                <p className="text-xs text-cyan-400">{ayat.theme}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={handleNotificationToggle}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            aria-label={notificationsEnabled ? 'Matikan notifikasi harian' : 'Aktifkan notifikasi harian'}
                            title={notificationsEnabled ? 'Matikan notifikasi' : 'Aktifkan notifikasi harian'}
                        >
                            {notificationsEnabled ? (
                                <Bell className="w-4 h-4 text-cyan-400" />
                            ) : (
                                <BellOff className="w-4 h-4 text-slate-400" />
                            )}
                        </button>
                        <button
                            onClick={handleRefresh}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Ayat lain"
                            title="Ayat lain"
                        >
                            <RefreshCw className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
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
                    <p className="text-2xl md:text-3xl font-arabic text-right text-white leading-loose mb-4">
                        {ayat.arabicText}
                    </p>

                    {/* Translation */}
                    <p className="text-sm text-slate-300 leading-relaxed">
                        {ayat.translation}
                    </p>
                </motion.div>

                {/* Source */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <button
                        onClick={() => onVerseClick?.(ayat.surahNumber, ayat.verseNumber)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                        {ayat.surahName} ({ayat.surahNameAr}) • {ayat.surahNumber}:{ayat.verseNumber}
                    </button>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsLiked(!isLiked)}
                            className={`p-2 rounded-lg transition-all ${isLiked ? 'bg-pink-500/20 text-pink-400' : 'hover:bg-white/10 text-slate-400'
                                }`}
                            aria-label={isLiked ? 'Buang dari kegemaran' : 'Tambah ke kegemaran'}
                            title={isLiked ? 'Buang kegemaran' : 'Tambah kegemaran'}
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={handleCopy}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                            aria-label="Salin ayat"
                            title="Salin ayat"
                        >
                            {isCopied ? (
                                <Check className="w-4 h-4 text-green-400" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </button>

                        <button
                            onClick={handleShare}
                            className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 
                         rounded-lg text-white hover:shadow-lg hover:shadow-cyan-500/25 
                         transition-all"
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
