/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Food Bites System (Light Mode)
        'fb-primary': '#bb0021',
        'fb-primary-container': '#ea002c',
        'fb-surface': '#fcf9f8',
        'fb-surface-container': '#f0edec',
        'fb-surface-low': '#f6f3f2',
        'fb-surface-lowest': '#ffffff',
        'fb-on-surface': '#1c1b1b',
        'fb-on-surface-variant': '#5e3f3d',
        'fb-outline': '#936e6c',
        'fb-secondary': '#895100',
        'fb-secondary-container': '#fd9d1a',
        'fb-tertiary': '#00685f',

        // Midnight Gastronomy (Dark Mode)
        'dark-bg': '#131315',
        'dark-surface': '#131315',
        'dark-container': '#201f21',
        'dark-low': '#1b1b1d',
        'dark-lowest': '#0e0e10',
        'dark-text': '#fcf9f8',
        'dark-muted': '#a0a0a5',
        'dark-primary': '#ff1e38',
        'dark-primary-container': '#ff5356',
        'dark-border': 'rgba(255, 255, 255, 0.08)',
        'dark-gold': '#ffb77a',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg: '2rem',
        xl: '2.5rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
