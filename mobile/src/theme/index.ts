import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius } from './spacing';

/**
 * Kalendos App Theme
 * Centralized theme configuration for consistent styling across the app
 */

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;

export { colors, typography, spacing, borderRadius };
