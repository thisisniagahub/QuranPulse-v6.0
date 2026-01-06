/**
 * PhonemeTimeline - Visualization component for Q-WER phoneme analysis
 * Canvas-based timeline showing phoneme alignment with error highlighting
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface PhonemeSegment {
    phoneme: string;
    start: number; // seconds
    end: number;
    expected?: string;
    error?: {
        type: 'makhraj' | 'tajweed' | 'harakat' | 'rhythm';
        severity: 'critical' | 'high' | 'medium' | 'low';
    };
}

interface PhonemeTimelineProps {
    segments: PhonemeSegment[];
    duration: number; // total duration in seconds
    currentTime?: number;
    onSegmentClick?: (segment: PhonemeSegment, index: number) => void;
    className?: string;
}

// Color scheme for errors
const ERROR_COLORS = {
    makhraj: { critical: '#ef4444', high: '#f87171' },
    tajweed: { critical: '#f59e0b', high: '#fbbf24' },
    harakat: { critical: '#3b82f6', high: '#60a5fa' },
    rhythm: { critical: '#8b5cf6', high: '#a78bfa' },
};

const CORRECT_COLOR = '#22c55e';
const BACKGROUND_COLOR = '#1e293b';
const GRID_COLOR = '#334155';
const TEXT_COLOR = '#e2e8f0';

export const PhonemeTimeline: React.FC<PhonemeTimelineProps> = ({
    segments,
    duration,
    currentTime = 0,
    onSegmentClick,
    className = '',
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 120 });
    const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

    // Calculate pixel position from time
    const timeToX = useCallback((time: number) => {
        return (time / duration) * dimensions.width;
    }, [duration, dimensions.width]);

    // Draw timeline
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);

        // Draw time grid
        ctx.strokeStyle = GRID_COLOR;
        ctx.lineWidth = 1;
        const gridSpacing = dimensions.width / 10;
        for (let i = 0; i <= 10; i++) {
            const x = i * gridSpacing;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, dimensions.height);
            ctx.stroke();

            // Time labels
            ctx.fillStyle = TEXT_COLOR;
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'center';
            const timeLabel = ((i / 10) * duration).toFixed(1) + 's';
            ctx.fillText(timeLabel, x, dimensions.height - 5);
        }

        // Draw segments
        const segmentHeight = 40;
        const segmentY = 30;

        segments.forEach((segment, index) => {
            const startX = timeToX(segment.start);
            const endX = timeToX(segment.end);
            const width = Math.max(endX - startX, 2);

            // Determine color
            let color = CORRECT_COLOR;
            if (segment.error) {
                const errorLevel = segment.error.severity === 'critical' || segment.error.severity === 'high'
                    ? 'critical' : 'high';
                color = ERROR_COLORS[segment.error.type]?.[errorLevel] || CORRECT_COLOR;
            }

            // Draw segment rectangle
            ctx.fillStyle = color;
            ctx.globalAlpha = hoveredSegment === index ? 1 : 0.8;
            ctx.beginPath();
            ctx.roundRect(startX, segmentY, width, segmentHeight, 4);
            ctx.fill();
            ctx.globalAlpha = 1;

            // Draw phoneme text
            if (width > 15) {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 14px "Amiri", serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(segment.phoneme, startX + width / 2, segmentY + segmentHeight / 2);
            }

            // Draw error indicator
            if (segment.error) {
                ctx.fillStyle = '#ffffff';
                ctx.font = '10px Inter, sans-serif';
                ctx.textAlign = 'center';
                const errorLabel = segment.error.type.charAt(0).toUpperCase();
                ctx.fillText(errorLabel, startX + width / 2, segmentY - 8);
            }
        });

        // Draw playhead
        if (currentTime > 0) {
            const playheadX = timeToX(currentTime);
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(playheadX, 0);
            ctx.lineTo(playheadX, dimensions.height - 20);
            ctx.stroke();

            // Playhead triangle
            ctx.fillStyle = '#22d3ee';
            ctx.beginPath();
            ctx.moveTo(playheadX - 6, 0);
            ctx.lineTo(playheadX + 6, 0);
            ctx.lineTo(playheadX, 10);
            ctx.closePath();
            ctx.fill();
        }

    }, [segments, dimensions, currentTime, hoveredSegment, timeToX, duration]);

    // Handle resize
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width } = entry.contentRect;
                setDimensions({ width: Math.max(width, 300), height: 120 });
            }
        });

        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, []);

    // Handle mouse events
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const time = (x / dimensions.width) * duration;

        // Find hovered segment
        const index = segments.findIndex(
            (seg) => time >= seg.start && time <= seg.end
        );
        setHoveredSegment(index >= 0 ? index : null);
    };

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (hoveredSegment !== null && onSegmentClick) {
            onSegmentClick(segments[hoveredSegment], hoveredSegment);
        }
    };

    return (
        <div
            ref={containerRef}
            className={`relative bg-slate-900 rounded-lg p-2 ${className}`}
        >
            {/* Legend */}
            <div className="flex gap-4 mb-2 text-xs">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: CORRECT_COLOR }} />
                    <span className="text-slate-400">Betul</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: ERROR_COLORS.makhraj.critical }} />
                    <span className="text-slate-400">Makhraj</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: ERROR_COLORS.tajweed.critical }} />
                    <span className="text-slate-400">Tajwid</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: ERROR_COLORS.harakat.critical }} />
                    <span className="text-slate-400">Harakat</span>
                </div>
            </div>

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredSegment(null)}
                onClick={handleClick}
                className="cursor-pointer"
                style={{ width: '100%', height: dimensions.height }}
            />

            {/* Tooltip */}
            {hoveredSegment !== null && segments[hoveredSegment] && (
                <div className="absolute top-0 right-0 bg-slate-800 rounded-lg p-2 text-xs">
                    <div className="text-white font-amiri text-lg">{segments[hoveredSegment].phoneme}</div>
                    {segments[hoveredSegment].error && (
                        <div className="text-red-400">
                            Error: {segments[hoveredSegment].error.type}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PhonemeTimeline;
