/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      borderWidth: {
        1: '1px',
      },
      colors: {
        'alpha-white': '#FFFFFF',
        black: '#46454D',
        white: '#FDFCFF',
        'purple-100': '#D6CEFE',
        'purple-200': '#C2B7F8',
        'purple-300': '#B0A4ED',
        'purple-400': '#9D90E0',
        'purple-500': '#8C7ECF',
        'purple-600': '#8175BD',
        'gold-100': '#F2E9A2',
        'gold-200': '#E5DC95',
        'gold-300': '#DBD28A',
        'gold-400': '#CFC57F',
        'gold-500': '#BFB673',
        'gold-600': '#B0A766',
        'gray-50': '#EBEBF0',
        'gray-100': '#DCDCE0',
        'gray-200': '#D0CFD4',
        'gray-300': '#C3C3C7',
        'gray-400': '#B4B4B8',
        'gray-500': '#9999A1',
        'red-400': '#FD7067',
        'red-500': '#EE584F',
        'green-400': '#61F599',
        'green-500': '#52EA8B',
      },
      boxShadow: {
        solid: '0 0 2px 1px',
      },
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
        serif: ['Quicksand', 'sans-serif'],
        quotes: ['Yellowtail', 'cursive'],
      },
      fontSize: {
        '3xs': 9,
        '2xs': 10,
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
        '6xl': 60,
        '7xl': 72,
        '8xl': 96,
        '9xl': 128,
      },
    },
  },
  plugins: [],
};
