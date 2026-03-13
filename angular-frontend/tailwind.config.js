/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 1. Añadimos esta línea para activar el modo oscuro manual
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', 
          600: '#2563eb',     
          700: '#1d4ed8'      
        },
        secondary: '#9333EA',  
        accent: '#F59E0B',     
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], 
      },
    },
  },
  plugins: [],
}