/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pretendard': ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'noto': ['Noto Sans KR', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        'brand': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'navy': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        'kakao': '#FEE500',
        'naver': '#03C75A',
      },
      keyframes: {
        'fade-in-smooth': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px) scale(0.8)'
          },
          '50%': {
            opacity: '0.7',
            transform: 'translateY(-2px) scale(1.05)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)'
          }
        },
        'fade-in-soft': {
          '0%': {
            opacity: '0',
            transform: 'translateY(8px) scale(0.9)'
          },
          '60%': {
            opacity: '0.8',
            transform: 'translateY(-1px) scale(1.02)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)'
          }
        },
        'typing': {
          'from': { 
            width: '0' 
          },
          'to': { 
            width: '100%' 
          }
        }
      },
      animation: {
        'fade-in-smooth': 'fade-in-smooth 0.6s ease-out forwards',
        'fade-in-soft': 'fade-in-soft 0.5s ease-out forwards',
        'typing': 'typing 2s steps(40, end)',
      },
    },
  },
  plugins: [],
}