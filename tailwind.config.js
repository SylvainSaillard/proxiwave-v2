/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#F8FAFB',
        pw: {
          50: '#E8F4FD',
          100: '#BEE0F7',
          200: '#90CAF0',
          300: '#64B5F6',
          400: '#3AA0E8',
          500: '#1976D2',
          600: '#1565A0',
          700: '#0D5A8E',
          800: '#0B4F7A',
          900: '#083D5E',
        },
        sky: {
          50: '#F0F7FC',
          100: '#DBEDF8',
          200: '#B8DBF2',
          300: '#8FC6E9',
          400: '#5BAADB',
        },
        warm: {
          50: '#FAFAF8',
          100: '#F4F3EF',
          200: '#ECEAE4',
          300: '#DDD9D0',
          400: '#C4BEB2',
        },
      },
      borderRadius: {
        bento: '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
