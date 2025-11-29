/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./modules/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // v6.0 Visual Identity - Advanced & Impactful
        primary: {
          DEFAULT: '#00E5FF', // Neon Cyan (v6.0)
          hover: '#00B8D4',   // Darker Cyan hover
          light: '#84FFFF',
          dark: '#00B0FF',
        },
        secondary: {
          DEFAULT: '#FFD700', // Pure Gold
          hover: '#FFA000',   // Amber Gold hover
          light: '#FFE57F',
          dark: '#FFB300',
        },
        // Deep Space Backgrounds
        space: {
          dark: '#050505', // v6.0 Black
          light: '#0f172a', // Lighter Slate
          accent: '#1e293b',
        },
        // Mapping legacy names
        gold: {
          400: '#FFE57F',
          500: '#FFD700',
          600: '#FFC107',
        },
        teal: {
          pulse: '#00BFA5', 
          dark: '#00695C',
          400: '#1DE9B6',
          500: '#00BFA5',
        },
        islamic: {
          dark: '#020617', // Updated to Deep Space
          panel: '#0B1120', // Slightly lighter panel
          accent: '#00BFA5', 
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Amiri', 'serif'],
        arabic: ['Noto Sans Arabic', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shine': 'shine 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'aurora': 'aurora 20s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'tilt': 'tilt 10s infinite linear',
        'aurora-reverse': 'aurora-reverse 20s linear infinite',
        'bounce-slow': 'bounce-slow 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shine: {
          '0%': { left: '-100%' },
          '100%': { left: '200%' }
        },
        'pulse-glow': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1', filter: 'drop-shadow(0 0 10px rgba(0, 191, 165, 0.3))' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9', filter: 'drop-shadow(0 0 25px rgba(0, 191, 165, 0.6))' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        tilt: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
        'aurora-reverse': {
          '0%': { backgroundPosition: '100% 50%' },
          '50%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    }
  },
  plugins: [],
}
