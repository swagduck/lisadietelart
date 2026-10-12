import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#f7f6f4',
        ink: '#2b2a2e',
        muted: '#6f6c72',
        sage: '#5f7b6b',
        blush: '#ecd3d8',
        mist: '#dfe8e2',
        line: '#e3dfda',
      },
      fontFamily: {
        sans: ['var(--font-jost)', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'serif'],
        heading: ['var(--font-cormorant)', 'serif'],
        body: ['var(--font-jost)', 'sans-serif'],
      },
      screens: {
        xs: '475px',
      },
      letterSpacing: {
        widest: '.2em',
        loose: '.15em',
      },
    },
  },
  plugins: [],
};

export default config;
