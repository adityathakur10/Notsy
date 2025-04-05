/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      fontFamily: {
        'do-hyeon': ['"Do Hyeon"', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#7D4FFF',
          hover: '#6a43d9',
        },
        secondary: {
          pink: '#FF4F5B',
          teal: '#78E9D2',
        },
        base: {
          black: '#000000',
          white: '#FFFFFF',
          navgray: '#F3F3F5',
        }
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out'
      },
      zIndex: {
        '100000': '100000',
      }
    },
  },
  plugins: [],
}