/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      extend: {
        boxShadow: {
          default: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        },
      },
      colors: {
        primary: {
          100: "#e9fbf0",
          200: "#d7fac4",
          500: "#6ab144",
          800: "#356d18",
        },
        neutral: {
          100: "#ffffff",
          200: "#f7f8fa",
          300: "#f5f4f4",
          400: "#ebece9",
          500: "#dbddd9",
          600: "#8f978b",
          700: "#50564d",
          800: "#161b13",
        },
        success: {
          800: "#6ab144",
          200: "#d7fac4",
        },
        error: {
          800: "#e94b4b",
          200: "#fde8e8",
        },
        pending: {
          800: "#e07900",
          200: "#fff1e1",
        },
        blue: {
          200: "#60a5fa",
          800: "#4395f5",
          200: "#e5f1ff",
          100: "#e5f1ff",
        },
        orange: {
          800: "#9a3412",
          300: "#e07900",
          200: "#fed7aa",
          100: "#ffedd5",
        },
        purple: {
          100: "#2a32d7",
          200: "#3638de",
          300: "#403de5",
          400: "#4a43ec",
          500: "#5349f3",
          600: "#5b4ffa",
          700: "#6454ff",
        },
      },
    },
  },
  plugins: [],
};
