/**
 * Utility to clear all stored data - use for debugging
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@Tapsy:userData';

export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('Storage cleared successfully');
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

