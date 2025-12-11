import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion } from 'framer-motion';
import { IQRA_BOOKS_DATA, MOCK_PAGES, IqraBook } from './data';
import { IqraCell } from '../../types';
import IqraBookSelector from './IqraBookSelector';

// Configure PDF Worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface IqraPdfReaderProps {
    initialBookId?: string;
}

const IqraPdfReader: React.FC<IqraPdfReaderProps> = ({ initialBookId = 'iqra-1' }) => {
    const [currentBookId, setCurrentBookId] = useState(initialBookId);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [inputPage, setInputPage] = useState('1');
    const [isSmartMode, setIsSmartMode] = useState(false);

    const currentBook = IQRA_BOOKS_DATA.find(b => b.id === currentBookId) || IQRA_BOOKS_DATA[0];

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') changePage(1);
            if (e.key === 'ArrowLeft') changePage(-1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [pageNumber, numPages]);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1);
        setInputPage('1');
    };

    const changePage = (offset: number) => {
        const newPage = Math.min(Math.max(1, pageNumber + offset), numPages || 1);
        setPageNumber(newPage);
        setInputPage(newPage.toString());
    };

    const handlePageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const p = parseInt(inputPage);
        if (!isNaN(p) && p >= 1 && p <= (numPages || 1)) {
            setPageNumber(p);
        } else {
            setInputPage(pageNumber.toString());
        }
    };

    const handleCellClick = (cell: IqraCell) => {
        const audio = new Audio(cell.content.audioUrl);
        audio.play().catch(e => console.log("Audio play failed (mock)", e));
        alert(`Smart Cell: ${cell.content.transliteration} (${cell.content.arabic})`);
    };

    const renderSmartCells = () => {
        if (!isSmartMode) return null;
        const currentPageData = MOCK_PAGES[pageNumber];
        if (!currentPageData) return null;

        return currentPageData.cells.map(cell => (
            <motion.div
                key={cell.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(56, 189, 248, 0.3)' }}
                className="absolute border-2 border-sky-400/50 rounded-lg cursor-pointer flex items-center justify-center group z-10"
                style={{
                    left: `${cell.x}%`,
                    top: `${cell.y}%`,
                    width: `${cell.width}%`,
                    height: `${cell.height}%`,
                }}
                onClick={() => handleCellClick(cell)}
            >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {cell.content.transliteration}
                </div>
                <i className="fa-solid fa-volume-high text-sky-400 opacity-50 group-hover:opacity-100"></i>
            </motion.div>
        ));
    };

    return (
        <div className="h-full flex flex-col animate-fade-in gap-4">
            {/* Book Selector */}
            <IqraBookSelector currentBookId={currentBookId} onSelectBook={setCurrentBookId} />

            {/* PDF Viewer Container */}
            <div className="flex-1 bg-slate-950/50 rounded-3xl border border-slate-800 overflow-hidden relative flex flex-col items-center justify-center shadow-inner">
                {/* Background Texture */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"></div>

                <div className="w-full h-full overflow-auto flex justify-center items-start custom-scrollbar p-4 md:p-8 z-10">
                    <Document
                        file={currentBook.file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="flex flex-col items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                                <p className="text-slate-400 animate-pulse">Opening Book...</p>
                            </div>
                        }
                        error={
                            <div className="text-red-400 text-center p-8 bg-red-900/10 rounded-2xl border border-red-900/30">
                                <i className="fa-solid fa-triangle-exclamation text-4xl mb-4"></i>
                                <p className="font-bold">Failed to load PDF</p>
                                <p className="text-xs mt-2 text-slate-500">Please check your internet connection.</p>
                            </div>
                        }
                    >
                        <div 
                            className="shadow-2xl shadow-black/50 rounded-lg overflow-hidden transition-transform duration-200 ease-out relative" 
                            style={{ transform: `scale(${scale})` }}
                        >
                            <Page 
                                pageNumber={pageNumber} 
                                scale={1.0}
                                renderTextLayer={false} 
                                renderAnnotationLayer={false}
                                className="bg-white"
                            />
                            {renderSmartCells()}
                        </div>
                    </Document>
                </div>

                {/* Floating Controls Bar */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl pl-4 pr-2 py-2 rounded-full shadow-2xl border border-slate-700 flex items-center gap-4 z-20 transition-all hover:scale-105">
                    {/* Navigation */}
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => changePage(-1)} 
                            disabled={pageNumber <= 1}
                            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-primary hover:text-black text-white disabled:opacity-30 disabled:hover:bg-slate-800 disabled:hover:text-white transition-all flex items-center justify-center"
                            title="Previous Page (Left Arrow)"
                        >
                            <i className="fa-solid fa-chevron-left text-xs"></i>
                        </button>
                        
                        <form onSubmit={handlePageSubmit} className="flex items-center gap-1 bg-slate-950 rounded-lg px-2 py-1 border border-slate-800 focus-within:border-primary transition-colors">
                            <input 
                                type="text" 
                                value={inputPage}
                                onChange={(e) => setInputPage(e.target.value)}
                                className="w-8 bg-transparent text-center text-sm font-bold text-white outline-none"
                                aria-label="Page Number"
                                title="Page Number"
                            />
                            <span className="text-xs text-slate-500">/ {numPages || '--'}</span>
                        </form>

                        <button 
                            onClick={() => changePage(1)} 
                            disabled={pageNumber >= (numPages || 1)}
                            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-primary hover:text-black text-white disabled:opacity-30 disabled:hover:bg-slate-800 disabled:hover:text-white transition-all flex items-center justify-center"
                            title="Next Page (Right Arrow)"
                        >
                            <i className="fa-solid fa-chevron-right text-xs"></i>
                        </button>
                    </div>

                    <div className="w-px h-6 bg-slate-700"></div>

                    {/* Zoom Controls */}
                    <div className="flex items-center gap-1">
                        <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="w-8 h-8 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors" title="Zoom Out" aria-label="Zoom Out"><i className="fa-solid fa-minus text-xs"></i></button>
                        <button onClick={() => setScale(1.0)} className="text-xs font-mono text-slate-300 w-10 text-center hover:text-primary cursor-pointer" title="Reset Zoom">{Math.round(scale * 100)}%</button>
                        <button onClick={() => setScale(s => Math.min(2.0, s + 0.1))} className="w-8 h-8 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors" title="Zoom In" aria-label="Zoom In"><i className="fa-solid fa-plus text-xs"></i></button>
                    </div>

                    <div className="w-px h-6 bg-slate-700"></div>

                    {/* Smart Mode Toggle */}
                    <button 
                        onClick={() => setIsSmartMode(!isSmartMode)}
                        className={`h-8 px-3 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${isSmartMode ? 'bg-teal-500 text-black shadow-lg shadow-teal-500/20' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                        {isSmartMode ? 'Smart ON' : 'Smart OFF'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IqraPdfReader;
