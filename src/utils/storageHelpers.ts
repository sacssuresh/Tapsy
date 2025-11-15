import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PersistedData } from '../types';

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
  } catch (error) {
    console.error('Error loading persisted data:', error);
    return null;
  }
};

/**
 * Saves data to AsyncStorage
 */
export const savePersistedData = async (data: PersistedData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving persisted data:', error);
  }
};

/**
 * Clears all persisted data
 */
export const clearPersistedData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing persisted data:', error);
  }
};

