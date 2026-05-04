/**
 * Minimal Tailwind v4 config for this project.
 * Ensures index.html and all source files are scanned for utility classes.
 */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
