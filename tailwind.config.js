/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        display: ['"Space Grotesk Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        // Tinted, restrained elevation scale (no pure-black drop shadows).
        panel: '0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 14px 34px -18px rgba(15, 23, 42, 0.20)',
        'panel-dark': '0 1px 2px 0 rgba(0, 0, 0, 0.5), 0 22px 50px -26px rgba(0, 0, 0, 0.75)',
        stage: 'inset 0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'stage-dark': 'inset 0 1px 0 0 rgba(148, 163, 184, 0.05)',
        glow: '0 0 0 1px rgba(99, 102, 241, 0.3), 0 12px 32px -14px rgba(79, 70, 229, 0.55)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.12)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scale-in 0.24s cubic-bezier(0.16, 1, 0.3, 1) both',
        pop: 'pop 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
