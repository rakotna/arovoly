/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#059669',
          dark: '#047857',
          light: '#10b981',
          subtle: '#ecfdf5',
          container: '#00855d',
          'fixed-dim': '#68dba9',
        },
        secondary: {
          DEFAULT: '#ea580c',
          dark: '#c2410c',
          container: '#fd651e',
          fixed: '#ffdbce',
        },
        tertiary: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
          container: '#a36700',
        },
        agri: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        surface: {
          DEFAULT: '#faf8ff',
          dim: '#d2d9f4',
          bright: '#faf8ff',
          'container-lowest': '#ffffff',
          'container-low': '#f1f5f9',
          container: '#eaedff',
          'container-high': '#e2e7ff',
          'container-highest': '#dae2fd',
        },
        'on-surface': '#0f172a',
        'on-surface-variant': '#475569',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 20px 40px -15px rgba(15, 23, 42, 0.12), 0 0 1px 1px rgba(255, 255, 255, 0.8) inset',
        'glass-subtle': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(255, 255, 255, 0.7) inset',
        'floating': '0 12px 30px -4px rgba(15, 23, 42, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.04)',
        'glow-emerald': '0 0 25px -5px rgba(5, 150, 105, 0.45)',
        'glow-orange': '0 0 25px -5px rgba(234, 88, 12, 0.45)',
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
};
