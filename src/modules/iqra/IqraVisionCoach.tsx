import React from 'react';
import { MOCK_IQRA_PAGE_1 } from './data';
import { IqraCell } from '../../types';

interface IqraVisionCoachProps {
    onClose: () => void;
}

const IqraVisionCoach: React.FC<IqraVisionCoachProps> = ({ onClose }) => {
    const handleCellClick = (cell: IqraCell) => {
        const audio = new Audio(cell.content.audioUrl);
        audio.play().catch(e => console.log("Audio play failed (mock)", e));
    };

    return (
        <div className="h-full flex flex-col relative bg-black">
            <div className="absolute inset-0 overflow-hidden">
                <img 
                    src="/images/iqra-book-open.jpg" 
                    alt="Camera Feed" 
                    className="w-full h-full object-cover opacity-60"
                    onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x800/1e293b/white?text=Camera+Feed+Simulation';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
                
                {/* AR Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] border-2 border-teal-500/50 rounded-3xl shadow-[0_0_50px_rgba(20,184,166,0.3)] animate-pulse">
                    <div className="absolute top-4 left-4 bg-teal-500 text-black text-xs font-bold px-2 py-1 rounded animate-bounce">
                        <i className="fa-solid fa-expand mr-1"></i> Tracking Page 1
                    </div>
                    
                    {/* AR Smart Cells */}
                    {MOCK_IQRA_PAGE_1.cells.map((cell) => (
                        <div
                            key={cell.id}
                            className="absolute border-2 border-dashed border-teal-400/70 bg-teal-500/10 hover:bg-teal-500/30 cursor-pointer transition-all rounded-lg flex items-center justify-center group"
                            style={{
                                left: `${cell.x}%`,
                                top: `${cell.y}%`,
                                width: `${cell.width}%`,
                                height: `${cell.height}%`,
                            }}
                            onClick={() => handleCellClick(cell)}
                        >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-teal-400 text-sm font-bold px-3 py-1 rounded-full border border-teal-500/30 whitespace-nowrap pointer-events-none backdrop-blur-md">
                                <i className="fa-solid fa-volume-high mr-2"></i>
                                {cell.content.transliteration}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AR Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center z-10">
                <p className="text-white text-center mb-6 font-medium text-shadow-lg">
                    Point your camera at <span className="text-teal-400 font-bold">Iqra' Volume 1, Page 1</span>
                </p>
                <div className="flex gap-4">
                    <button 
                        className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center text-xl shadow-xl hover:scale-110 transition-transform" 
                        title="Capture Image" 
                        aria-label="Capture Image"
                    >
                        <i className="fa-solid fa-camera"></i>
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-14 h-14 rounded-full bg-slate-800/80 backdrop-blur text-white flex items-center justify-center text-xl border border-slate-600 hover:bg-slate-700 transition-colors"
                        title="Close AR Mode"
                        aria-label="Close AR Mode"
                    >
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IqraVisionCoach;
