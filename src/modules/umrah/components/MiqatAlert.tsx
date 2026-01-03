import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane, Clock, Bell, MapPin, AlertTriangle, Play, Pause, RotateCcw } from 'lucide-react';

interface MiqatInfo {
    name: string;
    nameAr: string;
    forCountries: string[];
}

const MIQAT_LOCATIONS: MiqatInfo[] = [
    { name: 'Yalamlam', nameAr: 'يلملم', forCountries: ['Malaysia', 'Indonesia', 'Brunei', 'Singapore'] },
    { name: 'Qarnul Manazil', nameAr: 'قرن المنازل', forCountries: ['Najd', 'UAE', 'Oman'] },
    { name: 'Juhfah', nameAr: 'الجحفة', forCountries: ['Syria', 'Jordan', 'Egypt', 'Morocco'] },
    { name: 'Dhul Hulayfah', nameAr: 'ذو الحليفة', forCountries: ['Madinah'] },
    { name: 'Dhatu Irq', nameAr: 'ذات عرق', forCountries: ['Iraq', 'Iran'] },
];

const MiqatAlert: React.FC = () => {
    const [flightNumber, setFlightNumber] = useState('');
    const [selectedMiqat, setSelectedMiqat] = useState<MiqatInfo>(MIQAT_LOCATIONS[0]);
    const [departureTime, setDepartureTime] = useState('');
    const [estimatedMiqatTime, setEstimatedMiqatTime] = useState<Date | null>(null);
    const [timerActive, setTimerActive] = useState(false);
    const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [alertPhase, setAlertPhase] = useState<'none' | '1hour' | '30min' | '5min' | 'miqat'>('none');

    // Average flight times from major airports to Yalamlam crossing
    const AVERAGE_MIQAT_TIMES: Record<string, number> = {
        'MH': 8 * 60, // Malaysia Airlines - approximately 8 hours
        'SV': 7 * 60, // Saudia - approximately 7 hours
        'EK': 6 * 60, // Emirates - approximately 6 hours
        'default': 7.5 * 60, // Default average
    };

    const calculateMiqatTime = () => {
        if (!departureTime) return;

        const departure = new Date(departureTime);
        const airlineCode = flightNumber.substring(0, 2).toUpperCase();
        const flightDuration = AVERAGE_MIQAT_TIMES[airlineCode] || AVERAGE_MIQAT_TIMES['default'];

        // Estimate Miqat crossing (about 80% into the flight for Yalamlam)
        const miqatOffset = flightDuration * 0.8;
        const miqatTime = new Date(departure.getTime() + miqatOffset * 60 * 1000);

        setEstimatedMiqatTime(miqatTime);
        setTimerActive(true);
        setAlertPhase('none');
    };

    // Countdown timer effect
    useEffect(() => {
        if (!timerActive || !estimatedMiqatTime) return;

        const interval = setInterval(() => {
            const now = new Date();
            const diff = estimatedMiqatTime.getTime() - now.getTime();

            if (diff <= 0) {
                setCountdown({ hours: 0, minutes: 0, seconds: 0 });
                setAlertPhase('miqat');
                clearInterval(interval);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setCountdown({ hours, minutes, seconds });

            // Set alert phases
            const minutesRemaining = diff / (1000 * 60);
            if (minutesRemaining <= 5 && alertPhase !== 'miqat') {
                setAlertPhase('5min');
            } else if (minutesRemaining <= 30 && minutesRemaining > 5 && alertPhase !== '5min') {
                setAlertPhase('30min');
            } else if (minutesRemaining <= 60 && minutesRemaining > 30 && alertPhase !== '30min') {
                setAlertPhase('1hour');
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timerActive, estimatedMiqatTime, alertPhase]);

    const resetTimer = () => {
        setTimerActive(false);
        setEstimatedMiqatTime(null);
        setCountdown({ hours: 0, minutes: 0, seconds: 0 });
        setAlertPhase('none');
    };

    const getAlertMessage = () => {
        switch (alertPhase) {
            case '1hour':
                return { icon: '⏰', title: '1 Jam Lagi!', message: 'Sila bangun dan bersedia untuk mandi sunat atau berwuduk.', color: 'amber' };
            case '30min':
                return { icon: '👔', title: '30 Minit Lagi!', message: 'Pakai kain Ihram sekarang.', color: 'orange' };
            case '5min':
                return { icon: '🤲', title: '5 Minit Lagi!', message: 'Bersedia untuk berniat Ihram.', color: 'red' };
            case 'miqat':
                return { icon: '🕋', title: 'ANDA DI MIQAT!', message: 'Lafazkan Niat Ihram SEKARANG!', color: 'cyan' };
            default:
                return null;
        }
    };

    const alertInfo = getAlertMessage();

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                    <Plane className="text-blue-400" size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">In-Flight Miqat Alert</h3>
                    <p className="text-xs text-slate-400">Peringatan sebelum melintasi miqat</p>
                </div>
            </div>

            {/* Alert Banner */}
            {alertInfo && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-xl border ${alertPhase === 'miqat'
                        ? 'bg-cyan-500/20 border-cyan-500 animate-pulse'
                        : alertPhase === '5min'
                            ? 'bg-red-500/20 border-red-500'
                            : alertPhase === '30min'
                                ? 'bg-orange-500/20 border-orange-500'
                                : 'bg-amber-500/20 border-amber-500'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{alertInfo.icon}</span>
                        <div>
                            <p className={`font-bold text-lg ${alertPhase === 'miqat' ? 'text-cyan-400' :
                                alertPhase === '5min' ? 'text-red-400' :
                                    alertPhase === '30min' ? 'text-orange-400' :
                                        'text-amber-400'
                                }`}>{alertInfo.title}</p>
                            <p className="text-white">{alertInfo.message}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Miqat Selection */}
            <div className="space-y-3">
                <label className="text-sm text-slate-400">Pilih Miqat (untuk jemaah dari mana):</label>
                <div className="grid grid-cols-2 gap-2">
                    {MIQAT_LOCATIONS.map((miqat) => (
                        <button
                            key={miqat.name}
                            onClick={() => setSelectedMiqat(miqat)}
                            className={`p-3 rounded-lg border text-left transition-all ${selectedMiqat.name === miqat.name
                                ? 'bg-cyan-500/20 border-cyan-500'
                                : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                                }`}
                        >
                            <p className={`font-medium ${selectedMiqat.name === miqat.name ? 'text-cyan-400' : 'text-white'}`}>
                                {miqat.name}
                            </p>
                            <p className="text-xs text-amber-400 font-arabic">{miqat.nameAr}</p>
                            <p className="text-xs text-slate-500 mt-1">{miqat.forCountries.slice(0, 2).join(', ')}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Flight Details */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs text-slate-400 mb-1 block">No. Penerbangan</label>
                    <div className="relative">
                        <Plane className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            value={flightNumber}
                            onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                            placeholder="MH0066"
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 uppercase"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs text-slate-400 mb-1 block">Masa Berlepas</label>
                    <input
                        type="datetime-local"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                        aria-label="Masa berlepas penerbangan"
                    />
                </div>
            </div>

            {/* Start/Stop Button */}
            <div className="flex gap-2">
                {!timerActive ? (
                    <button
                        onClick={calculateMiqatTime}
                        disabled={!departureTime}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                    >
                        <Bell size={18} />
                        Aktifkan Alert
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => setTimerActive(false)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-all"
                        >
                            <Pause size={18} />
                            Pause
                        </button>
                        <button
                            onClick={resetTimer}
                            className="p-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                            aria-label="Set semula pemasa"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </>
                )}
            </div>

            {/* Countdown Display */}
            {timerActive && estimatedMiqatTime && (
                <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                    <p className="text-sm text-slate-400 mb-2">Anggaran masa ke Miqat {selectedMiqat.name}</p>
                    <div className="flex items-center justify-center gap-2">
                        <div className="bg-slate-900 rounded-lg p-3 min-w-[60px]">
                            <p className="text-3xl font-bold text-cyan-400">{String(countdown.hours).padStart(2, '0')}</p>
                            <p className="text-xs text-slate-500">Jam</p>
                        </div>
                        <span className="text-2xl text-cyan-400">:</span>
                        <div className="bg-slate-900 rounded-lg p-3 min-w-[60px]">
                            <p className="text-3xl font-bold text-cyan-400">{String(countdown.minutes).padStart(2, '0')}</p>
                            <p className="text-xs text-slate-500">Minit</p>
                        </div>
                        <span className="text-2xl text-cyan-400">:</span>
                        <div className="bg-slate-900 rounded-lg p-3 min-w-[60px]">
                            <p className="text-3xl font-bold text-cyan-400">{String(countdown.seconds).padStart(2, '0')}</p>
                            <p className="text-xs text-slate-500">Saat</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                        <MapPin size={12} className="inline mr-1" />
                        Anggaran tiba di miqat: {estimatedMiqatTime.toLocaleString('ms-MY')}
                    </p>
                </div>
            )}

            {/* Niat Ihram */}
            {alertPhase === 'miqat' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/50 rounded-xl"
                >
                    <h4 className="text-cyan-400 font-semibold mb-2">📿 Niat Ihram Umrah</h4>
                    <p className="text-xl text-white font-arabic text-right leading-relaxed mb-2">
                        لَبَّيْكَ اللَّهُمَّ عُمْرَةً
                    </p>
                    <p className="text-sm text-slate-300">Labbaikallahumma 'umratan</p>
                    <p className="text-xs text-slate-400 mt-2">"Aku penuhi panggilan-Mu, Ya Allah, untuk Umrah"</p>
                </motion.div>
            )}

            {/* Tips */}
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-xs text-amber-400">
                    💡 <strong>Tips:</strong> Aktifkan alert 1 jam sebelum anggaran melintasi miqat. Pastikan anda sudah mandi sunat dan bersiap dengan kain ihram.
                </p>
            </div>
        </div>
    );
};

export default MiqatAlert;
