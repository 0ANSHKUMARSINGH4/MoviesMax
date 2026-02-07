/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "dark-main": "#0a0a0a",
        // CHANGED: Renamed to blue-brand and updated hex code
        "blue-brand": "#2563EB", // Vibrant Royal Blue
        "blue-accent": "#60A5FA", // Lighter Blue for accents
      },
      // ADDED: Custom drop shadow for the blue theme
      boxShadow: {
        'blue-glow': '0 0 15px -3px rgba(37, 99, 235, 0.5)',
      }
    },
  },
  plugins: [],
}