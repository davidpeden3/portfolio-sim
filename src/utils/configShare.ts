import { compress, decompress, compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

export interface ConfigShareData {
  selectedProfile: string;
  settings: string; // JSON stringified simulator settings
  customProfile?: string; // JSON stringified custom profile data
  theme?: string;
}

/**
 * Collects configuration data from localStorage
 * @returns Object containing all config data to be shared
 */
export function collectConfigData(): ConfigShareData {
  const selectedProfile = localStorage.getItem("selectedProfile");
  const settings = localStorage.getItem("portfolio-simulator-settings");
  const customProfile = localStorage.getItem("customProfileData");
  const theme = localStorage.getItem("theme");

  return {
    selectedProfile: selectedProfile || "midCareer",
    settings: settings || "",
    ...(customProfile && { customProfile }),
    ...(theme && { theme })
  };
}

/**
 * Compresses config data and returns a shareable URL
 * @param baseUrl The base URL of the application 
 * @returns A shareable URL with compressed config
 */
export function generateShareableUrl(baseUrl: string = window.location.origin): string {
  const configData = collectConfigData();
  const configStr = JSON.stringify(configData);
  // Use the URL-safe compression method provided by lz-string
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
    if (!decompressed) return false;
    
    // Parse the config data
    const configData = JSON.parse(decompressed) as ConfigShareData;
    
    // Store each piece in localStorage
    if (configData.selectedProfile) {
      localStorage.setItem("selectedProfile", configData.selectedProfile);
    }
    
    if (configData.settings) {
      localStorage.setItem("portfolio-simulator-settings", configData.settings);
    }
    
    if (configData.customProfile) {
      localStorage.setItem("customProfileData", configData.customProfile);
    }
    
    if (configData.theme) {
      localStorage.setItem("theme", configData.theme);
    }
    
    return true;
  } catch (error) {
    console.error("Failed to import configuration:", error);
    return false;
  }
}

/**
 * Checks the URL for a config parameter and imports it if found
 * @returns True if config was imported, false otherwise
 */
export function checkAndImportFromUrl(): boolean {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const configParam = urlParams.get('config');
    
    if (configParam) {
      const success = importConfig(configParam);
      
      // Clean up the URL to remove the config parameter
      if (success && window.history && window.history.replaceState) {
        const cleanUrl = window.location.protocol + "//" + 
                         window.location.host + 
                         window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
      
      return success;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking for URL config:", error);
    return false;
  }
}