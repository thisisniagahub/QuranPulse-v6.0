import React from 'react';

interface LessonCardProps {
    title: string;
    pdfUrl: string;
    progress?: number; // 0-100
    onPrev?: () => void;
    onNext?: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ title, pdfUrl, progress = 0, onPrev, onNext }) => {
    return (
        <div className="flex flex-col items-center p-6 bg-gradient-to-br from-[#0a0a2a] to-[#001133] rounded-2xl shadow-neon backdrop-blur-md">
            <h1 className="text-3xl font-display text-white mb-4 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
                {title}
            </h1>
            {progress > 0 && (
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
                    <div
                        className="h-full bg-cyan-400 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            )}
            <div className="w-full h-96 bg-white bg-opacity-5 rounded-lg border border-cyan-400/30 backdrop-blur-sm flex items-center justify-center mb-4">
                {/* PDF placeholder – replace with actual viewer when integrated */}
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">
                    Open PDF
                </a>
            </div>
            <div className="flex w-full justify-between">
                <button
                    onClick={onPrev}
                    disabled={!onPrev}
                    className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ◀ Prev
                </button>
                <button
                    onClick={onNext}
                    disabled={!onNext}
                    className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next ▶
                </button>
            </div>
        </div>
    );
};

export default LessonCard;
