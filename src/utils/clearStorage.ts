/**
 * Utility to clear all stored data - use for debugging
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { log, error as logError } from './logger';

const STORAGE_KEY = '@Tapsy:userData';

export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    log('Storage cleared successfully');
  } catch (err) {
    logError('Error clearing storage:', err);
  }
};

