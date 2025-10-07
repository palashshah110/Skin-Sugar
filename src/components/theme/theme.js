// Theme Configuration - Easy to change colors globally
export const theme = {
  colors: {
    // Primary Colors - Green Nature Theme
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    // Secondary Colors - Earthy tones
    secondary: {
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
    },
    // Accent Colors - Complementary nature tones
    accent: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    }
  },
  gradients: {
    primary: 'from-green-500 to-green-600',
    light: 'from-green-50 to-emerald-50',
    hero: 'from-green-100 via-white to-emerald-50',
    card: 'from-green-50 to-emerald-50'
  },
  branding: {
    companyName: 'Skin Sugars',
    tagline: 'Pure Herbal Luxury',
    features: [
      "100% Natural & Herbal",
      "Sls and Paraben Free", 
      "Plant Based Ingredients",
      "Cruelty Free & Vegan",
      "No Animal By-products"
    ]
  }
};

// CSS Variables for custom styling
export const cssVariables = {
  '--color-primary-50': theme.colors.primary[50],
  '--color-primary-500': theme.colors.primary[500],
  '--color-primary-600': theme.colors.primary[600],
  '--color-secondary-500': theme.colors.secondary[500],
  '--color-accent-500': theme.colors.accent[500],
};

export default theme;