
import { Dimensions, Platform, TextStyle } from 'react-native';

const { width, height } = Dimensions.get('window');

// Font family mapping for different weights
export const FONT_FAMILY = {
  regular: 'Poppins',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  black: 'Poppins_900Black',
};

// Helper function to get the correct font family based on weight
export const getFontFamily = (weight?: '400' | '500' | '600' | '700' | '900'): string => {
  switch (weight) {
    case '500': return FONT_FAMILY.medium;
    case '600': return FONT_FAMILY.semibold;
    case '700': return FONT_FAMILY.bold;
    case '900': return FONT_FAMILY.black;
    default: return FONT_FAMILY.regular;
  }
};

export const COLORS = {
  // Primary colors
  primary: '#8A2BE2', // Main purple
  primaryLight: '#9370DB', // Lighter purple
  primaryDark: '#6A1B9A', // Darker purple

  // Secondary colors
  secondary: '#FF6B6B', // Accent color

  // Background colors
  background: '#FFFFFF', // Light background
  card: '#FFFFFF', // Card background

  // Text colors
  text: '#1B1C39', // Primary text
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

  // Mizan gradient colors
  mizanGradientColors: ['#D155FF', '#B532F2', '#A016E8', '#9406E2', '#8F00E0', '#A08CFF'],

  // Other colors
  border: '#E0E0E0',
  disabled: '#BDBDBD',
  placeholder: '#B3B4CE',

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
  h1: 32,
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

// Helper function to create font styles with proper weight mapping
export const createFontStyle = (
  size: number,
  weight: '400' | '500' | '600' | '700' | '900' = '400',
  lineHeight?: number
): TextStyle => {
  return {
    fontFamily: getFontFamily(weight),
    fontSize: size,
    ...(lineHeight ? { lineHeight } : {}),
  };
};

export const FONTS = {
  // Base styles with regular weight (400)
  largeTitle: { fontFamily: FONT_FAMILY.regular, fontSize: SIZES.largeTitle, lineHeight: 40 },
  h1: { fontFamily: FONT_FAMILY.bold, fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: FONT_FAMILY.bold, fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: FONT_FAMILY.bold, fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: FONT_FAMILY.bold, fontSize: SIZES.h4, lineHeight: 20 },
  h5: { fontFamily: FONT_FAMILY.bold, fontSize: SIZES.h5, lineHeight: 18 },
  body1: { fontFamily: FONT_FAMILY.regular, fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontFamily: FONT_FAMILY.regular, fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontFamily: FONT_FAMILY.regular, fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontFamily: FONT_FAMILY.regular, fontSize: SIZES.body4, lineHeight: 20 },
  body5: { fontFamily: FONT_FAMILY.regular, fontSize: SIZES.body5, lineHeight: 18 },

  // Helper method to get font style with specific weight
  // Usage: {...FONTS.weight('600', 'body3')} or {...FONTS.weight('600', 16, 22)}
  weight: (
    weight: '400' | '500' | '600' | '700' | '900',
    sizeOrType: number | keyof typeof SIZES | 'body1' | 'body2' | 'body3' | 'body4' | 'body5' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'largeTitle',
    lineHeight?: number
  ): TextStyle => {
    // If sizeOrType is a string (predefined size name)
    if (typeof sizeOrType === 'string') {
      if (sizeOrType in SIZES) {
        // If it's a SIZES key
        return createFontStyle(SIZES[sizeOrType as keyof typeof SIZES], weight, lineHeight);
      } else {
        // If it's a predefined font style (body1, h1, etc.)
        const baseStyle = FONTS[sizeOrType as keyof typeof FONTS] as TextStyle;
        return {
          ...baseStyle,
          fontFamily: getFontFamily(weight),
        };
      }
    }
    // If sizeOrType is a number (custom font size)
    return createFontStyle(sizeOrType, weight, lineHeight);
  },

  // Convenience methods for specific weights
  medium: (
    sizeOrType: number | keyof typeof SIZES | 'body1' | 'body2' | 'body3' | 'body4' | 'body5' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'largeTitle',
    lineHeight?: number
  ): TextStyle => FONTS.weight('500', sizeOrType, lineHeight),

  semibold: (
    sizeOrType: number | keyof typeof SIZES | 'body1' | 'body2' | 'body3' | 'body4' | 'body5' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'largeTitle',
    lineHeight?: number
  ): TextStyle => FONTS.weight('600', sizeOrType, lineHeight),

  bold: (
    sizeOrType: number | keyof typeof SIZES | 'body1' | 'body2' | 'body3' | 'body4' | 'body5' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'largeTitle',
    lineHeight?: number
  ): TextStyle => FONTS.weight('700', sizeOrType, lineHeight),
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
