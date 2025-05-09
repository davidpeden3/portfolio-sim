import { vi } from 'vitest';

// Storage for mock data
export const store: Record<string, string> = {};

// Mock getStorageItem
export const getStorageItem = vi.fn((key: string) => {
  return store[key] || null;
});

// Mock setStorageItem
export const setStorageItem = vi.fn((key: string, value: string) => {
  store[key] = value;
});

// Mock removeStorageItem
export const removeStorageItem = vi.fn((key: string) => {
  delete store[key];
});

// Mock clearStorage
export const clearStorage = vi.fn(() => {
  Object.keys(store).forEach(key => delete store[key]);
});

// Helper to get all storage
export function getAllStorage() {
  return {...store};
}

// Helper to clear all storage
export function clearAllStorage() {
  Object.keys(store).forEach(key => delete store[key]);
  vi.clearAllMocks();
}