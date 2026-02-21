/**
 * MakhrajVisualizer - SVG-based mouth/tongue diagram for articulation feedback
 * Shows correct articulation points for Arabic letters
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface MakhrajPoint {
    id: string;
    nameAr: string;
    nameMs: string;
    letters: string[];
    path: string; // SVG path for highlighting
    description: string;
}

// Makhraj articulation points
const MAKHRAJ_POINTS: MakhrajPoint[] = [
    {
        id: 'halq-adna',
        nameAr: 'أدنى الحلق',
        nameMs: 'Tenggorok Atas',
        letters: ['غ', 'خ'],
        path: 'M 80 60 Q 90 50 100 60',
        description: 'Bahagian atas kerongkong',
    },
    {
        id: 'halq-wasat',
        nameAr: 'وسط الحلق',
        nameMs: 'Tenggorok Tengah',
        letters: ['ع', 'ح'],
        path: 'M 80 75 Q 90 70 100 75',
        description: 'Bahagian tengah kerongkong',
    },
    {
        id: 'halq-aqsa',
        nameAr: 'أقصى الحلق',
        nameMs: 'Pangkal Tenggorok',
        letters: ['ء', 'ه'],
        path: 'M 80 90 Q 90 85 100 90',
        description: 'Bahagian bawah kerongkong (paling dalam)',
    },
    {
        id: 'lisan-aqsa',
        nameAr: 'أقصى اللسان',
        nameMs: 'Pangkal Lidah',
        letters: ['ق', 'ك'],
        path: 'M 110 70 Q 120 60 130 70',
        description: 'Pangkal lidah menyentuh langit-langit lembut',
    },
    {
        id: 'lisan-wasat',
        nameAr: 'وسط اللسان',
        nameMs: 'Tengah Lidah',
        letters: ['ج', 'ش', 'ي'],
        path: 'M 130 85 Q 140 75 150 85',
        description: 'Tengah lidah menyentuh langit-langit keras',
    },
    {
        id: 'lisan-haffa',
        nameAr: 'حافة اللسان',
        nameMs: 'Tepi Lidah',
        letters: ['ض'],
        path: 'M 140 95 Q 150 90 160 95',
        description: 'Tepi lidah menyentuh geraham atas',
    },
    {
        id: 'lisan-adna',
        nameAr: 'أدنى اللسان',
        nameMs: 'Hujung Lidah',
        letters: ['ل', 'ن', 'ر'],
        path: 'M 155 100 Q 165 95 175 100',
        description: 'Hujung lidah menyentuh gusi atas',
    },
    {
        id: 'lisan-tarafa',
        nameAr: 'طرف اللسان',
        nameMs: 'Hujung Lidah + Gigi',
        letters: ['ط', 'د', 'ت'],
        path: 'M 170 105 Q 180 100 190 105',
        description: 'Hujung lidah menyentuh pangkal gigi atas',
    },
    {
        id: 'lisan-thana',
        nameAr: 'طرف مع الثنايا',
        nameMs: 'Hujung + Gigi Depan',
        letters: ['ظ', 'ذ', 'ث'],
        path: 'M 185 110 Q 195 105 205 110',
        description: 'Hujung lidah keluar antara gigi',
    },
    {
        id: 'safir',
        nameAr: 'حروف الصفير',
        nameMs: 'Huruf Desisan',
        letters: ['ص', 'س', 'ز'],
        path: 'M 180 115 Q 190 110 200 115',
        description: 'Hujung lidah dengan gigi bawah menghasilkan bunyi desisan',
    },
    {
        id: 'shafatan',
        nameAr: 'الشفتان',
        nameMs: 'Dua Bibir',
        letters: ['ب', 'م', 'و'],
        path: 'M 200 120 Q 210 115 220 120',
        description: 'Kedua-dua bibir bertemu',
    },
    {
        id: 'shafa-asnan',
        nameAr: 'الشفة مع الأسنان',
        nameMs: 'Bibir + Gigi',
        letters: ['ف'],
        path: 'M 195 125 Q 205 120 215 125',
        description: 'Bibir bawah menyentuh gigi atas',
    },
];

interface MakhrajVisualizerProps {
    activeLetter?: string;
    errorType?: 'makhraj' | 'tajweed' | 'harakat' | 'rhythm';
    className?: string;
    onPointClick?: (point: MakhrajPoint) => void;
}

export const MakhrajVisualizer: React.FC<MakhrajVisualizerProps> = ({
    activeLetter,
    errorType,
    className = '',
    onPointClick,
}) => {
    const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

    // Find active makhraj point based on letter
    const activeMakhraj = useMemo(() => {
        if (!activeLetter) return null;
        return MAKHRAJ_POINTS.find((point) => point.letters.includes(activeLetter));
    }, [activeLetter]);

    // Determine highlight color
    const highlightColor = useMemo(() => {
        if (errorType === 'makhraj') return '#ef4444'; // Red for error
        return '#22d3ee'; // Cyan for correct/neutral
    }, [errorType]);

    return (
        <div className={`relative ${className}`}>
            {/* SVG Mouth Diagram */}
            <svg
                viewBox="0 0 300 200"
                className="w-full h-auto"
                style={{ maxWidth: 400 }}
            >
                {/* Background - Head outline */}
                <path
                    d="M 50 100 Q 50 30 150 30 Q 250 30 250 100 Q 250 180 150 180 Q 50 180 50 100"
                    fill="#1e293b"
                    stroke="#475569"
                    strokeWidth="2"
                />

                {/* Throat/Pharynx */}
                <path
                    d="M 70 60 L 70 120 Q 70 140 90 140 L 90 60 Q 80 50 70 60"
                    fill="#334155"
                    stroke="#475569"
                    strokeWidth="1"
                />

                {/* Tongue base shape */}
                <path
                    d="M 90 130 Q 120 150 150 140 Q 180 130 200 140 Q 220 150 220 130 L 200 100 Q 150 80 100 100 Z"
                    fill="#64748b"
                    stroke="#94a3b8"
                    strokeWidth="1"
                />

                {/* Palate (hard + soft) */}
                <path
                    d="M 90 50 Q 150 30 210 50 Q 200 70 150 75 Q 100 70 90 50"
                    fill="#475569"
                    stroke="#64748b"
                    strokeWidth="1"
                />

                {/* Teeth - upper */}
                <rect x="180" y="95" width="40" height="8" rx="2" fill="#e2e8f0" />

                {/* Teeth - lower */}
                <rect x="180" y="130" width="40" height="8" rx="2" fill="#e2e8f0" />

                {/* Lips */}
                <ellipse cx="230" cy="110" rx="15" ry="25" fill="#f472b6" opacity="0.6" />

                {/* Makhraj Points */}
                {MAKHRAJ_POINTS.map((point) => {
                    const isActive = activeMakhraj?.id === point.id;
                    const isHovered = hoveredPoint === point.id;

                    return (
                        <g key={point.id}>
                            {/* Clickable area */}
                            <motion.circle
                                cx={parseInt(point.path.split(' ')[1]) + 10}
                                cy={parseInt(point.path.split(' ')[2]) + 5}
                                r={isActive || isHovered ? 12 : 8}
                                fill={isActive ? highlightColor : isHovered ? '#60a5fa' : '#475569'}
                                stroke={isActive ? '#ffffff' : '#64748b'}
                                strokeWidth={isActive ? 2 : 1}
                                opacity={isActive ? 1 : 0.7}
                                className="cursor-pointer"
                                onMouseEnter={() => setHoveredPoint(point.id)}
                                onMouseLeave={() => setHoveredPoint(null)}
                                onClick={() => onPointClick?.(point)}
                                animate={{
                                    scale: isActive ? [1, 1.2, 1] : 1,
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: isActive ? Infinity : 0,
                                    repeatType: 'reverse',
                                }}
                            />

                            {/* Letter label */}
                            {(isActive || isHovered) && (
                                <text
                                    x={parseInt(point.path.split(' ')[1]) + 25}
                                    y={parseInt(point.path.split(' ')[2]) + 8}
                                    fill="#ffffff"
                                    fontSize="12"
                                    fontFamily="Amiri, serif"
                                    className="pointer-events-none"
                                >
                                    {point.letters.join(' ')}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Active letter display */}
                {activeLetter && (
                    <text
                        x="150"
                        y="185"
                        textAnchor="middle"
                        fill={highlightColor}
                        fontSize="24"
                        fontFamily="Amiri, serif"
                        fontWeight="bold"
                    >
                        {activeLetter}
                    </text>
                )}
            </svg>

            {/* Info panel */}
            {(activeMakhraj || hoveredPoint) && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 text-sm"
                >
                    {(() => {
                        const point = activeMakhraj || MAKHRAJ_POINTS.find(p => p.id === hoveredPoint);
                        if (!point) return null;
                        return (
                            <>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-raudhah-teal font-amiri text-lg">{point.nameAr}</span>
                                    <span className="text-slate-400">{point.nameMs}</span>
                                </div>
                                <p className="text-slate-300 text-xs">{point.description}</p>
                                <div className="flex gap-2 mt-2">
                                    {point.letters.map((letter) => (
                                        <span
                                            key={letter}
                                            className={`px-2 py-1 rounded font-amiri text-lg ${letter === activeLetter
                                                    ? 'bg-raudhah-teal/30 text-raudhah-teal'
                                                    : 'bg-slate-700 text-slate-300'
                                                }`}
                                        >
                                            {letter}
                                        </span>
                                    ))}
                                </div>
                            </>
                        );
                    })()}
                </motion.div>
            )}
        </div>
    );
};

export default MakhrajVisualizer;
