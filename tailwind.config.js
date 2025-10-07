import theme from './src/components/theme/theme.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        accent: theme.colors.accent,
      },
      backgroundImage: {
        'gradient-primary': `linear-gradient(to right, ${theme.colors.primary[500]}, ${theme.colors.primary[600]})`,
        'gradient-light': `linear-gradient(to bottom right, ${theme.colors.primary[50]}, ${theme.colors.accent[50]})`,
        'gradient-hero': `linear-gradient(135deg, ${theme.colors.primary[100]} 0%, #ffffff 50%, ${theme.colors.primary[50]} 100%)`,
      }
    },
  },
  plugins: [],
}