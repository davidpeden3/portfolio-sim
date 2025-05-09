/**
 * Test script for the current configShare implementation
 */

import pkg from 'lz-string';
const { compressToEncodedURIComponent, decompressFromEncodedURIComponent } = pkg;
import fs from 'fs';

// Create test data to share
const testConfig = {
  selectedProfile: "custom",
  customProfile: JSON.stringify({
    supplementalContributions: [
      {
        id: "test-123",
        name: "Test Contribution",
        amount: 500,
        type: "recurring",
        enabled: true
      }
    ]
  }),
  settings: JSON.stringify({
    someSetting: true,
    anotherSetting: "value"
  }),
  theme: "dark",
  version: {
    appVersion: "1.0.0",
    timestamp: Date.now()
  }
};

// Compress it (same as what happens in the app)
const compressed = compressToEncodedURIComponent(JSON.stringify(testConfig));

// Create a URL to demonstrate sharing
const shareUrl = `https://example.com/?config=${compressed}`;
console.log("Share URL (truncated):", shareUrl.slice(0, 100) + "...");

// Now decode it (same as what happens when importing)
const decompressed = decompressFromEncodedURIComponent(compressed);
const parsed = JSON.parse(decompressed);

console.log("\nDECOMPRESSED CONFIG:");
console.log(JSON.stringify(parsed, null, 2));

// Verify contributions are maintained
const customProfile = JSON.parse(parsed.customProfile);
console.log("\nCONTRIBUTIONS IN DECOMPRESSED DATA:");
console.log(JSON.stringify(customProfile.supplementalContributions, null, 2));

// Write test data to disk for manual verification
fs.writeFileSync('configTestOutput.json', JSON.stringify({
  original: testConfig,
  compressed: compressed,
  decompressed: parsed
}, null, 2));

console.log("\nFull output written to configTestOutput.json");