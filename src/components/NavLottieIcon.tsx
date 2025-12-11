import React, { useRef, useEffect } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

interface NavLottieIconProps {
  animationData: object;
  isActive: boolean;
  size?: number;
  fallbackIcon?: string;
  isCenter?: boolean;
}

/**
 * NavLottieIcon - Animated Lottie icon for bottom navigation
 * 
 * Features:
 * - Plays animation when active or hovered
 * - Pauses and dims when inactive
 * - Neon glow effect when active
 * - Fallback to FontAwesome icon if Lottie fails
 */
const NavLottieIcon: React.FC<NavLottieIconProps> = ({
  animationData,
  isActive,
  size = 32,
  fallbackIcon = 'fa-circle',
  isCenter = false,
}) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [hasError, setHasError] = React.useState(false);

  useEffect(() => {
    if (lottieRef.current) {
      if (isActive) {
        lottieRef.current.play();
      } else {
        lottieRef.current.pause();
      }
    }
  }, [isActive]);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center transition-all duration-300 ${
          isActive ? 'text-cyan-400' : 'text-slate-500'
        }`}
        style={{ width: size, height: size }}
      >
        <i className={`fa-solid ${fallbackIcon} text-lg`}></i>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center transition-all duration-300 ${
        isCenter ? '' : ''
      }`}
      style={{ width: size, height: size }}
    >
      {/* Glow Effect when Active */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-full bg-cyan-400/30 blur-xl animate-pulse pointer-events-none"
          style={{ transform: 'scale(1.5)' }}
        />
      )}

      {/* Lottie Animation */}
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={true}
        autoplay={isActive}
        style={{
          width: size,
          height: size,
          filter: isActive 
            ? 'drop-shadow(0 0 8px rgba(34,211,238,0.6))' 
            : 'grayscale(80%) opacity(0.6)',
          transition: 'filter 0.3s ease',
        }}
        onError={() => setHasError(true)}
      />
    </div>
  );
};

export default NavLottieIcon;
