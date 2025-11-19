import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ImageSourcePropType } from 'react-native';
import type { GameMode } from '../types';
import { error as logError } from '../utils/logger';

export type MascotName = 'tapsy-kid' | 'tapsy-girl' | 'starry' | 'sprout';

const STORAGE_KEY = 'selectedMascot';

// Image cache using require() for all mascot WebPs
const mascotCache: Record<MascotName, ImageSourcePropType> = {
  'tapsy-kid': require('../../assets/mascots/tapsy-kid.webp'),
  'tapsy-girl': require('../../assets/mascots/tapsy-girl.webp'),
  'starry': require('../../assets/mascots/starry.webp'),
  'sprout': require('../../assets/mascots/sprout.webp'),
};

// Mode to mascot mapping
const modeToMascot: Record<GameMode, MascotName> = {
  classic: 'tapsy-kid',
  speed: 'tapsy-girl',
  reverse: 'starry',
  zen: 'sprout',
};

/**
 * Get mascot image source by name
 */
export function getMascot(name: MascotName): ImageSourcePropType {
  return mascotCache[name] || mascotCache['tapsy-kid'];
}

/**
 * Get mascot image source for a game mode
 */
export function getMascotForMode(mode: GameMode): ImageSourcePropType {
  const mascotName = modeToMascot[mode] || 'tapsy-kid';
  return getMascot(mascotName);
}

/**
 * Get mascot name for a game mode
 */
export function getMascotNameForMode(mode: GameMode): MascotName {
  return modeToMascot[mode] || 'tapsy-kid';
}

/**
 * Get user's selected mascot from AsyncStorage
 * Falls back to 'tapsy-kid' if not set
 * Migrates invalid mascots (puffy, chicky, bubbly) to 'tapsy-kid'
 */
export async function getUserMascot(): Promise<MascotName> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      if (isValidMascotName(stored)) {
        return stored as MascotName;
      } else {
        // Migrate invalid mascot (puffy, chicky, bubbly) to tapsy-kid
        await setUserMascot('tapsy-kid');
        return 'tapsy-kid';
      }
    }
    return 'tapsy-kid';
  } catch (err) {
    logError('Error loading selected mascot:', err);
    return 'tapsy-kid';
  }
}

/**
 * Save user's selected mascot to AsyncStorage
 */
export async function setUserMascot(name: MascotName): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, name);
  } catch (err) {
    logError('Error saving selected mascot:', err);
  }
}

/**
 * Check if a string is a valid mascot name
 */
function isValidMascotName(name: string): boolean {
  return Object.keys(mascotCache).includes(name);
}

/**
 * List of all available mascots with metadata for selector screen
 */
export const mascotsList: Array<{ name: MascotName; displayName: string; description: string }> = [
  {
    name: 'tapsy-kid',
    displayName: 'Tapsy Kid',
    description: 'The friendly default mascot',
  },
  {
    name: 'tapsy-girl',
    displayName: 'Tapsy Girl',
    description: 'The friendly mascot companion',
  },
  {
    name: 'starry',
    displayName: 'Starry',
    description: 'Magical and mysterious',
  },
  {
    name: 'sprout',
    displayName: 'Sprout',
    description: 'Calm and peaceful',
  },
];

/**
 * Ordered list of mascots for cycling on Home screen
 */
export const availableMascots: MascotName[] = ['tapsy-kid', 'tapsy-girl', 'sprout', 'starry'];

/**
 * Get next mascot in the cycle
 */
export function getNextMascot(currentMascot: MascotName): MascotName {
  const currentIndex = availableMascots.indexOf(currentMascot);
  const nextIndex = (currentIndex + 1) % availableMascots.length;
  return availableMascots[nextIndex];
}

