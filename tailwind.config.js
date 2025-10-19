/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bgA: "#0b1026",
        bgB: "#2c0f42",
        accent1: "#ff7eb3",
        accent2: "#7afcff"
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 18s linear infinite",
        pulseSlow: "pulse 3s ease-in-out infinite",
        logoBounce: "logoBounce 1.6s infinite"
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        },
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" }
        },
        logoBounce: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};
