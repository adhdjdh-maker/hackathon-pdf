/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#111111',
        accent: '#00FFD0',
        card: '#18181b',
        border: '#232323',
      },
    },
  },
  plugins: [],
};
