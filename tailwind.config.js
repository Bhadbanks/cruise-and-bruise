// tailwind.config.js (in your project root)
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
        // GC VIBE PREMIUM PALETTE
        'gc-vibe': '#0D0A1E',          // Deepest Background (Starry Night Vibe)
        'gc-card': '#1B152C',          // Card/Box Background (Darker Contrast)
        'gc-border': '#352A50',        // Subtle Separator/Border
        'gc-primary': '#FF6B81',       // Rose Pink/Red (CTA, High Energy)
        'gc-secondary': '#6C5CE7',     // Electric Purple (Accents, Hover)
        'gc-text': '#EAEAEA',          // Light/White Text
        'gc-admin': '#FFD700',         // Gold for Admin
        'gc-verified': '#00C9FF',      // Icy Blue for Verified
      },
      boxShadow: {
        'gc-glow-primary': '0 0 10px rgba(255, 107, 129, 0.5)',
        'gc-glow-secondary': '0 0 10px rgba(108, 92, 231, 0.5)',
      },
      backgroundImage: {
        'gc-gradient': 'radial-gradient(circle at 50% 10%, rgba(108, 92, 231, 0.15), transparent 60%)',
      }
    },
  },
  plugins: [],
}
