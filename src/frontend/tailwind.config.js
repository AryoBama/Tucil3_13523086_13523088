/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bluegrey: "#96C2DB",
        bluegreyLight: "#E5EDF1",
        white: "#FFFFFF",
      },
    },
  },
  plugins: [],
}
