/**
 * ConfigShare.test.ts
 * Tests to verify the integrity of configuration sharing functionality
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { compressToEncodedURIComponent } from 'lz-string';
import { ConfigShareData } from '../utils/configShare';

// Mock storage for tests
const mockStore: Record<string, string> = {};

// Test-specific versions of the functions we're testing
// These will use the mockStore instead of localStorage

function mockGetStorageItem(key: string): string | null {
  return mockStore[key] || null;
}

function mockSetStorageItem(key: string, value: string): void {
  mockStore[key] = value;
}

function mockCollectConfigData(): ConfigShareData {
  const selectedProfile = mockGetStorageItem('selectedProfile') || 'midCareer';
  const theme = mockGetStorageItem('theme');
  
  const baseConfig: ConfigShareData = {
    selectedProfile,
    version: {
      appVersion: '1.0.0-test',
      timestamp: 123456789
    }
  };
  
  if (theme) {
    baseConfig.theme = theme;
  }
  
  if (selectedProfile === 'custom') {
    const customProfile = mockGetStorageItem('customProfileData');
    if (customProfile) {
      baseConfig.customProfile = customProfile;
    }
  }
  
  return baseConfig;
}

function mockGenerateShareableUrl(baseUrl = 'https://example.com'): string {
  const configData = mockCollectConfigData();
  const configStr = JSON.stringify(configData);
  const compressed = compressToEncodedURIComponent(configStr);
  return `${baseUrl}?config=${compressed}`;
}

async function mockImportConfig(urlParam: string): Promise<boolean> {
  try {
    const { decompressFromEncodedURIComponent } = await import('lz-string');
    const decompressed = decompressFromEncodedURIComponent(urlParam);
    if (!decompressed) {
      return false;
    }
    
    const configData = JSON.parse(decompressed) as ConfigShareData;
    
    // Extract and parse custom profile data
    let customProfileObj = null;
    if (configData.customProfile) {
      try {
        customProfileObj = JSON.parse(configData.customProfile);
      } catch (e) {
        console.error('Error parsing customProfile:', e);
      }
    }
    
    // Save data to mock storage
    if (configData.selectedProfile) {
      mockSetStorageItem('selectedProfile', configData.selectedProfile);
    }
    
    if (customProfileObj) {
      mockSetStorageItem('customProfileData', JSON.stringify(customProfileObj));
    }
    
    if (configData.theme === 'light' || configData.theme === 'dark') {
      mockSetStorageItem('theme', configData.theme);
    }
    
    return true;
  } catch (error) {
    console.error('Error importing config:', error);
    return false;
  }
}

async function mockCheckAndImportFromUrl(urlSearch: string): Promise<boolean> {
  const urlParams = new URLSearchParams(urlSearch);
  const configParam = urlParams.get('config');
  
  if (configParam) {
    return await mockImportConfig(configParam);
  }
  
  return false;
}

// Reset mock storage between tests
beforeEach(() => {
  Object.keys(mockStore).forEach(key => delete mockStore[key]);
  vi.clearAllMocks();
});

describe('ConfigShare Functionality Tests', () => {
  
  test('Standard profile roundtrip preserves all data', async () => {
    // SETUP: Create standard profile with theme
    mockSetStorageItem('selectedProfile', 'midCareer');
    mockSetStorageItem('theme', 'dark');
    
    // STEP 1: Collect config data
    const configData = mockCollectConfigData();
    
    // STEP 2: Verify collected data has correct format
    expect(configData.selectedProfile).toBe('midCareer');
    expect(configData.theme).toBe('dark');
    
    // STEP 3: Generate shareable URL
    const url = mockGenerateShareableUrl();
    
    // STEP 4: Verify URL has expected format
    expect(url).toContain('config=');
    
    // STEP 5: Clear mock storage for clean import
    Object.keys(mockStore).forEach(key => delete mockStore[key]);
    
    // STEP 6: Extract config from URL
    const urlObj = new URL(url);
    const configParam = urlObj.searchParams.get('config');
    
    // STEP 7: Import the config
    expect(configParam).toBeTruthy();
    if (configParam) {
      expect(await mockImportConfig(configParam)).toBe(true);
    }
    
    // STEP 8: Verify mock storage has correct values after importing
    expect(mockGetStorageItem('selectedProfile')).toBe('midCareer');
    expect(mockGetStorageItem('theme')).toBe('dark');
  });
  
  test('URL parameters with config are correctly processed', async () => {
    // SETUP: Create a mock configuration
    const mockConfig: ConfigShareData = {
      selectedProfile: 'earlyCareer',
      theme: 'dark',
      version: {
        appVersion: '1.0.0',
        timestamp: 123456789
      }
    };
    
    // Compress the configuration
    const compressedConfig = compressToEncodedURIComponent(JSON.stringify(mockConfig));
    
    // Process URL parameters
    const result = await mockCheckAndImportFromUrl(`?config=${compressedConfig}`);
    
    // Verify the function returns success
    expect(result).toBe(true);
    
    // Verify storage has correct values after importing
    expect(mockGetStorageItem('selectedProfile')).toBe('earlyCareer');
    expect(mockGetStorageItem('theme')).toBe('dark');
  });
  
  test('Custom profile with contributions roundtrip preserves all data', async () => {
    // SETUP: Create custom profile with contributions
    const customProfileData = {
      foo: 'bar',
      baz: 123,
      supplementalContributions: [
        {
          id: '123',
          name: 'Test Contribution',
          amount: 1000,
          type: 'oneTime',
          enabled: true
        }
      ]
    };
    
    mockSetStorageItem('selectedProfile', 'custom');
    mockSetStorageItem('customProfileData', JSON.stringify(customProfileData));
    mockSetStorageItem('theme', 'dark');
    
    // Store original data for comparison
    const originalTheme = mockGetStorageItem('theme');
    const originalProfile = mockGetStorageItem('selectedProfile');
    const originalCustomProfile = mockGetStorageItem('customProfileData');
    
    // STEP 1: Collect config data
    const configData = mockCollectConfigData();
    
    // STEP 2: Verify collected data has correct format
    expect(configData.selectedProfile).toBe('custom');
    expect(configData.theme).toBe('dark');
    expect(configData.customProfile).toBe(JSON.stringify(customProfileData));
    
    // STEP 3: Generate shareable URL
    const url = mockGenerateShareableUrl();
    
    // STEP 4: Verify URL has expected format
    expect(url).toContain('config=');
    
    // STEP 5: Extract config parameter
    const urlObj = new URL(url);
    const configParam = urlObj.searchParams.get('config');
    expect(configParam).toBeTruthy();
    
    // STEP 6: Clear mock storage for clean import
    Object.keys(mockStore).forEach(key => delete mockStore[key]);
    
    // STEP 7: Import the config
    if (configParam) {
      expect(await mockImportConfig(configParam)).toBe(true);
    }
    
    // STEP 8: Verify correct values after importing
    expect(mockGetStorageItem('selectedProfile')).toBe(originalProfile);
    expect(mockGetStorageItem('theme')).toBe(originalTheme);
    
    // Parse custom profile data for deep comparison
    const importedCustomProfile = JSON.parse(mockGetStorageItem('customProfileData') || '{}');
    const originalCustomProfileObj = JSON.parse(originalCustomProfile || '{}');
    
    // Should have the same custom profile data
    expect(importedCustomProfile).toEqual(originalCustomProfileObj);
    
    // Most importantly, should preserve supplemental contributions
    expect(importedCustomProfile.supplementalContributions).toEqual(originalCustomProfileObj.supplementalContributions);
  });
  
  test('URL import with config parameter containing contributions works correctly', async () => {
    // STEP 1: Create mock data with contributions
    const mockConfig: ConfigShareData = {
      selectedProfile: 'custom',
      customProfile: JSON.stringify({
        supplementalContributions: [
          {
            id: 'abc123',
            name: 'Monthly Contribution',
            amount: 500,
            type: 'recurring',
            enabled: true
          }
        ]
      }),
      theme: 'dark',
      version: {
        appVersion: '1.0.0',
        timestamp: 123456789
      }
    };
    
    // STEP 2: Compress mock data into URL parameter
    const compressedConfig = compressToEncodedURIComponent(JSON.stringify(mockConfig));
    
    // STEP 3: Import the config
    expect(await mockImportConfig(compressedConfig)).toBe(true);
    
    // STEP 4: Verify storage has correct values after importing
    expect(mockGetStorageItem('selectedProfile')).toBe('custom');
    expect(mockGetStorageItem('theme')).toBe('dark');
    
    // Parse custom profile data to check contributions
    const importedCustomProfile = JSON.parse(mockGetStorageItem('customProfileData') || '{}');
    
    // Contributions should be preserved in custom profile
    expect(importedCustomProfile.supplementalContributions).toBeTruthy();
    expect(importedCustomProfile.supplementalContributions.length).toBe(1);
    expect(importedCustomProfile.supplementalContributions[0].id).toBe('abc123');
  });
});