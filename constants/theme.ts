import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  // Primary colors
  primary: '#8A2BE2', // Main purple
  primaryLight: '#9370DB', // Lighter purple
  primaryDark: '#6A1B9A', // Darker purple

  // Secondary colors
  secondary: '#FF6B6B', // Accent color

  // Background colors
  background: '#F5F5F5', // Light background
  card: '#FFFFFF', // Card background

  // Text colors
  text: '#333333', // Primary text
  textLight: '#666666', // Secondary text
  textDark: '#000000', // Dark text
  textWhite: '#FFFFFF', // White text

  // Status colors
  success: '#4CAF50', // Green
  warning: '#FFC107', // Yellow
  error: '#F44336', // Red
  info: '#2196F3', // Blue

  // Gradient colors
  gradientStart: '#8A2BE2',
  gradientEnd: '#9370DB',

  // Other colors
  border: '#E0E0E0',
  disabled: '#BDBDBD',
  placeholder: '#9E9E9E',

  // Specific UI elements
  progressBar: '#E91E63',
  milestone: '#9C27B0',
};

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 40,
  padding: 24,

  // Font sizes
  largeTitle: 32,
  h1: 30,
  h2: 22,
  h3: 18,
  h4: 16,
  h5: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,

  // App dimensions
  width,
  height,
};

export const FONTS = {
  largeTitle: { fontFamily: 'Poppins', fontSize: SIZES.largeTitle, lineHeight: 40 },
  h1: { fontFamily: 'Poppins', fontSize: SIZES.h1, lineHeight: 36, fontWeight: '700' as const },
  h2: { fontFamily: 'Poppins', fontSize: SIZES.h2, lineHeight: 30, fontWeight: '700' as const },
  h3: { fontFamily: 'Poppins', fontSize: SIZES.h3, lineHeight: 22, fontWeight: '700' as const },
  h4: { fontFamily: 'Poppins', fontSize: SIZES.h4, lineHeight: 20, fontWeight: '700' as const },
  h5: { fontFamily: 'Poppins', fontSize: SIZES.h5, lineHeight: 18, fontWeight: '700' as const },
  body1: { fontFamily: 'Poppins', fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontFamily: 'Poppins', fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontFamily: 'Poppins', fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontFamily: 'Poppins', fontSize: SIZES.body4, lineHeight: 20 },
  body5: { fontFamily: 'Poppins', fontSize: SIZES.body5, lineHeight: 18 },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
