import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQibla } from '../../hooks/useQibla';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import { JAKIM_ZONES } from '../../data/jakimZones';
import { JakimService } from '../../services/jakimService';
import { AnalyticsService } from '../../services/analyticsService';
import ZakatCalculator from './components/ZakatCalculator';
import PrayerCard from './components/PrayerCard';

const safeGetStorage = (key: string, fallback: string): string => {
    try {
        return localStorage.getItem(key) || fallback;
    } catch {
        return fallback;
    }
};

const safeSetStorage = (key: string, value: string): void => {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Ignore storage errors
    }
};

// Color themes based on "Weather Widget" reference
const PRAYER_THEMES = {
    Subuh: { gradient: 'from-[#ff8c42] to-[#ff3c5f]', glow: 'shadow-orange-500/50', icon: 'meteocons:sunrise-fill' }, // Dawn Pink/Orange
    Syuruk: { gradient: 'from-[#fdbb2d] to-[#22c1c3]', glow: 'shadow-yellow-500/50', icon: 'meteocons:horizon-fill' }, // Rising Sun
    Zohor: { gradient: 'from-[#4facfe] to-[#00f2fe]', glow: 'shadow-blue-400/50', icon: 'meteocons:clear-day-fill' }, // Noon Blue
    Asar: { gradient: 'from-[#6a11cb] to-[#2575fc]', glow: 'shadow-purple-500/50', icon: 'meteocons:partly-cloudy-day-fill' }, // Afternoon Purple/Blue
    Maghrib: { gradient: 'from-[#fa709a] to-[#fee140]', glow: 'shadow-pink-400/50', icon: 'meteocons:sunset-fill' }, // Dusk Pink/Yellow
    Isyak: { gradient: 'from-[#1e3c72] to-[#2a5298]', glow: 'shadow-indigo-500/50', icon: 'meteocons:star-fill' } // Night Deep Blue
};

const Ibadah: React.FC = () => {
    const [viewMode, setViewMode] = useState<'QIBLA' | 'PRAYER' | 'MASJID' | 'ZAKAT'>('QIBLA');
    const [selectedZone, setSelectedZone] = useState(() => safeGetStorage('pulse_zone', 'WLY01'));
    const [showZoneModal, setShowZoneModal] = useState(false);

    // Track View Changes
    useEffect(() => {
        if (viewMode === 'QIBLA') {
            AnalyticsService.track('QIBLA_CHECK', {});
        } else if (viewMode === 'PRAYER') {
            AnalyticsService.track('PRAYER_TIMES_CHECK', { zone: selectedZone });
        } else if (viewMode === 'ZAKAT') {
            AnalyticsService.track('ZAKAT_CALC_VIEW', {});
        } else {
            AnalyticsService.track('MASJID_HUB_VIEW', {});
        }
    }, [viewMode, selectedZone]);

    // Qibla & Location Hook
    const qibla = useQibla();
    const {
        qiblaAngle,
        deviceHeading,
        isPointingQibla,
        latitude,
        longitude,
        isLoading,
        error,
        isDeviceOrientationSupported,
        isGeolocationSupported,
    } = qibla;

    // Prayer Times Hook
    const { data: prayerData, loading: prayerLoading, usingJakim } = usePrayerTimes(latitude, longitude, selectedZone);

    // State to handle permission request UI
    const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
    const [showTimeoutError, setShowTimeoutError] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isLoading && viewMode === 'QIBLA') {
            timer = setTimeout(() => {
                setShowTimeoutError(true);
            }, 8000);
        } else {
            setShowTimeoutError(false);
        }
        return () => clearTimeout(timer);
    }, [isLoading, viewMode]);

    useEffect(() => {
        safeSetStorage('pulse_zone', selectedZone);
    }, [selectedZone]);

    useEffect(() => {
        if (!isLoading && (error?.includes('permission') || (!isGeolocationSupported && !isDeviceOrientationSupported))) {
            setShowPermissionPrompt(true);
        } else {
            setShowPermissionPrompt(false);
        }
    }, [isLoading, error, isGeolocationSupported, isDeviceOrientationSupported]);

    // Requesting permission for iOS 13+ devices
    const requestDeviceOrientationPermission = () => {
        if ((typeof DeviceOrientationEvent as any).requestPermission === 'function') {
            (DeviceOrientationEvent as any).requestPermission()
                .then((permissionState: string) => {
                    if (permissionState === 'granted') {
                        setShowPermissionPrompt(false);
                    } else {
                        // Handle error state locally or trigger re-check
                    }
                })
                .catch(console.error);
        }
    };

    // Calculate rotation for the compass (Qibla pointer)
    const compassRotation = deviceHeading !== null ? -deviceHeading : 0;

    // Calculate Qibla pointer rotation relative to the compass background
    let qiblaPointerRotation = 0;
    if (qiblaAngle !== null && deviceHeading !== null) {
        qiblaPointerRotation = (qiblaAngle - deviceHeading + 360) % 360;
    }

    // --- UI Elements ---
    const renderCompass = () => (
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 bg-gradient-to-br from-[#0A1E42] to-[#020617] rounded-full flex items-center justify-center border-4 border-[#00BFFF]/30 shadow-[0_0_50px_rgba(0,191,255,0.2)] mt-8">
            {/* Compass background with North/South/East/West markers */}
            <motion.div
                className="absolute inset-0 rounded-full"
                style={{ rotate: compassRotation }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-white" /> {/* North */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-slate-500" /> {/* South */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-8 bg-slate-500" /> {/* West */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-1 w-8 bg-slate-500" /> {/* East */}

                {/* Cardinal points text */}
                <span className="absolute top-8 left-1/2 -translate-x-1/2 text-white font-bold text-sm">N</span>
                <span className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 text-sm">S</span>
                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-500 text-sm">W</span>
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-500 text-sm">E</span>

                {/* Dynamic Qibla Pointer */}
                <motion.div
                    className="absolute inset-0 rounded-full flex items-center justify-center"
                    style={{ rotate: qiblaPointerRotation }}
                >
                    <div className={`w-3 h-36 bg-emerald-500 rounded-t-full shadow-lg origin-bottom transition-all duration-300 ${isPointingQibla ? 'scale-y-110 shadow-emerald-400' : ''}`} />
                </motion.div>

                {/* Background Decoration */}
                <div className="absolute inset-0 bg-pattern-dots-raudhah opacity-5 pointer-events-none"></div>

                {/* Center Dot */}
                <div className="absolute w-6 h-6 bg-raudhah-teal rounded-full shadow-inner shadow-white/50" />
            </motion.div>

            {/* Qibla Angle Display */}
            {qiblaAngle !== null && (
                <div className="absolute bottom-10 flex flex-col items-center">
                    <div className="text-raudhah-teal font-mono text-xl font-bold tracking-widest">
                        {Math.round(qiblaAngle)}°
                    </div>
                    {/* Waktu dalam Qiblat */}
                    {prayerData && (
                        <div className="mt-2 flex flex-col items-center">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{prayerData.nextPrayer}</span>
                            <span className="text-sm text-white font-mono">{prayerData.timeRemaining}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const renderPrayerTimes = () => {
        if (!prayerData) return <div className="text-center text-slate-400 mt-10">Mengira waktu solat...</div>;

        const prayers = [
            { name: 'Subuh', time: prayerData.fajr, icon: 'fa-cloud-sun' },
            { name: 'Syuruk', time: prayerData.sunrise, icon: 'fa-sun', isSecondary: true },
            { name: 'Zohor', time: prayerData.dhuhr, icon: 'fa-sun' },
            { name: 'Asar', time: prayerData.asr, icon: 'fa-cloud-sun' },
            { name: 'Maghrib', time: prayerData.maghrib, icon: 'fa-moon' },
            { name: 'Isyak', time: prayerData.isha, icon: 'fa-star' },
        ];

        return (
            <div className="w-full max-w-md space-y-4 mt-4 pb-24">
                {/* Header Info */}
                <div className="text-center mb-6">
                    <p className="text-slate-500 dark:text-amber-400 font-arabic text-xl">{prayerData.hijriDate}</p>

                    <button
                        onClick={() => setShowZoneModal(true)}
                        className="flex items-center justify-center gap-2 mx-auto mt-2 px-4 py-2 rounded-full bg-surface/50 dark:bg-slate-800/50 hover:bg-surface dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 transition-all shadow-sm"
                    >
                        <i className="fa-solid fa-location-dot text-primary"></i>
                        {prayerData.locationName}
                        <i className="fa-solid fa-chevron-down text-[10px] ml-1"></i>
                    </button>

                    <div className="mt-3 text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
                        Sumber: {usingJakim ? <span className="text-emerald-500">JAKIM</span> : <span className="text-amber-500">Kiraan GPS</span>}
                    </div>
                </div>

                {/* Multi-Prayer List (Weather Style) */}
                <div className="flex flex-col gap-4">
                    {prayers.map((p, i) => {
                        const isNext = prayerData.nextPrayer === p.name;
                        const theme = PRAYER_THEMES[p.name as keyof typeof PRAYER_THEMES] || PRAYER_THEMES.Subuh;

                        return (
                            <PrayerCard
                                key={i}
                                name={p.name}
                                time={formatTime(p.time)}
                                icon={theme.icon}
                                isNext={isNext}
                                gradient={theme.gradient}
                                glow={theme.glow}
                                bottomInfo={p.isSecondary ? "Dilarang Solat" : "Fardu"}
                            />
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderMasjidHub = () => (
        <div className="w-full max-w-md space-y-6 mt-4 pb-24 animate-in fade-in slide-in-from-bottom-4">
            {/* Active Masjid Card */}
            <div className="bg-[#0A1E42] border border-[#00BFFF]/30 rounded-3xl p-6 relative overflow-hidden group">
                <div className="absolute inset-0 z-0">
                    <img loading="lazy" src="https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=1000&auto=format&fit=crop" alt="Masjid Background" className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A1E42] to-[#0A1E42]/80"></div>
                </div>

                <div className="relative z-10">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#00BFFF]/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-white font-[Poppins]">Masjid Al-Hidayah</h3>
                            <p className="text-xs text-slate-400 italic">Kariah Gombak, Selangor</p>
                        </div>
                        <div className="bg-[#00BFFF]/20 text-[#00BFFF] p-2 rounded-xl">
                            <i className="fa-solid fa-circle-check"></i>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-bold transition-all">
                            <i className="fa-solid fa-map-location-dot mr-2 text-raudhah-teal"></i>NAVIGASI
                        </button>
                        <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-bold transition-all">
                            <i className="fa-brands fa-whatsapp mr-2 text-emerald-400"></i>AJK MASJID
                        </button>
                    </div>
                </div>
            </div>

            {/* Live Jadual */}
            <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-2">Jadual Kuliah</h4>
                <div className="space-y-2">
                    <div className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex flex-col items-center justify-center text-amber-500">
                            <span className="text-[10px] font-bold">MAGHRIB</span>
                            <span className="text-xs">7:30</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-200 line-clamp-1">Kitab Riyadhus Salihin</p>
                            <p className="text-[10px] text-slate-500">Ustaz Dr. Haji Ali</p>
                        </div>
                        <span className="ml-auto bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded">RSVP</span>
                    </div>
                </div>
            </div>

            {/* Tabung Infaq */}
            <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-2">Tabung Infaq</h4>
                <div className="grid grid-cols-1 gap-3">
                    <div className="bg-gradient-to-br from-[#1E3A5F]/30 to-[#0A1E42] border border-[#00BFFF]/20 p-5 rounded-3xl relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm font-bold text-white font-[Poppins]">Baik Pulih Bumbung</p>
                                <p className="text-[10px] text-slate-400">Sasaran: RM 10,000</p>
                            </div>
                            <span className="text-[#00BFFF] font-mono text-sm">45%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full mb-4">
                            <div className="h-full bg-[#00BFFF] rounded-full w-[45%]"></div>
                        </div>
                        <button className="w-full py-2 bg-[#00BFFF] text-[#0A1E42] text-xs font-black rounded-xl hover:bg-[#87CEEB] transition-colors">CHIP-IN</button>
                    </div>
                </div>
            </div>

            {/* Berita Kariah */}
            <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-2">Berita Kariah</h4>
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3">
                    <i className="fa-solid fa-bullhorn text-red-400 mt-1"></i>
                    <div>
                        <p className="text-xs font-bold text-red-200">KEMATIAN KARIAH</p>
                        <p className="text-[10px] text-slate-400 leading-relaxed">Innalillahiwainnailaihirojiun. Allahyarham Tuan Haji Ahmad bin Bakar telah kembali ke rahmatullah. Solat jenazah di Masjid Al-Hidayah selepas Zohor hari ini.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-midnight-gradient items-center justify-start p-4 pt-8 pb-32 text-text-primary overflow-y-auto relative">
            {/* Global Pattern Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-pattern-dots-raudhah z-0"></div>

            {/* Header Toggle (Floating Glass Segmented Control) */}
            <div className="bg-[#0c224b]/60 backdrop-blur-xl p-1.5 rounded-2xl flex flex-wrap justify-center gap-2 mb-6 border border-white/10 relative z-10 shrink-0 shadow-lg mx-auto max-w-full">
                <button
                    onClick={() => setViewMode('QIBLA')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all border ${viewMode === 'QIBLA' ? 'bg-raudhah-teal/10 text-raudhah-teal border-raudhah-teal/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    <i className="fa-solid fa-compass mr-2"></i>Kiblat
                </button>
                <button
                    onClick={() => setViewMode('PRAYER')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all border ${viewMode === 'PRAYER' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    <i className="fa-solid fa-clock mr-2"></i>Waktu
                </button>
                <button
                    onClick={() => setViewMode('MASJID')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all border ${viewMode === 'MASJID' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    <i className="fa-solid fa-mosque mr-2"></i>Masjid
                </button>
                <button
                    onClick={() => setViewMode('ZAKAT')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all border ${viewMode === 'ZAKAT' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    <i className="fa-solid fa-calculator mr-2"></i>Zakat
                </button>
            </div>

            <AnimatePresence mode='wait'>
                {viewMode === 'QIBLA' ? (
                    <motion.div
                        key="qibla"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col items-center w-full"
                    >
                        {/* Main Content */}
                        <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
                            {isLoading && !error && !showTimeoutError && (
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="w-16 h-16 border-4 border-raudhah-teal border-t-transparent rounded-full mb-4"
                                    />
                                    <p className="text-slate-400">Mencari lokasi anda...</p>
                                </div>
                            )}

                            {isLoading && !error && showTimeoutError && (
                                <div className="flex flex-col items-center text-center p-6">
                                    <i className="fa-solid fa-triangle-exclamation text-amber-500 text-3xl mb-4"></i>
                                    <p className="text-slate-300 mb-4">Gagal mengesan lokasi secara automatik.</p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-6 py-2 bg-raudhah-teal text-black rounded-full font-bold hover:bg-raudhah-teal transition-colors"
                                    >
                                        Cuba Lagi
                                    </button>
                                </div>
                            )}

                            {showPermissionPrompt && (
                                <div className="text-center p-6 rounded-xl bg-surface/50 border border-red-500/30 shadow-lg max-w-sm">
                                    <p className="text-red-400 text-lg mb-4">Akses Diblokir!</p>
                                    <p className="text-slate-300 mb-6">
                                        Untuk mengesan arah kiblat, sila benarkan akses lokasi dan sensor gerakan pada peranti anda.
                                    </p>
                                    {error && <p className="text-sm text-red-300 mb-4">{error}</p>}
                                    {isDeviceOrientationSupported && (
                                        <button
                                            onClick={requestDeviceOrientationPermission}
                                            className="px-6 py-3 bg-raudhah-teal text-black font-bold rounded-lg shadow-md hover:bg-raudhah-teal transition-colors"
                                        >
                                            Benarkan Sensor Gerakan
                                        </button>
                                    )}
                                </div>
                            )}

                            {!isLoading && !error && (qiblaAngle !== null && deviceHeading !== null) ? (
                                <>
                                    {renderCompass()}
                                    <div className="text-center mt-8">
                                        <p className="text-slate-300 text-lg">
                                            Arah Kiblat: <span className="text-raudhah-teal font-bold">{qiblaAngle?.toFixed(1) || '--'}°</span>
                                        </p>
                                        <p className="text-slate-500 text-sm">
                                            Heading Anda: <span className="font-mono">{deviceHeading?.toFixed(1) || '--'}°</span>
                                        </p>
                                        {isPointingQibla && (
                                            <motion.p
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse" }}
                                                className="text-emerald-400 text-xl font-bold mt-4 animate-pulse"
                                            >
                                                <i className="fa-solid fa-check-circle mr-2"></i> TEPAT KE ARAH KIBLAT!
                                            </motion.p>
                                        )}
                                    </div>
                                </>
                            ) : (!isLoading && error && (
                                <div className="text-center p-6 rounded-xl bg-surface/50 border border-red-500/30 shadow-lg max-w-sm">
                                    <p className="text-red-400 text-lg mb-4">Ralat!</p>
                                    <p className="text-slate-300">{error}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : viewMode === 'PRAYER' ? (
                    <motion.div
                        key="prayer"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="w-full flex flex-col items-center"
                    >
                        {renderPrayerTimes()}
                    </motion.div>
                ) : viewMode === 'ZAKAT' ? (
                    <motion.div
                        key="zakat"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full flex flex-col items-center"
                    >
                        <ZakatCalculator />
                    </motion.div>
                ) : (
                    <motion.div
                        key="masjid"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full flex flex-col items-center"
                    >
                        {renderMasjidHub()}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Zone Selector Modal */}
            <AnimatePresence>
                {showZoneModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl max-h-[80vh] flex flex-col shadow-2xl"
                        >
                            <div className="p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center sticky top-0 bg-surface z-10 rounded-t-2xl">
                                <h3 className="text-lg font-bold text-text-primary">Pilih Zon (JAKIM)</h3>
                                <button onClick={() => setShowZoneModal(false)} className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-slate-400 hover:text-white" aria-label="Close Zone Selection">
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <div className="p-2 overflow-y-auto">
                                {JAKIM_ZONES.map((zone) => (
                                    <button
                                        key={zone.code}
                                        onClick={() => {
                                            setSelectedZone(zone.code);
                                            setShowZoneModal(false);
                                        }}
                                        className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${selectedZone === zone.code ? 'bg-raudhah-teal/10 border border-raudhah-teal/50' : 'hover:bg-slate-800 border border-transparent'}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className={`font-bold ${selectedZone === zone.code ? 'text-raudhah-teal' : 'text-slate-200'}`}>
                                                {zone.code} - {zone.state}
                                            </span>
                                            {selectedZone === zone.code && <i className="fa-solid fa-check text-raudhah-teal"></i>}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{zone.description}</p>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Footer Info */}
            <div className="mt-8 text-center text-slate-600 text-[10px]">
                {/* Only show Lat/Long if in Qibla mode */}
                {viewMode === 'QIBLA' && <p>Lokasi: {latitude?.toFixed(4) || '--'}, {longitude?.toFixed(4) || '--'}</p>}
                <p>Data: JAKIM E-Solat (v6.0)</p>
            </div>
        </div>
    );
};

export default Ibadah;

