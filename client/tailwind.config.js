/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A227',
          light: '#E5C158',
          dark: '#A07D10',
        },
        navy: {
          DEFAULT: '#08111F',
          light: '#112240',
          medium: '#0D1B2E',
        },
        lightbg: '#F8F9FA',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 162, 39, 0.4)' },
          '50%': { boxShadow: '0 0 0 15px rgba(201, 162, 39, 0)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A227 0%, #E5C158 50%, #A07D10 100%)',
        'navy-gradient': 'linear-gradient(135deg, #08111F 0%, #112240 100%)',
        'hero-overlay': 'linear-gradient(to bottom, rgba(8,17,31,0.5) 0%, rgba(8,17,31,0.3) 50%, rgba(8,17,31,0.7) 100%)',
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(201, 162, 39, 0.3)',
        'gold-lg': '0 8px 40px rgba(201, 162, 39, 0.4)',
        'card': '0 4px 30px rgba(0,0,0,0.08)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}
