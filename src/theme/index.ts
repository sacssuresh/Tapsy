/**
 * Unified theme export - now uses JSON design system
 */
import { spacing } from './spacing';
import {
  themeColors,
  tileStyle,
  tileBlink,
  tileTapAnim,
  themeTypography,
  themeAnimations,
  themeEffects,
  mascotStyle,
  mascotExpressions,
} from './themeLoader';

// Re-export spacing (still using the TypeScript file)
export { spacing };

// Export all theme data from JSON
export const colors = themeColors;
export const typography = themeTypography;
export const tiles = {
  style: tileStyle,
  blink: tileBlink,
  tapAnim: tileTapAnim,
};
export const animations = themeAnimations;
export const effects = themeEffects;
export const mascot = {
  style: mascotStyle,
  expressions: mascotExpressions,
};

// Tile colors array for easy access
export const tileColors = [
  colors.tileBlue,
  colors.tilePink,
  colors.tileMint,
  colors.tileYellow,
] as const;

export const theme = {
  colors,
  typography,
  spacing,
  tiles,
  animations,
  effects,
  mascot,
  tileColors,
};

