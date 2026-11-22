/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCFA',
          100: '#FAF8F5',
          200: '#F4EFEA',
          300: '#EAE2D8',
          400: '#D6C8B8',
        },
        terracotta: {
          50: '#FDF5F3',
          100: '#FCEAE6',
          200: '#F9D5CD',
          300: '#F4B0A1',
          400: '#EE8E78',
          500: '#E87A64', // primary terracotta
          600: '#D25E47',
          700: '#B04631',
          800: '#8C3827',
          900: '#6E2D20',
        },
        sage: {
          50: '#F2F7F5',
          100: '#E4EFEA',
          200: '#C7DFD5',
          300: '#A1C7B8',
          400: '#75AB99',
          500: '#4D7C6F', // primary sage
          600: '#3D6358',
          700: '#325047',
          800: '#2A413A',
        },
        charcoal: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1F2937', // primary charcoal
          900: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(31, 41, 55, 0.04), 0 1px 2px rgba(31, 41, 55, 0.02)',
        'warm': '0 4px 14px -1px rgba(31, 41, 55, 0.06), 0 2px 6px -1px rgba(31, 41, 55, 0.03)',
        'warm-lg': '0 10px 25px -3px rgba(31, 41, 55, 0.08), 0 4px 10px -2px rgba(31, 41, 55, 0.04)',
        'terracotta': '0 6px 20px -2px rgba(232, 122, 100, 0.25)',
      }
    },
  },
  plugins: [],
}
