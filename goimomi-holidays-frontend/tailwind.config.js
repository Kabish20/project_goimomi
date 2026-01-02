/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'goimomi-dark': '#0b1a3d',
        'goimomi-primary':'#0F5D3F',
        'goimomi-gold': '#e9b343',
        'goimomi-light': '#f8f9fa',
      },
      maxWidth: {
        '8xl': '88rem',
        '10xl': '100rem',
      },
      fontFamily: {
        heading: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
