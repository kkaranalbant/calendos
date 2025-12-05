/**
 * Kalendos App Color Palette
 * Based on the brand colors of Kalendos (tropical fruits theme)
 */

export const lightColors = {
  // Primary colors - Green (represents fresh fruits)
  primary: '#4CAF50',
  primaryDark: '#388E3C',
  primaryLight: '#81C784',

  // Secondary colors - Orange (represents tropical vibrancy)
  secondary: '#FF9800',
  secondaryDark: '#F57C00',
  secondaryLight: '#FFB74D',

  // Accent colors
  accent: '#FFC107',

  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  surface: '#FFFFFF',

  // Text colors
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#BDBDBD',
  textInverse: '#FFFFFF',

  // Status colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',

  // Border colors
  border: '#E0E0E0',
  borderLight: '#F5F5F5',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Card & Components
  card: '#FFFFFF',
  cardBorder: '#E0E0E0',

  // Input colors
  inputBackground: '#F5F5F5',
  inputBorder: '#E0E0E0',
  inputFocusBorder: '#4CAF50',

  // Badge colors
  badgeBackground: '#F44336',
  badgeText: '#FFFFFF',

  // Disabled state
  disabled: '#BDBDBD',
  disabledBackground: '#F5F5F5',
};

export const darkColors = {
  // Primary colors - Green (adjusted for dark mode)
  primary: '#66BB6A',
  primaryDark: '#81C784',
  primaryLight: '#4CAF50',

  // Secondary colors - Orange
  secondary: '#FFA726',
  secondaryDark: '#FFB74D',
  secondaryLight: '#FF9800',

  // Accent colors
  accent: '#FFD54F',

  // Background colors
  background: '#121212',
  backgroundSecondary: '#1E1E1E',
  surface: '#1E1E1E',

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textLight: '#808080',
  textInverse: '#000000',

  // Status colors
  success: '#66BB6A',
  error: '#EF5350',
  warning: '#FFA726',
  info: '#42A5F5',

  // Border colors
  border: '#2C2C2C',
  borderLight: '#1E1E1E',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',

  // Card & Components
  card: '#1E1E1E',
  cardBorder: '#2C2C2C',

  // Input colors
  inputBackground: '#2C2C2C',
  inputBorder: '#3C3C3C',
  inputFocusBorder: '#66BB6A',

  // Badge colors
  badgeBackground: '#EF5350',
  badgeText: '#FFFFFF',

  // Disabled state
  disabled: '#505050',
  disabledBackground: '#2C2C2C',
};

// Default export (light mode)
export const colors = lightColors;

export type Colors = typeof lightColors;
