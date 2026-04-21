import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heebo: ["var(--font-heebo)", "system-ui", "sans-serif"],
      },
      colors: {
        day1: "#94DCF8",
        day2: "#F7C7AC",
        day3: "#E49EDD",
        day4: "#7CD367",
        evening: "#ADADAD",
        meat: "#F1948A",
        dairy: "#AED6F1",
        brand: {
          DEFAULT: "#1A252F",
          accent: "#3498DB",
        },
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
