// tailwind.config.js (in project root)
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // SPECIAL SQUAD VIBE PREMIUM PALETTE (Twitter/X Style Dark)
        'gc-vibe': '#08080D',          // Deepest Background (Pitch Black, Modern)
        'gc-card': '#15151F',          // Card/Box Background (Slightly Lighter Contrast)
        'gc-border': '#2F2F40',        // Subtle Separator/Border
        'gc-primary': '#1D9BF0',       // Twitter Blue (Main CTA/Accent)
        'gc-secondary': '#F91880',     // Rose Pink (Likes/Alternative Accent)
        'gc-text': '#E7E9EA',          // Light/White Text
        'gc-admin': '#FFD700',         // Gold for Admin (Crown)
        'gc-verified': '#1D9BF0',      // Blue for Verified (Checkmark)
      },
      boxShadow: {
        'gc-glow': '0 0 10px rgba(29, 155, 240, 0.4)', // Blue glow for emphasis
      },
      backgroundImage: {
        'gc-gradient': 'radial-gradient(circle at 50% 10%, rgba(29, 155, 240, 0.05), transparent 70%)',
      }
    },
  },
  plugins: [],
}
