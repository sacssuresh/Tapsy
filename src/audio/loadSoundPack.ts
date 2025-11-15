import { soundManager, type SoundPackName } from './SoundManager';
import soundPacksConfig from './soundpacks.json';
import { warn as logWarn } from '../utils/logger';

/**
 * Loads a sound pack by name
 * Reads configuration from soundpacks.json
 */
export async function loadSoundPack(packName: SoundPackName): Promise<void> {
  const packConfig = soundPacksConfig[packName];
  
  if (!packConfig) {
    logWarn(`Sound pack "${packName}" not found in configuration`);
    return;
  }

  await soundManager.loadPack(packName, packConfig);
}

/**
 * Gets available sound packs from configuration
 */
export function getAvailableSoundPacks(): SoundPackName[] {
  return Object.keys(soundPacksConfig) as SoundPackName[];
}

/**
 * Checks if a sound pack exists in configuration
 */
export function isValidSoundPack(packName: string): packName is SoundPackName {
  return packName in soundPacksConfig;
}

