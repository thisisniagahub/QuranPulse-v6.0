import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Volume2, Save, Edit2, X, Check, Phone, Hotel, CreditCard, Droplets } from 'lucide-react';
import { EmergencyInfo } from '../types';

const STORAGE_KEY = 'quranpulse_umrah_emergency';

const safeLoadEmergencyInfo = (): EmergencyInfo | null => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
};

const safeSaveEmergencyInfo = (info: EmergencyInfo): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
    } catch {
        // Ignore storage errors
    }
};

const DEFAULT_INFO: EmergencyInfo = {
    hotelName: '',
    hotelAddress: '',
    gateNumber: '',
    passportNumber: '',
    visaNumber: '',
    emergencyContact: '',
    bloodType: '',
};

const EmergencyCard: React.FC = () => {
    const [info, setInfo] = useState<EmergencyInfo>(DEFAULT_INFO);
    const [isEditing, setIsEditing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const saved = safeLoadEmergencyInfo();
        if (saved) {
            setInfo(saved);
        }
    }, []);

    // Save to localStorage
    const handleSave = () => {
        safeSaveEmergencyInfo(info);
        setIsEditing(false);
    };

    // Generate Arabic text for SOS
    const generateArabicText = (): string => {
        const hotelText = info.hotelName || '[Nama Hotel]';
        const gateText = info.gateNumber || '[Nombor Pintu]';

        return `أنا حاج من ماليزيا / إندونيسيا
أنا ضائع - أرجو المساعدة
فندقي: ${hotelText}
بوابة: ${gateText}

أرجو مساعدتي في الوصول إلى فندقي`;
    };

    const generateMalayText = (): string => {
        const hotelText = info.hotelName || '[Nama Hotel]';
        const gateText = info.gateNumber || '[Nombor Pintu]';

        return `Saya jemaah dari Malaysia/Indonesia.
Saya sesat - Tolong bantu saya.
Hotel saya: ${hotelText}
Pintu: ${gateText}

Sila bantu tunjukkan arah ke hotel saya.`;
    };

    // Text-to-Speech
    const speakArabic = () => {
        if ('speechSynthesis' in window) {
            setIsSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(generateArabicText());
            utterance.lang = 'ar-SA';
            utterance.rate = 0.8;
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            speechSynthesis.speak(utterance);
        }
    };

    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-red-600 animate-pulse">
                        <AlertCircle className="text-white" size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Kad Kecemasan</h3>
                        <p className="text-xs text-slate-400">SOS Card dalam Bahasa Arab</p>
                    </div>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                        aria-label="Edit maklumat peribadi"
                    >
                        <Edit2 size={18} />
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="p-2 rounded-lg bg-slate-800 text-red-400 hover:bg-red-500/20 transition-all"
                            aria-label="Batal edit"
                        >
                            <X size={18} />
                        </button>
                        <button
                            onClick={handleSave}
                            className="p-2 rounded-lg bg-raudhah-teal text-black hover:bg-raudhah-teal transition-all"
                            aria-label="Simpan maklumat"
                        >
                            <Check size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* SOS Display Card */}
            <motion.div
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 to-red-700 p-6 shadow-lg shadow-red-500/20"
                animate={isSpeaking ? { scale: [1, 1.02, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_white_0%,_transparent_50%)]" />
                </div>

                <div className="relative z-10">
                    {/* Title */}
                    <div className="text-center mb-4">
                        <h4 className="text-2xl font-bold text-white mb-1">🆘 أنا ضائع</h4>
                        <p className="text-red-200 text-sm">ANA DA'I - SAYA SESAT</p>
                    </div>

                    {/* Arabic Text */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                        <p className="text-xl text-white font-arabic text-right leading-loose whitespace-pre-line">
                            {generateArabicText()}
                        </p>
                    </div>

                    {/* Malay Translation */}
                    <div className="bg-black/20 rounded-lg p-3 mb-4">
                        <p className="text-sm text-red-100 whitespace-pre-line">
                            {generateMalayText()}
                        </p>
                    </div>

                    {/* Speak Button */}
                    <button
                        onClick={isSpeaking ? stopSpeaking : speakArabic}
                        className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-lg transition-all ${isSpeaking
                            ? 'bg-white text-red-600 animate-pulse'
                            : 'bg-white/90 text-red-600 hover:bg-white'
                            }`}
                    >
                        <Volume2 size={24} className={isSpeaking ? 'animate-bounce' : ''} />
                        {isSpeaking ? 'SEDANG BERCAKAP...' : 'TEKAN UNTUK BERCAKAP ARAB'}
                    </button>
                </div>
            </motion.div>

            {/* Info Form */}
            {isEditing ? (
                <div className="space-y-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <p className="text-sm font-medium text-white mb-2">Maklumat Peribadi</p>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Nama Hotel</label>
                            <div className="relative">
                                <Hotel className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    value={info.hotelName}
                                    onChange={(e) => setInfo({ ...info, hotelName: e.target.value })}
                                    placeholder="cth: Hilton Makkah"
                                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-raudhah-teal"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">No. Pintu/Gate</label>
                            <input
                                type="text"
                                value={info.gateNumber}
                                onChange={(e) => setInfo({ ...info, gateNumber: e.target.value })}
                                placeholder="cth: King Abdul Aziz Gate 79"
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-raudhah-teal"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">No. Pasport</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    value={info.passportNumber}
                                    onChange={(e) => setInfo({ ...info, passportNumber: e.target.value })}
                                    placeholder="A12345678"
                                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-raudhah-teal"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">No. Visa</label>
                            <input
                                type="text"
                                value={info.visaNumber}
                                onChange={(e) => setInfo({ ...info, visaNumber: e.target.value })}
                                placeholder="Visa Number"
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-raudhah-teal"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">No. Telefon Kecemasan</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="tel"
                                    value={info.emergencyContact}
                                    onChange={(e) => setInfo({ ...info, emergencyContact: e.target.value })}
                                    placeholder="+60123456789"
                                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-raudhah-teal"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Jenis Darah</label>
                            <div className="relative">
                                <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <select
                                    value={info.bloodType}
                                    onChange={(e) => setInfo({ ...info, bloodType: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-raudhah-teal appearance-none"
                                    aria-label="Pilih jenis darah"
                                >
                                    <option value="">Pilih</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 mb-1 block">Alamat Hotel</label>
                        <textarea
                            value={info.hotelAddress}
                            onChange={(e) => setInfo({ ...info, hotelAddress: e.target.value })}
                            placeholder="Alamat penuh hotel..."
                            rows={2}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-raudhah-teal resize-none"
                        />
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Save size={12} /> Data disimpan secara offline dalam telefon anda
                    </p>
                </div>
            ) : (
                /* Quick Info Display */
                info.hotelName && (
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-slate-800/50 rounded-lg">
                            <p className="text-xs text-slate-500">Hotel</p>
                            <p className="text-sm text-white font-medium">{info.hotelName}</p>
                        </div>
                        <div className="p-3 bg-slate-800/50 rounded-lg">
                            <p className="text-xs text-slate-500">Gate</p>
                            <p className="text-sm text-white font-medium">{info.gateNumber || '-'}</p>
                        </div>
                        <div className="p-3 bg-slate-800/50 rounded-lg">
                            <p className="text-xs text-slate-500">Pasport</p>
                            <p className="text-sm text-white font-medium">{info.passportNumber || '-'}</p>
                        </div>
                        <div className="p-3 bg-slate-800/50 rounded-lg">
                            <p className="text-xs text-slate-500">Kecemasan</p>
                            <p className="text-sm text-white font-medium">{info.emergencyContact || '-'}</p>
                        </div>
                    </div>
                )
            )}

            {/* Emergency Numbers */}
            <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-xs text-slate-500 mb-2">Nombor Kecemasan Arab Saudi:</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                        <p className="text-lg font-bold text-red-400">911</p>
                        <p className="text-xs text-slate-400">Polis/Kecemasan</p>
                    </div>
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <p className="text-lg font-bold text-blue-400">997</p>
                        <p className="text-xs text-slate-400">Ambulans</p>
                    </div>
                    <div className="p-2 bg-green-500/10 rounded-lg">
                        <p className="text-lg font-bold text-green-400">998</p>
                        <p className="text-xs text-slate-400">Bomba</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyCard;
