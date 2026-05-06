/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./contexts/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        navy: "#08233e",
        "navy-light": "#0f2d52",
        "brand-blue": "#3b82f6",
        "border-subtle": "#e2e8f0",
        "surface": "#f8fafc",
        "muted-fg": "#64748b",
        "success": "#16a34a",
        "warning": "#d97706",
        "danger": "#dc2626",
      },
    },
  },
  plugins: [],
};
