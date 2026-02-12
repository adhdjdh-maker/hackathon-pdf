/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Важно: переключение через класс, а не медиа-запрос
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Определяем палитру, которая будет зависеть от переменных
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        card: 'var(--color-card)',
        border: 'var(--color-border)',
      }
    },
  },
  plugins: [],
}
