import { Audio } from 'expo-av';
import type { TileIndex } from '../types';

/**
 * Manages game sounds using Expo AV
 * Abstracts sound playback behind an interface for easy swapping
 */
class SoundManager {
  private sounds: Map<TileIndex, Audio.Sound> = new Map();
  private gameOverSound: Audio.Sound | null = null;
  private isEnabled: boolean = true;

  /**
   * Loads all game sounds
   * Note: Sound files are optional - app will work without them
   */
  async loadSounds(): Promise<void> {
    try {
      // Sound files don't exist yet, so we'll skip loading for now
      // TODO: Add sound files to assets/sounds/ and uncomment below
      /*
      const tileSoundFiles = [
        require('../../assets/sounds/tile1.mp3'),
        require('../../assets/sounds/tile2.mp3'),
        require('../../assets/sounds/tile3.mp3'),
        require('../../assets/sounds/tile4.mp3'),
      ];

      for (let i = 0; i < 4; i++) {
        try {
          const { sound } = await Audio.Sound.createAsync(tileSoundFiles[i], {
            shouldPlay: false,
            volume: 0.5,
          });
          this.sounds.set(i as TileIndex, sound);
        } catch (error) {
          console.warn(`Could not load tile sound ${i + 1}:`, error);
        }
      }

      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/gameover.mp3'),
          {
            shouldPlay: false,
            volume: 0.4,
          }
        );
        this.gameOverSound = sound;
      } catch (error) {
        console.warn('Could not load game over sound:', error);
      }
      */
    } catch (error) {
      console.error('Error loading sounds:', error);
    }
  }

  /**
   * Plays sound for a specific tile
   */
  async playTileSound(tileIndex: TileIndex): Promise<void> {
    if (!this.isEnabled) return;
    
    const sound = this.sounds.get(tileIndex);
    if (sound) {
      try {
        await sound.replayAsync();
      } catch (error) {
        console.error(`Error playing tile sound ${tileIndex}:`, error);
      }
    }
  }

  /**
   * Plays game over sound
   */
  async playGameOverSound(): Promise<void> {
    if (!this.isEnabled) return;
    
    if (this.gameOverSound) {
      try {
        await this.gameOverSound.replayAsync();
      } catch (error) {
        console.error('Error playing game over sound:', error);
      }
    }
  }

  /**
   * Sets sound enabled/disabled
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Cleans up sound resources
   */
  async unloadSounds(): Promise<void> {
    for (const sound of this.sounds.values()) {
      await sound.unloadAsync();
    }
    if (this.gameOverSound) {
      await this.gameOverSound.unloadAsync();
    }
    this.sounds.clear();
    this.gameOverSound = null;
  }
}

export const soundManager = new SoundManager();

