/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // Vivid Indigo
          light: '#EEF2FF',
          dark: '#3730A3',
        },
        accent: {
          DEFAULT: '#F59E0B', // Vivid Amber
          light: '#FEF3C7',
          text: '#92400E',
        },
        surface: '#FFFFFF',
        'surface-muted': '#F8FAFC',
        border: '#E2E8F0',
        divider: '#F1F5F9',
        input: {
          bg: '#F8FAFC',
          border: '#CBD5E1',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        status: {
          open: { bg: '#EEF2FF', text: '#4F46E5' },
          awaiting: { bg: '#FEF3C7', text: '#D97706' },
          inprogress: { bg: '#E0E7FF', text: '#4338CA' },
          resolved: { bg: '#D1FAE5', text: '#059669' },
          autoresolved: { bg: '#A7F3D0', text: '#047857' },
        },
        success: '#10B981', // Vivid Emerald
        warning: '#F59E0B', // Vivid Amber
        danger: '#EF4444', // Vivid Red
        info: '#3B82F6', // Vivid Blue
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 0 3px rgba(0,0,0,0.02)',
        modal: '0 25px 50px -12px rgba(0,0,0,0.15)',
        toast: '0 10px 30px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        card: '8px',
        btn: '6px',
        modal: '10px',
      },
      animation: {
        'slide-up': 'slideUp 0.2s ease-out',
        'slide-in-right': 'slideInRight 0.25s ease-out',
        'fade-in': 'fadeIn 0.15s ease-out',
        shimmer: 'shimmer 1.5s infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
