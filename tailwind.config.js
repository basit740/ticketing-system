/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/admin/*.{html,js}", "./dist/client/*.{html,js}", "./dist/JS/*.{html,js}",],
  theme: {
    extend: {
      display: ['group-focus'],
      fontFamily: {
        poppins: "'Poppins', sans-serif"
      }
    },
  },
  plugins: [],
}

