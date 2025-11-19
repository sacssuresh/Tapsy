/**
 * Theme definitions for light and dark modes
 */
import { themeColors, themeTypography } from './themeLoader';
import { spacing } from './spacing';
import type { TileIndex } from '../types';

export interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  surface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  accentAqua: string;
  success: string;
  fail: string;
  warning: string;
  tileBlue: string;
  tilePink: string;
  tileMint: string;
  tileYellow: string;
}

export interface Theme {
  colors: ThemeColors;
  typography: typeof themeTypography;
  spacing: typeof spacing;
  tileColors: readonly [string, string, string, string];
}

// Light theme - using existing colors
export const lightTheme: Theme = {
  colors: {
    background: themeColors.background,
    backgroundSecondary: '#F0F0F2',
    surface: themeColors.surface,
    border: themeColors.border,
    textPrimary: themeColors.textPrimary,
    textSecondary: themeColors.textSecondary,
    primary: themeColors.primary,
    accentAqua: themeColors.accentAqua,
    success: themeColors.success,
    fail: themeColors.fail,
    warning: themeColors.warning,
    tileBlue: themeColors.tileBlue,
    tilePink: themeColors.tilePink,
    tileMint: themeColors.tileMint,
    tileYellow: themeColors.tileYellow,
  },
  typography: themeTypography,
  spacing,
  tileColors: [
    themeColors.tileBlue,
    themeColors.tilePink,
    themeColors.tileMint,
    themeColors.tileYellow,
  ] as const,
};

// Dark theme with neon accents
export const darkTheme: Theme = {
  colors: {
    background: '#0E0E10',
    backgroundSecondary: '#151518',
    surface: '#1A1A1D',
    border: '#2A2A2F',
    textPrimary: '#F5F5F7',
    textSecondary: '#B0B0B5',
    primary: '#7A57FD',
    accentAqua: '#5EEBFF',
    success: '#4ADE80',
    fail: '#FF5151',
    warning: '#FBBF24',
    // Neon tile colors
    tileBlue: '#5EEBFF', // Cyan
    tilePink: '#FF75D8', // Pink
    tileMint: '#D0FF5C', // Lime
    tileYellow: '#FFB562', // Orange
  },
  typography: {
    ...themeTypography,
    title: {
      ...themeTypography.title,
      color: '#F5F5F7',
    },
    subtitle: {
      ...themeTypography.subtitle,
      color: '#B0B0B5',
    },
    body: {
      ...themeTypography.body,
      color: '#F5F5F7',
    },
    caption: {
      ...themeTypography.caption,
      color: '#B0B0B5',
    },
  },
  spacing,
  tileColors: ['#5EEBFF', '#FF75D8', '#D0FF5C', '#FFB562'] as const, // Cyan, Pink, Lime, Orange
};

