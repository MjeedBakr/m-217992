
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#f8f9fa",
        foreground: "#1a1a1a",
        muted: "#64748b",
        accent: "#055a63", // UQU primary green
        secondary: "#b8860b", // UQU gold color
        bubble: {
          received: "#00693e", // Bot message bubbles in UQU green
          sent: "#e2e8f0", // User message bubbles in light gray
        },
        border: "#e2e8f0",
        "uqu-green": {
          100: "#e6f0eb",
          200: "#c3dcd0",
          300: "#9fc8b5",
          400: "#7cb49b",
          500: "#58a080",
          600: "#00693e", // Primary
          700: "#005432",
          800: "#004025",
          900: "#002b19",
        },
        "uqu-gold": {
          100: "#fdf6e3",
          200: "#f9e8b8",
          300: "#f5d98d",
          400: "#f1cb62",
          500: "#edbc37",
          600: "#b8860b", // Primary
          700: "#936b09",
          800: "#6e5007",
          900: "#493604",
        },
      },
      fontFamily: {
        sans: [
          "Tajawal",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        arabic: ["Tajawal", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
