/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Verify these paths match your file structure exactly
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- Custom Vibe Palette ---
        'gc-vibe': '#08080D',        // Deepest Black (Background)
        'gc-card': '#15151F',        // Off-Black/Dark Gray (Card Backgrounds)
        'gc-primary': '#1D9BF0',     // Twitter Blue (Primary Action)
        'gc-secondary': '#FF577F',   // Vibrant Pink (Secondary Accent/Likes)
        'gc-text': '#E7E9EA',        // Off-White (Default Text)
        'gc-border': '#2F2F40',      // Subtle Gray (Dividers)
        'gc-admin': '#FFD700',       // Gold (Admin Crown)
        'gc-verified': '#1D9BF0',    // Standard Blue Check
      },
      boxShadow: {
        'gc-glow': '0 0 10px rgba(29, 155, 240, 0.5)',
      },
    },
  },
  plugins: [],
};
