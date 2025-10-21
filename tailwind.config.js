// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // GC Theme Colors
        'gc-primary': '#E91E63', // Pink/Magenta for primary actions
        'gc-secondary': '#9C27B0', // Purple for secondary/highlight
        'gc-vibe': '#111827', // Dark background
      },
      backgroundImage: {
        'gc-gradient': 'linear-gradient(to right, #9C27B0, #E91E63)',
      },
    },
  },
  plugins: [],
}
