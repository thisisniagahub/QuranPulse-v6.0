import React, { useEffect, useRef } from 'react';

interface PixelCardProps {
    children: React.ReactNode;
    className?: string;
    pixelSize?: number;
    gap?: number;
    pixelColor?: string;
}

export const PixelCard: React.FC<PixelCardProps> = ({
    children,
    className = "",
    pixelSize = 8,
    gap = 2,
    pixelColor = "rgba(27, 107, 90, 0.4)"
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let mouseX = -100;
        let mouseY = -100;

        const resize = () => {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouseX = -100;
            mouseY = -100;
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('resize', resize);
        resize();

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cols = Math.ceil(canvas.width / (pixelSize + gap));
            const rows = Math.ceil(canvas.height / (pixelSize + gap));

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * (pixelSize + gap);
                    const y = j * (pixelSize + gap);

                    const dx = x - mouseX;
                    const dy = y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        ctx.fillStyle = pixelColor;
                        ctx.globalAlpha = 1 - (dist / 100);
                        ctx.fillRect(x, y, pixelSize, pixelSize);
                    }
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [pixelSize, gap, pixelColor]);

    return (
        <div ref={containerRef} className={`relative overflow-hidden group ${className}`}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none z-0"
            />
            <div className="relative z-10 h-full w-full">
                {children}
            </div>
        </div>
    );
};
