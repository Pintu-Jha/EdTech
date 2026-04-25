/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        canvas: "#0D0F14",
        card: "#161B25",
        elevated: "#1E2535",
        inputbg: "#1A202E",
        subtle: "#1E2A3D",
        strong: "#2D3A52",
        accent: "#6C63FF",
        accentmuted: "rgba(108, 99, 255, 0.12)",
        primary: "#F0F2F8",
        secondary: "#8892A4",
        muted: "#4E5A6E",
        success: "#34D399",
        warning: "#FBBF24",
        error: "#F87171",
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
        input: "12px",
        chip: "8px",
      },
    },
  },
  plugins: [],
};
