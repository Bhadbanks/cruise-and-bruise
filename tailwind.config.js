/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff2d95',
        secondary: '#1b1b1b',
        accent: '#ff77aa',
      },
      animation: {
        'float-rose': 'floatRose 6s ease-in-out infinite',
      },
      keyframes: {
        floatRose: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
