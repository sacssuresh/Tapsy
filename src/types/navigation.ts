/**
 * Navigation parameter types for each screen
 */
export interface GameScreenParams {
  mode?: 'classic' | 'speed' | 'reverse' | 'zen';
}

export interface GameOverScreenParams {
  mode?: 'classic' | 'speed' | 'reverse' | 'zen';
}

export interface MascotSelectorScreenParams {
  // No params currently
}

export type ScreenParams = 
  | GameScreenParams 
  | GameOverScreenParams 
  | MascotSelectorScreenParams 
  | Record<string, never>; // For screens with no params

