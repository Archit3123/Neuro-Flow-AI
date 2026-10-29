import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { surface: "#10121b", panel: "#181b27", accent: "#8b5cf6" }, boxShadow: { glow: "0 0 35px rgba(139,92,246,.18)" } } },
  plugins: []
} satisfies Config;
