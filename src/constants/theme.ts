export const Colors = {
  // Primary - warm saffron/kumkum inspired
  primary: '#C45B28',
  primaryLight: '#E8854A',
  primaryDark: '#8B3A12',

  // Neutrals
  white: '#FFFFFF',
  background: '#FAFAF8',
  surface: '#FFFFFF',
  border: '#E8E4DF',
  borderLight: '#F0ECE8',

  // Text
  text: '#1A1A1A',
  textSecondary: '#6B6560',
  textTertiary: '#9B9590',
  textInverse: '#FFFFFF',

  // Accents
  accent: '#2E7D52',
  accentLight: '#E8F5EE',
  gold: '#B8860B',
  goldLight: '#FFF8E7',

  // Semantic
  error: '#C62828',
  errorLight: '#FFEBEE',
  success: '#2E7D32',
  successLight: '#E8F5E9',

  // Map
  mapPin: '#C45B28',
  mapPinSelected: '#8B3A12',
};

export const Typography = {
  // Display
  displayLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },

  // Headings
  heading: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  subheading: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
  },

  // Body
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },

  // Labels
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  labelSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.3,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};
