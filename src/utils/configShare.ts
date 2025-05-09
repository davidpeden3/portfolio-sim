import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import versionInfo from '../version';
import { getStorageItem, setStorageItem } from './storageUtils';

export interface ConfigShareData {
  selectedProfile: string;
  customProfile?: string; // JSON stringified custom profile data
  theme?: string;
  version: {
    appVersion: string;
    timestamp: number;
  };
}

/**
 * Collects configuration data from localStorage
 * @returns Object containing all config data to be shared
 */
export function collectConfigData(): ConfigShareData {
  const selectedProfile = getStorageItem('selectedProfile') || 'midCareer';
  const theme = getStorageItem('theme');

  // Create a minimal base config with just the profile and version
  const baseConfig: ConfigShareData = {
    selectedProfile,
    version: {
      appVersion: versionInfo.fullVersion,
      timestamp: versionInfo.timestamp
    }
  };

  // Add theme if present
  if (theme) {
    baseConfig.theme = theme;
  }

  // If it's a custom profile, include the custom profile data
  if (selectedProfile === 'custom') {
    const customProfile = getStorageItem('customProfileData');
    if (customProfile) {
      baseConfig.customProfile = customProfile;
    }
  }

  return baseConfig;
}

/**
 * Compresses config data and returns a shareable URL
 * @param baseUrl The base URL of the application 
 * @returns A shareable URL with compressed config
 */
export function generateShareableUrl(baseUrl: string = window.location.origin): string {
  const configData = collectConfigData();

  const configStr = JSON.stringify(configData);
  const compressed = compressToEncodedURIComponent(configStr);
  return `${baseUrl}?config=${compressed}`;
}

/**
 * Imports configuration from a URL parameter
 * @param urlParam The compressed URL parameter containing config
 * @returns True if import was successful, false otherwise
 */
export function importConfig(urlParam: string): boolean {
  try {
    // Decode the URL parameter using the matching decompression method
    const decompressed = decompressFromEncodedURIComponent(urlParam);
    if (!decompressed) {
      return false;
    }

    // Parse the config data
    const configData = JSON.parse(decompressed) as ConfigShareData;

    // STEP 1: Extract and parse custom profile data if it exists
    let customProfileObj = null;
    if (configData.customProfile) {
      try {
        customProfileObj = JSON.parse(configData.customProfile);
      } catch (e) {
        console.error('Error parsing customProfile:', e);
      }
    }

    // STEP 2: Save data to localStorage using our utility

    // Save profile selection
    if (configData.selectedProfile) {
      setStorageItem('selectedProfile', configData.selectedProfile);
    }

    // Save customProfile data if it exists
    if (customProfileObj) {
      setStorageItem('customProfileData', JSON.stringify(customProfileObj));
    }

    // Set the theme
    if (configData.theme === 'light' || configData.theme === 'dark') {
      setStorageItem('theme', configData.theme);
    }

    return true;
  } catch (error) {
    console.error('Error importing config:', error);
    return false;
  }
}

/**
 * Checks the URL for parameters and processes them consistently
 * @returns True if config was imported, false otherwise
 */
export function checkAndImportFromUrl(): boolean {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const configParam = urlParams.get('config');

    if (configParam) {
      const success = importConfig(configParam);
      return success;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking URL for config:', error);
    return false;
  }
}