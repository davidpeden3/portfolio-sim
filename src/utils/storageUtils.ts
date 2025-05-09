/**
 * Storage utility functions to encapsulate all localStorage access
 */

export type StorageKeys = 'theme' | 'selectedProfile' | 'customProfileData';

/**
 * Get an item from localStorage
 */
export function getStorageItem(key: StorageKeys): string | null {
  try {
    const value = localStorage.getItem(key);
    console.log(`[Storage] Get ${key}:`, value);
    return value;
  } catch (error) {
    console.error(`[Storage] Error getting ${key}:`, error);
    return null;
  }
}

/**
 * Set an item in localStorage
 */
export function setStorageItem(key: StorageKeys, value: string): void {
  try {
    console.log(`[Storage] Set ${key}:`, value);
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`[Storage] Error setting ${key}:`, error);
  }
}

/**
 * Remove an item from localStorage
 */
export function removeStorageItem(key: StorageKeys): void {
  try {
    console.log(`[Storage] Remove ${key}`);
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`[Storage] Error removing ${key}:`, error);
  }
}

/**
 * Clear all items from localStorage
 */
export function clearStorage(): void {
  try {
    console.log('[Storage] Clear all');
    localStorage.clear();
  } catch (error) {
    console.error('[Storage] Error clearing storage:', error);
  }
}