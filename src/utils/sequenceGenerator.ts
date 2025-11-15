import type { TileIndex } from '../types';

/**
 * Generates a random tile index (0-3)
 */
const generateRandomTile = (): TileIndex => {
  return Math.floor(Math.random() * 4) as TileIndex;
};

/**
 * Generates a new sequence of the specified length
 */
export const generateSequence = (length: number): TileIndex[] => {
  return Array.from({ length }, generateRandomTile);
};

/**
 * Extends an existing sequence by one tile
 */
export const extendSequence = (sequence: TileIndex[]): TileIndex[] => {
  return [...sequence, generateRandomTile()];
};

