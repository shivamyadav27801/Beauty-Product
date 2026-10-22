import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        velvet: {
          50: "#fdf8f9",
          100: "#fbebee",
          200: "#f8d7dc",
          300: "#f2b5c0",
          400: "#e5869a",
          500: "#d35e76",
          600: "#b55b6c", // Primary brand rose
          700: "#9c3b4f",
          800: "#833243",
          900: "#6f2d3a",
          dark: "#3a1f2c", // Footer deep wine/plum
          darker: "#2b1520",
        },
        roseGold: "#b55b6c",
        cream: "#faf7f5",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
