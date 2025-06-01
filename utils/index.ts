import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Based on iPhone 13 Pro Max's scale
const wscale: number = SCREEN_WIDTH / 428;
const hscale: number = SCREEN_HEIGHT / 926;

/**
 * Normalize size for responsive UI
 * @param size - Size to normalize
 * @param based - Based on width or height
 * @returns Normalized size
 */
export function normalize(size: number, based: 'width' | 'height' = 'width'): number {
  const newSize = based === 'height' ? size * hscale : size * wscale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
}

/**
 * Format currency
 * @param amount - Amount to format
 * @param currency - Currency symbol
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = '$'): string {
  return `${currency}${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
}

/**
 * Validate email
 * @param email - Email to validate
 * @returns Boolean indicating if email is valid
 */
export function validateEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Validate password
 * @param password - Password to validate
 * @returns Boolean indicating if password is valid
 */
export function validatePassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param length - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Calculate percentage
 * @param value - Current value
 * @param total - Total value
 * @returns Percentage
 */
export function calculatePercentage(value: number, total: number): number {
  return Math.round((value / total) * 100);
}

/**
 * Sleep function for async operations
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after ms
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Additional responsive design utilities

/**
 * Get responsive width based on screen width
 * @param percentage - Percentage of screen width (0-100)
 * @returns Width in pixels
 */
export function getResponsiveWidth(percentage: number): number {
  return (SCREEN_WIDTH * percentage) / 100;
}

/**
 * Get responsive height based on screen height
 * @param percentage - Percentage of screen height (0-100)
 * @returns Height in pixels
 */
export function getResponsiveHeight(percentage: number): number {
  return (SCREEN_HEIGHT * percentage) / 100;
}

/**
 * Get responsive font size based on screen width
 * @param size - Base font size
 * @returns Responsive font size
 */
export function getResponsiveFontSize(size: number): number {
  return normalize(size, 'width');
}

/**
 * Check if device is tablet (width > 768)
 * @returns Boolean indicating if device is tablet
 */
export function isTablet(): boolean {
  return SCREEN_WIDTH >= 768;
}

/**
 * Check if device is small phone (width < 375)
 * @returns Boolean indicating if device is small phone
 */
export function isSmallPhone(): boolean {
  return SCREEN_WIDTH < 375;
}

/**
 * Get device type
 * @returns Device type string
 */
export function getDeviceType(): 'small' | 'medium' | 'large' | 'tablet' {
  if (SCREEN_WIDTH >= 768) return 'tablet';
  if (SCREEN_WIDTH >= 414) return 'large';
  if (SCREEN_WIDTH >= 375) return 'medium';
  return 'small';
}

/**
 * Get responsive padding based on device type
 * @param base - Base padding value
 * @returns Responsive padding
 */
export function getResponsivePadding(base: number): number {
  const deviceType = getDeviceType();
  switch (deviceType) {
    case 'tablet': return base * 1.5;
    case 'large': return base * 1.2;
    case 'medium': return base;
    case 'small': return base * 0.8;
    default: return base;
  }
}
