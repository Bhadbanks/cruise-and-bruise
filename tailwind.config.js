// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gc-primary': '#E91E63', // Deep Pink/Magenta
        'gc-secondary': '#9C27B0', // Deep Purple
        'gc-vibe': '#111827', // Dark background
        'gc-card': '#1f2937', // Slightly lighter card background
      },
      backgroundImage: {
        'gc-gradient': 'linear-gradient(to right bottom, var(--tw-color-gc-secondary), var(--tw-color-gc-primary))',
        'gc-vibe-bg': 'radial-gradient(circle at center, #1f2937 0%, #111827 80%)',
      },
      boxShadow: {
        'gc-glow': '0 0 15px rgba(233, 30, 99, 0.5)', // Primary glow effect
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
