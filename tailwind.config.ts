import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#10191A", 
        secondary: "#172426",
        accent: "#D0D6B3", 
        white:"#ffffff",
        dashboardDark: "#111827",
        dashboardLight: "#1f2937",
        dashboardAccent: "#374151",
      },
    },
  },
  plugins: [],
} satisfies Config;