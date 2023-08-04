/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['dist/**/*.html', 'src/_includes/components/**/*.webc'],
  theme: {
    extend: {},
    fontFamily: {
      "hero-title": ['Bungee Spice', 'cursive'],
      "hero-subtitle": ['Permanent Marker', 'cursive'],
      "body": ['Titillium Web', 'sans-serif']
    }
  },
  plugins: [],
}

