/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        caveat: ['var(--font-caveat)', 'Caveat', 'cursive'],
      },
      colors: {
        surface: '#f5f5f3',
        ink: '#0a0a0a',
        muted: '#6b6b6b',
        border: '#e2e2e0',
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.025em',
      },
    },
  },
  plugins: [],
}
