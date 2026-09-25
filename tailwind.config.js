/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: "#171717",
        primary: "#eab308", // Yellow
        primaryDark: "#ca8a04",
        text: "#f5f5f5",
        textMuted: "#a3a3a3",
      },
    },
  },
  plugins: [],
}
