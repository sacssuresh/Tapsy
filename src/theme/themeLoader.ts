/**
 * Central theme loader - imports all design system JSON files
 */
import colorsData from '../../assets/colors.json';
import tilesData from '../../assets/tiles.json';
import typographyData from '../../assets/typography.json';
import animationsData from '../../assets/animations.json';
import effectsData from '../../assets/effects.json';
import mascotData from '../../assets/mascot.json';

// Export colors
export const themeColors = colorsData as {
  background: string;
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
  darkBg: string;
  darkSurface: string;
  darkPrimary: string;
};

// Export tile styles
export const tileStyle = tilesData.tileStyle as {
  borderRadius: number;
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: { width: number; height: number };
  elevation: number;
  opacity: number;
};

export const tileBlink = tilesData.tileBlink as {
  scale: number[];
  overlayColor: string;
  duration: number;
};

export const tileTapAnim = tilesData.tileTapAnim as {
  scale: number[];
  duration: number;
  easing: string;
};

// Export typography
export const themeTypography = typographyData as {
  title: {
    fontSize: number;
    fontWeight: string;
    letterSpacing: number;
    color: string;
  };
  subtitle: {
    fontSize: number;
    color: string;
  };
  body: {
    fontSize: number;
    color: string;
  };
  caption: {
    fontSize: number;
    color: string;
  };
};

// Export animations
export const themeAnimations = animationsData as {
  tileTap: {
    scale: number[];
    duration: number;
    easing: string;
  };
  tileBlink: {
    scale: number[];
    overlayOpacity: number[];
    duration: number;
  };
  levelUp: {
    scale: number[];
    opacity: number[];
    duration: number;
  };
  shake: {
    translateX: number[];
    duration: number;
  };
  streakFlame: {
    opacity: number[];
    duration: number;
    loop: boolean;
  };
};

// Export effects
export const themeEffects = effectsData as {
  gradientBackground: {
    colors: string[];
    duration: number;
    loop: boolean;
    opacity: number;
  };
  glassPanel: {
    backgroundColor: string;
    borderRadius: number;
    borderWidth: number;
    borderColor: string;
    blur: number;
    padding: number;
  };
  confetti: {
    particleCount: number;
    colors: string[];
    spread: number;
    startVelocity: number;
  };
};

// Export mascot
export const mascotStyle = mascotData.style as {
  size: number;
  borderRadius: number;
  backgroundColor: string;
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: { width: number; height: number };
};

export const mascotExpressions = mascotData.expressions as {
  happy: string;
  celebrate: string;
  fire: string;
  shock: string;
  sad: string;
  fail: string;
};

