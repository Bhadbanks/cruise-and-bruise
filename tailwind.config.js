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
        accent2: "#7afcff",
        glow: "#ff66cc"
      },
      animation: {
        gradient: "gradient 12s ease infinite",
        float: "float 7s ease-in-out infinite",
        logoBounce: "logoBounce 1.6s infinite",
        marquee: "marquee 20s linear infinite"
      },
      keyframes: {
        gradient: {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" }
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" }
        },
        logoBounce: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
          "100%": { transform: "translateY(0)" }
        },
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" }
        }
      }
    }
  },
  plugins: []
};
