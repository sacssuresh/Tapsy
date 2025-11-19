import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import type { TileIndex } from '../types';
import { warn as logWarn, error as logError } from '../utils/logger';

/**
 * Sound pack configuration type
 */
export type SoundPackName = 'bubble';

/**
 * Sound name type
 */
export type SoundName = 'tile0' | 'tile1' | 'tile2' | 'tile3' | 'success' | 'fail';

/**
 * Multi-pack sound manager using Expo AV
 * Note: expo-av is deprecated but still works in SDK 54
 * TODO: Migrate to expo-audio when stable API is available
 */
class SoundManager {
  private sounds: Map<SoundName, Audio.Sound> = new Map();
  private soundInstances: Map<SoundName, Audio.Sound[]> = new Map(); // Multiple instances for overlapping
  private currentPack: SoundPackName | null = null;
  private isEnabled: boolean = true;
  private isLoading: boolean = false;
  private readonly MAX_INSTANCES = 3; // Max overlapping instances per sound

  /**
   * Loads a sound pack asynchronously
   * Unloads previous pack if one is loaded
   */
  async loadPack(packName: SoundPackName, soundPackConfig: Record<string, string>): Promise<void> {
    // Skip if same pack is already loaded
    if (this.currentPack === packName && this.sounds.size > 0) {
      return;
    }

    if (this.isLoading) {
      // Wait for current load to complete, then check if we still need to load
      return new Promise<void>((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.isLoading) {
            clearInterval(checkInterval);
            // Check again if pack is loaded
            if (this.currentPack === packName && this.sounds.size > 0) {
              resolve();
            } else {
              // Load the requested pack
              this.loadPack(packName, soundPackConfig).then(resolve);
            }
          }
        }, 100);
      });
    }

    // Unload previous pack if loaded
    if (this.currentPack && this.currentPack !== packName) {
      await this.unloadSounds();
    }

    this.isLoading = true;
    this.currentPack = packName;

      try {
        // Ensure conservative audio mode to avoid background playback
        try {
          await Audio.setAudioModeAsync({
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
            allowsRecordingIOS: false,
            playsInSilentModeIOS: false,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          });
        } catch (err) {
          logWarn('Failed to set audio mode', err);
        }
      // Load all sounds from the pack configuration
      const soundEntries = Object.entries(soundPackConfig) as [SoundName, string][];
      
      for (const [soundName, soundPath] of soundEntries) {
        try {
          // Get sound module using pack name and sound name
          const soundModule = this.getSoundModule(packName, soundName);
          
          if (soundModule) {
            // Create primary sound instance
            const { sound } = await Audio.Sound.createAsync(soundModule, {
              shouldPlay: false,
              volume: 0.5,
            });
            this.sounds.set(soundName, sound);
            
            // Pre-create additional instances for overlapping playback
            const instances: Audio.Sound[] = [sound];
            for (let i = 1; i < this.MAX_INSTANCES; i++) {
              try {
                const { sound: instance } = await Audio.Sound.createAsync(soundModule, {
                  shouldPlay: false,
                  volume: 0.5,
                });
                instances.push(instance);
              } catch (err) {
                logWarn(`Could not create instance ${i} for ${soundName}:`, err);
              }
            }
            this.soundInstances.set(soundName, instances);
          } else {
            logWarn(`Sound module not found: ${packName}_${soundName}`);
          }
        } catch (err) {
          logWarn(`Could not load sound ${soundName} from pack ${packName}:`, err);
        }
      }
    } catch (err) {
      logError(`Error loading sound pack ${packName}:`, err);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Gets the sound module using require() based on pack name and sound name
   * React Native doesn't support dynamic requires, so we use a mapping function
   * Returns a number (asset ID) from require() or null if not found
   */
  private getSoundModule(packName: SoundPackName, soundName: string): number | null {
    try {
      // Map pack name + sound name to require() calls
      // Extract the actual filename from soundName (e.g., "tile0" -> "tile1")
      const soundFileMap: Record<string, number> = {
        // Bubble pack - files are in assets/sounds/bubble/
        'bubble_tile0': require('../../assets/sounds/bubble/bubble_tile1.mp3'),
        'bubble_tile1': require('../../assets/sounds/bubble/bubble_tile2.mp3'),
        'bubble_tile2': require('../../assets/sounds/bubble/bubble_tile3.mp3'),
        'bubble_tile3': require('../../assets/sounds/bubble/bubble_tile4.mp3'),
        'bubble_success': require('../../assets/sounds/bubble/bubble_success.mp3'),
        'bubble_fail': require('../../assets/sounds/bubble/bubble_fail.mp3'),
      };

      const key = `${packName}_${soundName}`;
      return soundFileMap[key] || null;
    } catch (error) {
      logWarn(`Sound file not found: ${packName}_${soundName}`, error);
      return null;
    }
  }

  /**
   * Plays a sound by name
   * Uses multiple instances to allow overlapping sounds
   * Does not block UI - fire and forget
   */
  play(soundName: SoundName): void {
    if (!this.isEnabled) return;

    const instances = this.soundInstances.get(soundName);
    if (!instances || instances.length === 0) {
      // Fallback to single instance if no instances available
      const sound = this.sounds.get(soundName);
      if (sound) {
        this.playSingleSound(sound, soundName);
      }
      return;
    }

    // Try to find and use an available instance
    // Use a simple round-robin approach with stop/restart for overlapping
    let instanceIndex = 0;
    const tryPlay = (index: number) => {
      if (index >= instances.length) {
        // All instances tried, use first one and force stop/restart
        const instance = instances[0];
        instance.stopAsync()
          .then(() => {
            instance.setPositionAsync(0)
              .then(() => instance.playAsync())
              .catch(() => {
                // If that fails, just try to play
                instance.playAsync().catch(() => {});
              });
          })
          .catch(() => {
            // If stop fails, try to play anyway
            instance.setPositionAsync(0)
              .then(() => instance.playAsync())
              .catch(() => instance.playAsync().catch(() => {}));
          });
        return;
      }

      const instance = instances[index];
      instance.getStatusAsync()
        .then((status) => {
          if (status.isLoaded && !status.isPlaying) {
            // Found available instance, use it
            instance.setPositionAsync(0)
              .then(() => instance.playAsync())
              .catch(() => {
                // If setPosition fails, try play anyway
                instance.playAsync().catch(() => {});
              });
          } else {
            // This instance is busy, try next one
            tryPlay(index + 1);
          }
        })
        .catch(() => {
          // Status check failed, try to use this instance anyway
          instance.setPositionAsync(0)
            .then(() => instance.playAsync())
            .catch(() => {
              // If that fails, try next instance
              tryPlay(index + 1);
            });
        });
    };

    tryPlay(0);
  }

  /**
   * Helper to play a single sound instance
   */
  private playSingleSound(sound: Audio.Sound, soundName: SoundName): void {
    sound.stopAsync()
      .then(() => {
        sound.setPositionAsync(0)
          .then(() => sound.playAsync())
          .catch(() => {
            // If setPosition fails, try play anyway
            sound.playAsync().catch((err) => {
              console.error(`Error playing sound ${soundName}:`, err);
            });
          });
      })
      .catch(() => {
        // If stop fails, try to set position and play
        sound.setPositionAsync(0)
          .then(() => sound.playAsync())
          .catch(() => {
            // Last resort: just try to play
            sound.playAsync().catch((err) => {
              logError(`Error playing sound ${soundName}:`, err);
            });
          });
      });
  }

  /**
   * Plays tile sound by index (for backward compatibility)
   */
  playTileSound(tileIndex: TileIndex): void {
    const soundName: SoundName = `tile${tileIndex}` as SoundName;
    this.play(soundName);
  }

  /**
   * Sets sound enabled/disabled
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Mute immediately and stop any playing sounds when app backgrounds
   */
  async setAppActive(isActive: boolean): Promise<void> {
    this.isEnabled = isActive;
    if (!isActive) {
      const stopPromises: Promise<void>[] = [];
      for (const instances of this.soundInstances.values()) {
        for (const instance of instances) {
          stopPromises.push(
            instance.stopAsync().catch(() => {})
          );
        }
      }
      await Promise.all(stopPromises);
    }
  }

  /**
   * Gets current loaded pack
   */
  getCurrentPack(): SoundPackName | null {
    return this.currentPack;
  }

  /**
   * Checks if a pack is loaded
   */
  isPackLoaded(packName: SoundPackName): boolean {
    return this.currentPack === packName && this.sounds.size > 0;
  }

  /**
   * Unloads all sounds and clears the cache
   */
  async unloadSounds(): Promise<void> {
    const unloadPromises: Promise<void>[] = [];
    
    // Unload all instances
    for (const instances of this.soundInstances.values()) {
      for (const instance of instances) {
        unloadPromises.push(
          instance.unloadAsync().catch((err) => {
            logWarn('Error unloading sound instance:', err);
          })
        );
      }
    }

    await Promise.all(unloadPromises);
    this.sounds.clear();
    this.soundInstances.clear();
    this.currentPack = null;
  }
}

export const soundManager = new SoundManager();

