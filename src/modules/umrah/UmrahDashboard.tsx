import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Church, Calculator, CheckSquare, AlertTriangle, AlertCircle,
    Plane, MapPin, Target, Music, ArrowLeft, Menu
} from 'lucide-react';
import { UmrahTab } from './types';

// Import all components
import MutawwifAudio from './components/MutawwifAudio';
import DamCalculator from './components/DamCalculator';
import PrepChecklist from './components/PrepChecklist';
import IhramChecker from './components/IhramChecker';
import EmergencyCard from './components/EmergencyCard';
import MiqatAlert from './components/MiqatAlert';
import RaudhahGuide from './components/RaudhahGuide';
import TawafTracker from './components/TawafTracker';

interface TabItem {
    id: UmrahTab;
    label: string;
    icon: React.ReactNode;
    color: string;
    description: string;
}

const TABS: TabItem[] = [
    { id: 'mutawwif', label: 'Mutawwif', icon: <Music size={20} />, color: 'teal', description: 'Audio Doa Tawaf/Sa\'i' },
    { id: 'tawaf', label: 'Tawaf Tracker', icon: <Target size={20} />, color: 'blue', description: 'Kira pusingan automatik' },
    { id: 'dam', label: 'Kalkulator Dam', icon: <Calculator size={20} />, color: 'red', description: 'Kira denda pelanggaran' },
    { id: 'checklist', label: 'Checklist', icon: <CheckSquare size={20} />, color: 'green', description: 'Senarai persiapan' },
    { id: 'ihram', label: 'Larangan Ihram', icon: <AlertTriangle size={20} />, color: 'orange', description: '10 larangan utama' },
    { id: 'sos', label: 'SOS Card', icon: <AlertCircle size={20} />, color: 'red', description: 'Kad kecemasan Arab' },
    { id: 'miqat', label: 'Miqat Alert', icon: <Plane size={20} />, color: 'sky', description: 'Peringatan in-flight' },
    { id: 'raudhah', label: 'Raudhah', icon: <Church size={20} />, color: 'emerald', description: 'Panduan & Nusuk tutorial' },
];

const UmrahDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<UmrahTab | null>(null);
    const [showMenu, setShowMenu] = useState(true);

    const renderContent = () => {
        switch (activeTab) {
            case 'mutawwif':
                return <MutawwifAudio />;
            case 'tawaf':
                return <TawafTracker />;
            case 'dam':
                return <DamCalculator />;
            case 'checklist':
                return <PrepChecklist />;
            case 'ihram':
                return <IhramChecker />;
            case 'sos':
                return <EmergencyCard />;
            case 'miqat':
                return <MiqatAlert />;
            case 'raudhah':
                return <RaudhahGuide />;
            default:
                return null;
        }
    };

    const getColorClass = (color: string) => {
        const colors: Record<string, { bg: string; border: string; text: string }> = {
            teal: { bg: 'bg-raudhah-teal/10', border: 'border-raudhah-teal/50', text: 'text-raudhah-teal' },
            blue: { bg: 'bg-teal-500/20', border: 'border-teal-500/50', text: 'text-teal-400' },
            red: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400' },
            green: { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400' },
            orange: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400' },
            sky: { bg: 'bg-teal-500/20', border: 'border-sky-500/50', text: 'text-teal-400' },
            emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400' },
        };
        return colors[color] || colors.teal;
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-lg border-b border-slate-800">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {activeTab && (
                            <button
                                onClick={() => {
                                    setActiveTab(null);
                                    setShowMenu(true);
                                }}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all"
                                aria-label="Kembali ke menu utama"
                            >
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <span className="text-2xl">🕋</span>
                                <span>Umrah<span className="text-raudhah-teal">Pulse</span></span>
                            </h1>
                            <p className="text-xs text-slate-500">Pembantu Pintar Jemaah</p>
                        </div>
                    </div>
                    {activeTab && (
                        <button
                            onClick={() => setShowMenu(true)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all"
                            aria-label="Buka menu"
                        >
                            <Menu size={20} />
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-4 py-6">
                <AnimatePresence mode="wait">
                    {!activeTab ? (
                        /* Menu Grid */
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {/* Hero Section */}
                            <div className="text-center py-8">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-6xl mb-4"
                                >
                                    🕋
                                </motion.div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Selamat Datang ke <span className="text-raudhah-teal">UmrahPulse</span>
                                </h2>
                                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                                    Pembantu digital pintar untuk jemaah Umrah. Dari persiapan hingga selesai ibadah.
                                </p>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="p-3 bg-slate-800/50 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-raudhah-teal">7</p>
                                    <p className="text-xs text-slate-500">Pusingan Tawaf</p>
                                </div>
                                <div className="p-3 bg-slate-800/50 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-green-400">7</p>
                                    <p className="text-xs text-slate-500">Perjalanan Sa'i</p>
                                </div>
                                <div className="p-3 bg-slate-800/50 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-amber-400">10</p>
                                    <p className="text-xs text-slate-500">Larangan Ihram</p>
                                </div>
                            </div>

                            {/* Features Grid */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Ciri-ciri Utama</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {TABS.map((tab, index) => {
                                        const colorClass = getColorClass(tab.color);
                                        return (
                                            <motion.button
                                                key={tab.id}
                                                onClick={() => {
                                                    setActiveTab(tab.id);
                                                    setShowMenu(false);
                                                }}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={`p-4 rounded-xl border ${colorClass.bg} ${colorClass.border} text-left hover:scale-[1.02] transition-all group`}
                                            >
                                                <div className={`w-10 h-10 rounded-lg ${colorClass.bg} flex items-center justify-center ${colorClass.text} mb-3 group-hover:scale-110 transition-transform`}>
                                                    {tab.icon}
                                                </div>
                                                <p className="text-white font-medium">{tab.label}</p>
                                                <p className="text-xs text-slate-500 mt-1">{tab.description}</p>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Bottom Tips */}
                            <div className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/30 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">💡</span>
                                    <div>
                                        <p className="text-amber-400 font-medium text-sm">Tips Umrah 2026</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Pastikan anda telah mendaftar akaun Nusuk dan memuat turun aplikasinya sebelum berlepas. QR Code daripada Nusuk diperlukan untuk masuk ke Raudhah.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* Active Tab Content */
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {renderContent()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Bottom Navigation (when viewing content) */}
            {activeTab && (
                <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-slate-800 safe-area-pb">
                    <div className="max-w-2xl mx-auto px-2 py-2 flex gap-1 overflow-x-auto scrollbar-hide">
                        {TABS.map((tab) => {
                            const colorClass = getColorClass(tab.color);
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${isActive
                                        ? `${colorClass.bg} ${colorClass.text}`
                                        : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    {tab.icon}
                                    <span className="text-[10px] whitespace-nowrap">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </nav>
            )}
        </div>
    );
};

export default UmrahDashboard;
