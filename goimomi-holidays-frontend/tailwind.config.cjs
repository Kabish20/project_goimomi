module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'goimomi-primary': '#14532d', // Deep Elite Green
        'goimomi-secondary': '#e9b343', // Gold
        'goimomi-light': '#f0fdf4',
        'business-dark': '#010409',
        'business-blue': '#0d1117',
        'business-navy': '#0b1a3d',
        'business-accent': '#1f6feb',
        'business-grey': '#8b949e',
        'leisure-turquoise': '#3cd3c1',
        'leisure-sky': '#87ceeb',
        'leisure-orange': '#ff8c00',
        'leisure-sand': '#f8f9fa',
        'leisure-gold': '#e9b343',
        'accent-blue': '#3b82f6',
        'accent-purple': '#a855f7',
        'accent-pink': '#ec4899',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        display: ['Outfit', 'Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '3rem',
      },
      boxShadow: {
        'premium': '0 20px 50px -12px rgba(0, 0, 0, 0.25)',
        'soft': '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'business-grad': 'linear-gradient(135deg, #0b1a3d 0%, #010409 100%)',
        'leisure-grad': 'linear-gradient(135deg, #3cd3c1 0%, #87ceeb 100%)',
        'accent-grad': 'linear-gradient(to right, #3b82f6, #a855f7, #ec4899)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
};
