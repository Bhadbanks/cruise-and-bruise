/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff0055',
        secondary: '#220022',
        accent: '#ff77aa',
      },
    },
  },
  plugins: [],
}
