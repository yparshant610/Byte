/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#bb0021',
        'primary-container': '#ea002c',
        'on-primary': '#ffffff',
        'surface': '#fcf9f8',
        'surface-container': '#f0edec',
        'surface-container-low': '#f6f3f2',
        'surface-container-lowest': '#ffffff',
        'on-surface': '#1c1b1b',
        'on-surface-variant': '#5e3f3d',
        'outline': '#936e6c',
        'tertiary': '#00685f',
        'tertiary-container': '#008379',
        'secondary-container': '#fd9d1a',
        'on-secondary-container': '#663b00',

        // Dark Mode Overrides
        'dark-bg': '#131315',
        'dark-surface': '#131315',
        'dark-container': '#201f21',
        'dark-low': '#1b1b1d',
        'dark-lowest': '#0e0e10',
        'dark-text': '#fcf9f8',
        'dark-muted': '#a0a0a5',
        'dark-primary': '#ff1e38',
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
