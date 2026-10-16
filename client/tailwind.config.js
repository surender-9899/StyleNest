/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        script: ['"Alex Brush"', 'Caveat', 'cursive']
      },
      colors: { ink: '#171717', blush: '#ef476f', cream: '#fbfaf7', mist: '#f1efea', forest: '#31473a' },
      boxShadow: { soft: '0 16px 50px rgba(23, 23, 23, .08)' }
    }
  },
  plugins: []
}
