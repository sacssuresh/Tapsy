import { soundManager, type SoundPackName } from './SoundManager';
import soundPacksConfig from './soundpacks.json';
import { warn as logWarn } from '../utils/logger';

/**
 * Loads the bubble sound pack
 * Note: Bubble is the only available sound pack
 */
export async function loadSoundPack(packName: SoundPackName = 'bubble'): Promise<void> {
  const packConfig = soundPacksConfig[packName];
  
  if (!packConfig) {
    logWarn(`Sound pack "${packName}" not found in configuration`);
    return;
  }

  await soundManager.loadPack(packName, packConfig);
}

/**
 * Gets available sound packs from configuration
 * Note: Currently only 'bubble' is available
 */
export function getAvailableSoundPacks(): SoundPackName[] {
  return Object.keys(soundPacksConfig) as SoundPackName[];
}

/**
 * Checks if a sound pack exists in configuration
 * Note: Currently only 'bubble' is valid
 */
export function isValidSoundPack(packName: string): packName is SoundPackName {
  return packName in soundPacksConfig;
}

