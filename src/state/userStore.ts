import { create } from 'zustand';
import type { PersistedData, GameMode } from '../types';
import { loadPersistedData, savePersistedData } from '../utils/storageHelpers';
import { isConsecutiveDay, isToday, getTodayISOString } from '../utils/dateHelpers';

interface UserStore extends PersistedData {
  isLoaded: boolean;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  updateBestScore: (mode: GameMode, score: number) => void;
  updateStreak: () => void;
  incrementGamesPlayed: () => void;
  incrementPerfectGames: () => void;
  updateSettings: (settings: Partial<PersistedData['settings']>) => void;
  resetProgress: () => Promise<void>;
}

const defaultData: PersistedData = {
  username: null,
  bestScoreByMode: {
    classic: 0,
    speed: 0,
    reverse: 0,
    zen: 0,
  },
  totalGamesPlayed: 0,
  totalPerfectGames: 0,
  currentStreakDays: 0,
  lastPlayedDate: null,
  ownedThemes: [],
  ownedSoundPacks: [],
  hasPremium: false,
  settings: {
    soundEnabled: true,
    hapticsEnabled: true,
    hintsEnabled: false,
  },
};

export const useUserStore = create<UserStore>((set, get) => ({
  username: null,
  bestScoreByMode: {
    classic: 0,
    speed: 0,
    reverse: 0,
    zen: 0,
  },
  totalGamesPlayed: 0,
  totalPerfectGames: 0,
  currentStreakDays: 0,
  lastPlayedDate: null,
  ownedThemes: [],
  ownedSoundPacks: [],
  hasPremium: false,
  settings: {
    soundEnabled: true,
    hapticsEnabled: true,
    hintsEnabled: false,
  },
  isLoaded: false,

  loadFromStorage: async () => {
    const data = await loadPersistedData();
    if (data) {
      // Ensure settings is always defined, merge with defaults if missing
      // Also ensure all boolean values are actually booleans (not strings from JSON)
      const mergedData = {
        username: data.username || null,
        bestScoreByMode: data.bestScoreByMode || defaultData.bestScoreByMode,
        totalGamesPlayed: Number(data.totalGamesPlayed) || 0,
        totalPerfectGames: Number(data.totalPerfectGames) || 0,
        currentStreakDays: Number(data.currentStreakDays) || 0,
        lastPlayedDate: data.lastPlayedDate || null,
        ownedThemes: Array.isArray(data.ownedThemes) ? data.ownedThemes : [],
        ownedSoundPacks: Array.isArray(data.ownedSoundPacks) ? data.ownedSoundPacks : [],
        hasPremium: Boolean(data.hasPremium === true || data.hasPremium === 'true'),
        settings: {
          soundEnabled: data.settings?.soundEnabled !== undefined 
            ? Boolean(data.settings.soundEnabled === true || data.settings.soundEnabled === 'true')
            : defaultData.settings.soundEnabled,
          hapticsEnabled: data.settings?.hapticsEnabled !== undefined
            ? Boolean(data.settings.hapticsEnabled === true || data.settings.hapticsEnabled === 'true')
            : defaultData.settings.hapticsEnabled,
          hintsEnabled: data.settings?.hintsEnabled !== undefined
            ? Boolean(data.settings.hintsEnabled === true || data.settings.hintsEnabled === 'true')
            : defaultData.settings.hintsEnabled,
        },
        isLoaded: true,
      };
      set(mergedData);
      
      // Sync sound manager enabled state with loaded settings
      const { soundManager } = await import('../audio/SoundManager');
      soundManager.setEnabled(mergedData.settings.soundEnabled);
    } else {
      set({ 
        ...defaultData, 
        isLoaded: true 
      });
      
      // Sync sound manager enabled state with default settings
      const { soundManager } = await import('../audio/SoundManager');
      soundManager.setEnabled(defaultData.settings.soundEnabled);
    }
  },

  saveToStorage: async () => {
    const state = get();
    // Extract only the data that should be persisted (exclude methods and isLoaded flag)
    const data: PersistedData = {
      username: state.username,
      bestScoreByMode: state.bestScoreByMode,
      totalGamesPlayed: state.totalGamesPlayed,
      totalPerfectGames: state.totalPerfectGames,
      currentStreakDays: state.currentStreakDays,
      lastPlayedDate: state.lastPlayedDate,
      ownedThemes: state.ownedThemes,
      ownedSoundPacks: state.ownedSoundPacks,
      hasPremium: state.hasPremium,
      settings: state.settings,
    };
    await savePersistedData(data);
  },

  updateUsername: async (username: string) => {
    // Normalize username to lowercase for consistency
    set({ username: username.trim().toLowerCase() || null });
    await get().saveToStorage();
  },

  updateBestScore: (mode: GameMode, score: number) => {
    const currentBest = get().bestScoreByMode[mode];
    if (score > currentBest) {
      set((state) => ({
        bestScoreByMode: {
          ...state.bestScoreByMode,
          [mode]: score,
        },
      }));
      // Save immediately after update
      setTimeout(() => get().saveToStorage(), 0);
    }
  },

  updateStreak: () => {
    const state = get();
    const today = getTodayISOString();
    const lastPlayed = state.lastPlayedDate
      ? new Date(state.lastPlayedDate)
      : null;

    if (!lastPlayed) {
      // First time playing
      set({ currentStreakDays: 1, lastPlayedDate: today });
    } else if (isToday(lastPlayed)) {
      // Already played today, don't increment
      return;
    } else if (isConsecutiveDay(lastPlayed, new Date())) {
      // Consecutive day, increment streak
      set((prev) => ({
        currentStreakDays: prev.currentStreakDays + 1,
        lastPlayedDate: today,
      }));
    } else {
      // Streak broken, reset to 1
      set({ currentStreakDays: 1, lastPlayedDate: today });
    }
    // Save immediately after update
    setTimeout(() => get().saveToStorage(), 0);
  },

  incrementGamesPlayed: () => {
    set((state) => ({ totalGamesPlayed: state.totalGamesPlayed + 1 }));
    get().saveToStorage();
  },

  incrementPerfectGames: () => {
    set((state) => ({ totalPerfectGames: state.totalPerfectGames + 1 }));
    get().saveToStorage();
  },

  updateSettings: (newSettings: Partial<PersistedData['settings']>) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
    get().saveToStorage();
    
    // Sync sound manager enabled state if soundEnabled changed
    if (newSettings.soundEnabled !== undefined) {
      const { soundManager } = require('../audio/SoundManager');
      soundManager.setEnabled(newSettings.soundEnabled);
    }
  },

  resetProgress: async () => {
    const state = get();
    const username = state.username;
    
    // Reset local data
    set({ ...defaultData });
    await get().saveToStorage();
    
    // Delete Firebase leaderboard entry if username exists
    if (username && username.trim()) {
      try {
        const { deleteUserLeaderboard } = await import('../services/leaderboardService');
        await deleteUserLeaderboard(username);
      } catch (error) {
        console.warn('Error deleting user leaderboard:', error);
        // Fail silently - local reset already completed
      }
    }
  },
}));

