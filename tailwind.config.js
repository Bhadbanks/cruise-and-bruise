// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // GC Vibe Color Palette
        'gc-primary': '#E91E63',     // A vibrant pink/red for accents and buttons
        'gc-secondary': '#8A2BE2',   // Blue Violet for secondary actions/focus
        'gc-vibe': '#100C1B',        // Very dark background matching the premium theme
        'gc-card': '#1C1525',        // Slightly lighter dark color for cards/modals
        'gc-border': '#332940',      // Border/divider color
        'gc-admin': '#FFD700',       // Gold for Admin badge
        'gc-verified': '#1DA1F2',    // Twitter Blue for verified badge
      },
      backgroundImage: {
        'gc-gradient': 'linear-gradient(135deg, #100C1B 0%, #332940 100%)',
      },
      boxShadow: {
        'gc-glow': '0 0 15px rgba(233, 30, 99, 0.5)',
      }
    },
  },
  plugins: [],
}
