import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PersistedData } from '../types';
import { error as logError } from './logger';

const STORAGE_KEY = '@Tapsy:userData';

/**
 * Loads persisted data from AsyncStorage
 */
export const loadPersistedData = async (): Promise<PersistedData | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as PersistedData;
    }
    return null;
  } catch (err) {
    logError('Error loading persisted data:', err);
    return null;
  }
};

/**
 * Saves data to AsyncStorage
 */
export const savePersistedData = async (data: PersistedData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    logError('Error saving persisted data:', err);
  }
};

/**
 * Clears all persisted data
 */
export const clearPersistedData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    logError('Error clearing persisted data:', err);
  }
};

