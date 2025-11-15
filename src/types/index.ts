/**
 * Core type definitions for Tapsy game
 */

export type GameMode = 'classic' | 'speed' | 'reverse' | 'zen';

export type TileIndex = 0 | 1 | 2 | 3;

export interface GameState {
  mode: GameMode;
  level: number;
  sequence: TileIndex[];
  playerInput: TileIndex[];
  isPlayingSequence: boolean;
  isGameOver: boolean;
  score: number;
  currentTileIndex: number;
  isPaused: boolean;
}

export interface PersistedData {
  bestScoreByMode: Record<GameMode, number>;
  totalGamesPlayed: number;
  totalPerfectGames: number;
  xp: number;
  currentStreakDays: number;
  lastPlayedDate: string | null;
  ownedThemes: string[];
  ownedSoundPacks: string[];
  selectedSoundPack: string; // 'pastel' | 'bubble' | 'anime'
  hasPremium: boolean;
  settings: {
    soundEnabled: boolean;
    hapticsEnabled: boolean;
    hintsEnabled: boolean;
  };
}

export interface GameModeConfig {
  name: string;
  description: string;
  playbackSpeed: number; // milliseconds between tiles
  scoreMultiplier: number;
}

