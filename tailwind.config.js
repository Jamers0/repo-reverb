/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pw-green': '#00A99D',
        'pw-dark-blue': '#2b2b38',
        'pw-gold': '#B7760C',
        'pw-sidebar-bg': '#F8F9FA',
        'pw-text-secondary': '#6c757d',
      },
    },
  },
  plugins: [],
}
