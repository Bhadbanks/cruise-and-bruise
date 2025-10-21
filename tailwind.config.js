/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'gc-primary': '#E91E63', // Deep Pink/Magenta
        'gc-secondary': '#9C27B0', // Purple
        'gc-dark': '#1F2937', // Dark Grey for backgrounds
      },
      backgroundImage: {
        'gc-vibe': 'linear-gradient(135deg, #1F2937 0%, #0F172A 100%)', // Subtle gradient background
      },
      keyframes: {
        pulseBorder: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(233, 30, 99, 0.7)' },
          '50%': { boxShadow: '0 0 0 8px rgba(233, 30, 99, 0)' },
        }
      },
      animation: {
        'border-pulse': 'pulseBorder 2s infinite', // Custom animation for admin posts
      }
    },
  },
  plugins: [],
};
