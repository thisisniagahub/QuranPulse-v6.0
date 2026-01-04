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
        // ═══════════════════════════════════════════════════════════════
        // VERSE STUDIO DESIGN SYSTEM - Global Theme
        // ═══════════════════════════════════════════════════════════════

        // Primary & Secondary Tones (Navy)
        "primary": "var(--primary)",
        "secondary": "var(--secondary)",
        "highlight": "var(--highlight)",

        // Backgrounds
        "background-main": "var(--bg-main)",

        // Surfaces (Cards, Inputs, Elevated Elements)
        "surface": "var(--surface)",
        "sheet": "var(--sheet)",      // Bottom sheets, modals
        "card": "var(--card)",       // Neural insight cards

        // Legacy Aliases (mapped to new variables)
        "background-light": "var(--bg-main)", // Was #f5f8f8
        "background-dark": "var(--bg-main)",  // Was #051324
        "surface-dark": "var(--surface)",     // Was #154270

        space: {
          dark: '#051324',
          light: '#0e3359',
          accent: '#154270',
        },

        // Gold Accent (for badges, achievements)
        gold: {
          400: '#FFE57F',
          500: 'var(--accent-gold)', // Dynamic gold
          600: '#FFC107',
        },
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "arabic": ["'Noto Sans Arabic'", "Amiri", "sans-serif"],
        "sans": ['Inter', 'sans-serif'],
        "serif": ['Amiri', 'serif'],
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
        "full": "9999px"
      },
      boxShadow: {
        'neon': '0 0 20px -5px rgba(90, 185, 255, 0.5)',
        'neon-sm': '0 0 10px -2px rgba(90, 185, 255, 0.4)',
        'sheet': '0 -10px 40px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shine': 'shine 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
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
          '0%, 100%': { transform: 'scale(1)', opacity: '1', filter: 'drop-shadow(0 0 10px rgba(90, 185, 255, 0.3))' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9', filter: 'drop-shadow(0 0 25px rgba(90, 185, 255, 0.6))' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
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
