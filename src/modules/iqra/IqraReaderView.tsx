import React from 'react';
import { motion } from 'framer-motion';
import { getIqraVolume } from './data/master-index';
import { IqraPageStrict } from './data/iqra-1-strict';

interface IqraReaderViewProps {
    volume?: number;
    pageIndex: number;
    onBack: () => void;
    onNext: () => void;
    onPrev: () => void;
}

const IqraReaderView: React.FC<IqraReaderViewProps> = ({ volume = 1, pageIndex, onBack, onNext, onPrev }) => {
    // Navigate strictly using the Master Data
    const volumeData = getIqraVolume(volume);
    const currentPage = volumeData[pageIndex];

    if (!currentPage) return null;

    // Filter rows
    const headerRow = currentPage.grid.find(r => r.baris === 'Header' || r.baris === 'Title');
    const contentRows = currentPage.grid.filter(r => r.baris !== 'Header' && r.baris !== 'Title');

    // Helper to parse space-separated items
    const parseItems = (str: string) => str ? str.trim().split(/\s+/).filter(Boolean) : [];

    const displayPageNum = currentPage.page;

    return (
        <div className="flex flex-col h-full w-full bg-[#f8fafc] dark:bg-[#0f172a] text-slate-700 dark:text-slate-200 font-sans transition-colors duration-300 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuBUc_aditlBEEpHt9VHPimbDj_f9t9yXyiCzJhJwGhbWvJgDNUdNQCMCz_ZonK-6fh9hW80WpUkeUAVCmi1tOsB2oSSqgc2_CCyrgcoIPPvlU44cPTPrqQIejUvBU9tncsIWK8BAwU6zEyziIJBEa8bbY9yPjReLcGXo2M1h-IT1e2V8X_z6tXM55nW1vRo5FyBImhhA9A1mYlbWdY0LMBfgZ_rjBC0NdxS-kvFhdoJ8YIr28S0OkQo5HOQIey6I6RjvtZD80S0nxA')] bg-repeat" />

            {/* Navbar */}
            <nav className="fixed top-0 w-full max-w-5xl left-0 right-0 mx-auto bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm z-50 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-4">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-2xl">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold text-slate-800 dark:text-white">Iqra {volume} - Page {displayPageNum}</h1>
                <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-[#00BFFF]">
                    <span className="material-icons-round text-2xl">settings</span>
                </button>
            </nav>

            {/* Main Content */}
            <main className="flex-1 pt-20 pb-24 px-4 overflow-y-auto w-full max-w-5xl mx-auto z-10 scroll-smooth no-scrollbar">

                {/* Info Box */}
                {currentPage.focus && (
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm mb-6 border-l-4 border-[#00BFFF]">
                        <div className="flex items-start gap-3">
                            <span className="material-icons-round text-[#00BFFF] mt-1">info</span>
                            <div className="space-y-2">
                                <p className="text-sm font-semibold uppercase leading-relaxed text-slate-700 dark:text-slate-200">
                                    {currentPage.focus}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Hero Section */}
                    {headerRow && (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00BFFF]/20 via-[#00BFFF] to-[#00BFFF]/20"></div>

                            {/* Hero Two-Column Layout */}
                            <div className="flex items-center justify-around w-full">
                                {/* Visual Right Side - Mapped to KIRI data */}
                                <div className="flex flex-row-reverse justify-center gap-4 flex-1">
                                    {parseItems(headerRow.kiri).map((text, idx) => (
                                        <button key={`h-r-${idx}`} className="w-24 h-24 bg-[#00BFFF]/5 dark:bg-[#00BFFF]/10 rounded-full flex items-center justify-center border-2 border-transparent hover:border-[#00BFFF]/30 transition-all shadow-sm active:scale-95">
                                            <span className="font-arabic text-6xl text-red-500 mb-2 inline-block mt-2">{text}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Divider */}
                                {(headerRow.kanan && headerRow.kiri) && (
                                    <div className="h-20 w-px bg-slate-200 dark:bg-slate-700 mx-4"></div>
                                )}

                                {/* Visual Left Side - Mapped to KANAN data */}
                                <div className="flex flex-row-reverse justify-center gap-4 flex-1">
                                    {parseItems(headerRow.kanan).map((text, idx) => (
                                        <button key={`h-l-${idx}`} className="w-24 h-24 bg-[#00BFFF]/5 dark:bg-[#00BFFF]/10 rounded-full flex items-center justify-center border-2 border-transparent hover:border-[#00BFFF]/30 transition-all shadow-sm active:scale-95">
                                            <span className="font-arabic text-6xl text-red-500 mb-2 inline-block mt-2">{text}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Exercise Grid - Book Style (Two Columns) */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm divide-y divide-slate-100 dark:divide-slate-700">
                        {contentRows.map((row, rowIdx) => (
                            <div key={rowIdx} className="p-4 flex items-center justify-between min-h-[5rem]">
                                {/* 
                                   Visual Layout:
                                   [ Right Column (KIRI Data) ]   |   [ Left Column (KANAN Data) ]
                                   
                                   Reason: User confirmed "Alif starts from Right". 
                                   In JSON Page 3: Kiri="Alif..", Kanan="Ba..".
                                   So we map KIRI data to the Visual Right container.
                                */}
                                <div className="flex flex-row-reverse w-full items-center">

                                    {/* Visual Right Container (Mapped to KIRI data) */}
                                    <div className="flex-1 flex flex-row-reverse justify-around items-center px-2">
                                        {parseItems(row.kiri).map((text, i) => (
                                            <button key={`r-${i}`} className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors active:scale-90 duration-200">
                                                <span className="font-arabic text-4xl md:text-5xl text-black dark:text-white mt-2">{text}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Divider (Center) */}
                                    <div className="h-12 w-px bg-slate-200 dark:bg-slate-700 mx-2 shrink-0"></div>

                                    {/* Visual Left Container (Mapped to KANAN data) */}
                                    <div className="flex-1 flex flex-row-reverse justify-around items-center px-2">
                                        {parseItems(row.kanan).map((text, i) => (
                                            <button key={`l-${i}`} className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors active:scale-90 duration-200">
                                                <span className="font-arabic text-4xl md:text-5xl text-black dark:text-white mt-2">{text}</span>
                                            </button>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Bottom Controls */}
            <div className="fixed bottom-0 w-full max-w-5xl left-0 right-0 mx-auto bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 py-4 z-40 pb-safe">
                <div className="flex items-center justify-between">
                    <button
                        onClick={onPrev}
                        disabled={pageIndex === 0}
                        className="p-3 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                    >
                        <span className="material-icons-round">chevron_left</span>
                    </button>

                    <button className="flex-1 mx-4 bg-[#00BFFF] text-black h-12 rounded-xl font-bold shadow-lg shadow-[#00BFFF]/30 flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-[#00BFFF]/90">
                        <span className="material-icons-round">play_arrow</span>
                        <span>Play All</span>
                    </button>

                    <button
                        onClick={onNext}
                        disabled={pageIndex >= volumeData.length - 1}
                        className="p-3 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                    >
                        <span className="material-icons-round">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IqraReaderView;
