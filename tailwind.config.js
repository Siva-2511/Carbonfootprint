/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        emerald: {
          50: 'hsl(151,81%,96%)',
          100: 'hsl(149,80%,90%)',
          200: 'hsl(152,76%,80%)',
          300: 'hsl(156,72%,67%)',
          400: 'hsl(158,64%,52%)',
          500: 'hsl(160,84%,39%)',
          600: 'hsl(161,94%,30%)',
          700: 'hsl(163,94%,24%)',
          800: 'hsl(163,88%,20%)',
          900: 'hsl(164,86%,16%)',
        },
      },
      fontVariantNumeric: {
        tabular: 'tabular-nums',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
