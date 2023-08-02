/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['dist/**/*.html', 'src/_includes/components/**/*.webc'],
  theme: {
    extend: {},
    fontFamily: {
      "hero-title": ['Bungee Spice', 'Arial', 'cursive'],
      "hero-subtitle": ['Permanent Marker', 'Arial', 'cursive'],
      "body": ['Titillium Web', 'Arial', 'sans-serif']
    }
  },
  plugins: [],
}

