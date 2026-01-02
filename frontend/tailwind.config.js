/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        // MarketMind Brand Colors
        'neon-green': '#00FF41',
        'cyber-blue': '#00D4FF',
        'alert-red': '#FF3131',
        'dark-bg': '#050505',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00FF41, 0 0 10px #00FF41, 0 0 15px #00FF41' },
          '100%': { boxShadow: '0 0 10px #00FF41, 0 0 20px #00FF41, 0 0 30px #00FF41' },
        }
      }
    },
  },
  plugins: [],
}