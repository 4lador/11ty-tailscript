const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    purgecss:{
      content: ['./**/*.html']
    },
    autoprefixer: {},
    cssnano: {}
  },
}
