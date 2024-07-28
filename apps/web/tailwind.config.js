/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bitter: ["var(--font-bitter)"],
      },
      animation: {
        "slide-in": "slide-in .1s ease-out",
      },
      keyframes: {
        "slide-in": {
          "0%": {
            transform: "translateY(-48px)",
          },
        },
      }
    },
  },
  plugins: [],
}

