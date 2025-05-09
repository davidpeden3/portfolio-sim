// Debug script to test theme handling
import pkg from 'lz-string';
const { decompressFromEncodedURIComponent } = pkg;

// Parse the compressed config
const compressedConfig = 'N4IgzgpgNhDGAuEAmAFATgewGYEsYgC4RYBXMeDAWxABoQA3CNMHDAO0NAEMAHHgNSYt2hEAEYAdAAZpAagBMU2iHg5KEcl0o9CYgOwAWAGx6j8+abEWAvnXgALCOtFQcAc3vxlpclXTY8CFFgAB0QHDYcVS4oAGV7LjQIAGEMEjZ4MIIpGjCIqJwYgEk2RnJ1DKycsIAjLkgS2CoIKtzwEjQeKDIAMQw0ABE0HB4UJlgISsJqkAB3KPt7DCgkABUuAA8NLPg0Egg2+E2AdQWllYi3WN2uRDcATyywynYHKEfaMKON04dzpEuAFkIA4MEgnipNgAhNBcWAAaxBYUOmx6eEuq3uPBahDCLDYbhgyK+qJwWyQAEEXulMtMURs0eSxmgJlNsm0kMMeNdYXcPgQwtiWZMjm4cRyuczWaKcQQxFIZpyRozkFS0myZrhyY1mmqaa08SQ+DAKkcoKkMsMaiRVOwwFkANqhcLg3HECAAVhqRgMHogAFoxDUsEh-QZ5BAuP6uFgxEZ-R6xFYxABmJAADgMWA9emJIEmXBqMFdBF2+zabC0srCA2SFIIAAIACTyqQNgAULwy9neAEo81p1bS5QrDljqyAkLAuHmkqQ0MMCTs9gcwlgkgBHfZsWD856vHsfDlce4AeSwxwgEHhWQ91gAum0WJQSFBbqw2ICD-bCEYZpo0HgL9uyyMQ2nyaI4gSJJ0BwCYsnkAwJBTFMORwegcCQSYkAATRwaAkAMWZbzaLs3nuCk+DnQpbTYLJA3AnduiwgAZDAuDowgsBiSA2igdi2D1DU2g4tgSGKDImA0eAACVbllGZB0AnAAC933YYCHB-bJrBAawgA';
const decompressed = decompressFromEncodedURIComponent(compressedConfig);
const configData = JSON.parse(decompressed);

console.log('Theme in compressed config:', configData.theme);
console.log('Type of theme value:', typeof configData.theme);

// Check if theme is a valid value
console.log('Is theme a valid value?', ['dark', 'light'].includes(configData.theme));

// Simulate localStorage
const fakeLocalStorage = {};
fakeLocalStorage['theme'] = configData.theme;
console.log('Theme saved to localStorage:', fakeLocalStorage.theme);

// Simulate ThemeContext logic
function getInitialTheme() {
  // Param check
  const params = new URLSearchParams('?config=' + compressedConfig);
  const themeParam = params.get('theme');
  console.log('URL theme param:', themeParam);
  
  // localStorage check
  const savedTheme = fakeLocalStorage.theme;
  console.log('Saved theme from localStorage:', savedTheme);
  console.log('Valid localStorage theme?', savedTheme && ['dark', 'light'].includes(savedTheme));
  
  if (savedTheme && ['dark', 'light'].includes(savedTheme)) {
    return savedTheme;
  }
  
  return 'light'; // Default
}

const initialTheme = getInitialTheme();
console.log('Initial theme chosen:', initialTheme);
