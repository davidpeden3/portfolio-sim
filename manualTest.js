/**
 * Manual test for the configShare functionality
 * This test verifies that contributions are properly maintained during a config roundtrip
 */

import LZString from 'lz-string';

// Create a mock localStorage
const localStorage = {
  data: {},
  getItem: function(key) {
    return this.data[key] || null;
  },
  setItem: function(key, value) {
    this.data[key] = value;
  },
  clear: function() {
    this.data = {};
  }
};

// Create a mock document.documentElement
const documentElement = {
  classList: {
    remove: function() {},
    add: function() {}
  }
};

// Simple compression and decompression functions
function compressData(data) {
  return LZString.compressToEncodedURIComponent(JSON.stringify(data));
}

function decompressData(compressed) {
  return JSON.parse(LZString.decompressFromEncodedURIComponent(compressed));
}

// Set up initial test data
function setupTest() {
  // Create a test custom profile with supplemental contributions
  const customProfileData = {
    name: "Test Profile",
    supplementalContributions: [
      {
        id: "test-id",
        name: "Test Contribution",
        amount: 1000,
        enabled: true,
        type: "monthly"
      }
    ]
  };
  
  // Store it in localStorage
  localStorage.setItem("selectedProfile", "custom");
  localStorage.setItem("customProfileData", JSON.stringify(customProfileData));
  localStorage.setItem("theme", "dark");
  
  // Print initial state
  console.log("INITIAL STATE:");
  logLocalStorageState();
  
  // Create the config data that would be encoded in a URL
  const configData = {
    selectedProfile: "custom",
    customProfile: localStorage.getItem("customProfileData"),
    settings: localStorage.getItem("portfolio-simulator-settings"),
    theme: "dark",
    version: {
      appVersion: "1.0.0",
      timestamp: Date.now()
    }
  };
  
  // Compress the data
  const compressed = compressData(configData);
  console.log("COMPRESSED CONFIG:", compressed.slice(0, 30) + "...");
  
  // Clear localStorage to simulate a fresh load
  localStorage.clear();
  console.log("\nAFTER CLEARING:");
  logLocalStorageState();
  
  // Import the config by simulating the importConfig function
  const decompressed = decompressData(compressed);
  
  // Handle custom profile data
  if (decompressed.customProfile) {
    const customProfileData = typeof decompressed.customProfile === 'string'
      ? JSON.parse(decompressed.customProfile)
      : decompressed.customProfile;
      
    localStorage.setItem("customProfileData", JSON.stringify(customProfileData));
  }
  
  
  // Handle profile selection
  if (decompressed.selectedProfile) {
    localStorage.setItem("selectedProfile", decompressed.selectedProfile);
  }
  
  // Handle theme
  if (decompressed.theme) {
    localStorage.setItem("theme", decompressed.theme);
  }
  
  // Print final state
  console.log("\nAFTER IMPORT:");
  logLocalStorageState();
  
  // Check for the presence of supplemental contributions
  checkContributions();
}

// Helper function to log the localStorage state
function logLocalStorageState() {
  console.log("- selectedProfile:", localStorage.getItem("selectedProfile"));
  console.log("- theme:", localStorage.getItem("theme"));
  
  const customProfile = localStorage.getItem("customProfileData");
  console.log("- customProfileData:", customProfile ? "Present" : "Not present");
}

// Check if contributions were maintained
function checkContributions() {
  console.log("\nCHECKING CONTRIBUTIONS:");
  
  const customProfile = localStorage.getItem("customProfileData");
  
  if (customProfile) {
    const customProfileData = JSON.parse(customProfile);
    if (customProfileData.supplementalContributions) {
      console.log("- Custom profile contributions:", customProfileData.supplementalContributions.length);
    } else {
      console.log("- Custom profile has NO contributions");
    }
  }
}

// Run the test
setupTest();