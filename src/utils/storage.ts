/**
 * Centralized storage utilities with documented keys
 * All AsyncStorage keys are defined here for consistency
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PersistedData } from '../types';
import { error as logError } from './logger';

/**
 * Storage keys used throughout the app
 * All keys should be prefixed with '@Tapsy:' for namespacing
 */
export const STORAGE_KEYS = {
  USER_DATA: '@Tapsy:userData',
  SELECTED_MASCOT: 'selectedMascot', // Used by MascotManager
} as const;

/**
 * Loads persisted data from AsyncStorage
 * @returns Parsed data or null if not found or error
 */
export const loadPersistedData = async (): Promise<PersistedData | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
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
 * @param data - Data to persist
 */
export const savePersistedData = async (data: PersistedData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
  } catch (err) {
    logError('Error saving persisted data:', err);
  }
};

/**
 * Clears all persisted data
 */
export const clearPersistedData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  } catch (err) {
    logError('Error clearing persisted data:', err);
  }
};

/**
 * Gets a specific item from storage
 * @param key - Storage key
 * @returns Item value or null
 */
export const getStorageItem = async <T = string>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (err) {
    logError(`Error getting storage item ${key}:`, err);
    return null;
  }
};

/**
 * Sets a specific item in storage
 * @param key - Storage key
 * @param value - Value to store
 */
export const setStorageItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    logError(`Error setting storage item ${key}:`, err);
  }
};

/**
 * Removes a specific item from storage
 * @param key - Storage key
 */
export const removeStorageItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    logError(`Error removing storage item ${key}:`, err);
  }
};

