/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Bloomberg Terminal Color Scheme
        'terminal': {
          'bg': '#0a0a0a',
          'surface': '#1a1a1a',
          'border': '#2a2a2a',
          'text': '#ffffff',
          'muted': '#94a3b8',
        },
        // Investment Research Terminal Colors
        'bullish': '#10b981', // emerald-500
        'bearish': '#f43f5e', // rose-500
        'neutral': '#94a3b8', // slate-400
        'accent': '#06b6d4', // cyan-500
        // Legacy MarketMind Colors (for compatibility)
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        'neon-green': '#00FF41',
        'cyber-blue': '#00D4FF',
        'alert-red': '#FF3131',
        'dark-bg': '#050505',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'sentiment-pulse': 'sentimentPulse 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00FF41, 0 0 10px #00FF41, 0 0 15px #00FF41' },
          '100%': { boxShadow: '0 0 10px #00FF41, 0 0 20px #00FF41, 0 0 30px #00FF41' },
        },
        sentimentPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      boxShadow: {
        'terminal': '0 0 20px rgba(16, 185, 129, 0.1)',
        'bullish': '0 0 20px rgba(16, 185, 129, 0.2)',
        'bearish': '0 0 20px rgba(244, 63, 94, 0.2)',
        'glow-sm': '0 0 10px rgba(6, 182, 212, 0.3)',
        'glow-md': '0 0 20px rgba(6, 182, 212, 0.4)',
        'glow-lg': '0 0 30px rgba(6, 182, 212, 0.5)',
      },
    },
  },
  plugins: [],
}