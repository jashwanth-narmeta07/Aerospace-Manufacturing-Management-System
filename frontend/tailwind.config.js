/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ocean: {
          950: '#0c2340',
          900: '#0a1d36',
          800: '#1a4a6e',
          500: '#2d8a9e',
          300: '#5cbdb9',
          100: '#a8c4d4',
          50: '#e6f1f8',
        },
      },
    },
  },
  plugins: [],
};
