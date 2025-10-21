/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'gc-primary': '#E91E63', // Pink (for buttons/highlights)
        'gc-secondary': '#9C27B0', // Purple (for gradients)
        'gc-dark': '#1F2937', // Dark background
      },
      backgroundImage: {
        'gc-vibe': 'linear-gradient(135deg, var(--tw-color-indigo-900) 0%, var(--tw-color-purple-900) 50%, var(--tw-color-pink-900) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'border-pulse': 'border-pulse 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'border-pulse': {
          '0%, 100%': { borderColor: '#E91E63' },
          '50%': { borderColor: '#9C27B0' },
        },
      }
    },
  },
  plugins: [],
}
