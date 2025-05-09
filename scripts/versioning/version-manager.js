#!/usr/bin/env node

/**
 * Version Manager - All versioning functions in one place
 * 
 * Handles:
 * - Getting the current version
 * - Incrementing version numbers (major, minor, patch)
 * - Setting specific version numbers
 * - Managing build numbers
 * - Generating version files for builds
 * - Processing version changes from commit messages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// File paths setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..'); // Go up two levels to reach project root
const packageJsonPath = path.join(rootDir, 'package.json');
const buildNumberPath = path.join(rootDir, 'buildNumber.txt');

/**
 * Read the current package.json
 */
function readPackageJson() {
  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
}

/**
 * Read the current build number
 */
function readBuildNumber() {
  if (!fs.existsSync(buildNumberPath)) {
    fs.writeFileSync(buildNumberPath, '0', 'utf8');
    return 0;
  }
  return parseInt(fs.readFileSync(buildNumberPath, 'utf8'), 10) || 0;
}

/**
 * Write the build number
 */
function writeBuildNumber(buildNumber) {
  fs.writeFileSync(buildNumberPath, buildNumber.toString(), 'utf8');
}

/**
 * Get the version information
 * @returns {object} Version information including semantic version and build number
 */
function getVersion() {
  const packageJson = readPackageJson();
  const buildNumber = readBuildNumber();
  return {
    version: packageJson.version,
    buildNumber,
    fullVersion: `${packageJson.version}+${buildNumber}`
  };
}

/**
 * Display version information in a consistent format
 */
function displayVersion() {
  const version = getVersion();
  console.log(`Version: ${version.version}`);
  console.log(`Build: ${version.buildNumber}`);
  console.log(`Full: ${version.fullVersion}`);
  return version;
}

/**
 * Increment build number
 */
function incrementBuildNumber() {
  const buildNumber = readBuildNumber() + 1;
  writeBuildNumber(buildNumber);
  return buildNumber;
}

/**
 * Change the version based on the type and optional value
 * 
 * @param {string} component - 'major', 'minor', or 'patch'
 * @param {number|undefined} value - Optional explicit value to set
 * @returns {string} The new version
 */
function changeVersion(component, value) {
  const packageJson = readPackageJson();
  const currentVersion = packageJson.version;
  let [major, minor, patch] = currentVersion.split('.').map(Number);
  
  if (typeof value === 'number' || (typeof value === 'string' && !isNaN(parseInt(value)))) {
    // Explicit value provided - set the specific version component
    const numValue = typeof value === 'string' ? parseInt(value) : value;
    
    switch (component) {
      case 'major':
        major = numValue;
        break;
      case 'minor':
        minor = numValue;
        break;
      case 'patch':
        patch = numValue;
        break;
      default:
        throw new Error(`Invalid version component: ${component}`);
    }
  } else {
    // No value provided - increment the version
    switch (component) {
      case 'major':
        major += 1;
        minor = 0;
        patch = 0;
        break;
      case 'minor':
        minor += 1;
        patch = 0;
        break;
      case 'patch':
        patch += 1;
        break;
      default:
        throw new Error(`Invalid version component: ${component}`);
    }
  }
  
  const newVersion = `${major}.${minor}.${patch}`;
  
  try {
    // Execute npm version command with the new version
    execSync(`npm version ${newVersion} --no-git-tag-version`, { stdio: 'pipe' });
    
    // Display the new version in the standard format
    console.log(`Version changed from ${currentVersion} to ${newVersion}`);
    displayVersion();
    
    return newVersion;
  } catch (error) {
    console.error('Error setting version:', error);
    throw error;
  }
}

/**
 * Set a complete version (major.minor.patch)
 */
function setFullVersion(versionString) {
  const versionParts = versionString.split('.');
  
  if (versionParts.length !== 3 || 
      isNaN(parseInt(versionParts[0])) || 
      isNaN(parseInt(versionParts[1])) || 
      isNaN(parseInt(versionParts[2]))) {
    console.error('Error: Invalid version format. Must be in the format "major.minor.patch"');
    process.exit(1);
  }
  
  const packageJson = readPackageJson();
  const currentVersion = packageJson.version;
  const newVersion = versionString;
  
  try {
    // Execute npm version command with the new version directly
    execSync(`npm version ${newVersion} --no-git-tag-version`, { stdio: 'pipe' });
    
    // Display the new version in the standard format
    console.log(`Version changed from ${currentVersion} to ${newVersion}`);
    displayVersion();
    
    return newVersion;
  } catch (error) {
    console.error('Error setting version:', error);
    throw error;
  }
}

/**
 * Check if a commit message includes version change indicators
 * Format: [version|component] or [version|component:value]
 * where component can be 'major', 'minor', or 'patch'
 * and value is an optional explicit numeric value
 */
function checkCommitMessageForVersionChange(commitMessage) {
  const regex = /\[version\|(major|minor|patch)(?::(\d+))?\]/i;
  const match = commitMessage.match(regex);
  
  if (match) {
    return {
      component: match[1].toLowerCase(),
      value: match[2] ? parseInt(match[2]) : undefined
    };
  }
  
  return null;
}

/**
 * Process a commit message for version changes
 */
function processCommitMessage(commitMessage) {
  const versionChange = checkCommitMessageForVersionChange(commitMessage);
  
  if (versionChange) {
    console.log(`Version indicator found in commit message: ${versionChange.component}${versionChange.value !== undefined ? `:${versionChange.value}` : ''}`);
    try {
      changeVersion(versionChange.component, versionChange.value);
      return true;
    } catch (error) {
      console.error('Failed to update version:', error);
      return false;
    }
  } else {
    console.log('No version indicator found in commit message');
    return false;
  }
}

/**
 * Generates a JSON file with version information for the build
 */
function generateVersionFile() {
  const versionInfo = {
    ...getVersion(),
    buildDate: new Date().toISOString(),
    timestamp: Date.now()
  };
  
  fs.writeFileSync(
    path.join(rootDir, 'src', 'buildInfo.json'), 
    JSON.stringify(versionInfo, null, 2),
    'utf8'
  );
  
  return versionInfo;
}

/**
 * Helper to handle the setVersion command
 */
function handleSetVersion(args) {
  if (args.length === 0) {
    console.error('Error: Missing version arguments');
    console.log('Usage:');
    console.log('  npm run setVersion [major|minor|patch] [value]');
    console.log('  npm run setVersion [version] (e.g., 2.3.4)');
    process.exit(1);
  }

  // Handle full version string "2.3.4"
  if (args.length === 1 && args[0].includes('.')) {
    setFullVersion(args[0]);
    return;
  }

  // Handle component and value "major 2"
  if (args.length === 2) {
    const component = args[0].toLowerCase();
    const value = parseInt(args[1]);
    
    if (!['major', 'minor', 'patch'].includes(component)) {
      console.error(`Error: Invalid version component "${component}". Must be major, minor, or patch`);
      process.exit(1);
    }
    
    if (isNaN(value)) {
      console.error(`Error: Invalid value "${args[1]}". Must be a number`);
      process.exit(1);
    }
    
    changeVersion(component, value);
    return;
  }

  console.error('Error: Invalid arguments');
  console.log('Usage:');
  console.log('  npm run setVersion [major|minor|patch] [value]');
  console.log('  npm run setVersion [version] (e.g., 2.3.4)');
  process.exit(1);
}

// Process command line arguments
const mainCommand = process.argv[2];
const remainingArgs = process.argv.slice(3);

if (mainCommand) {
  switch (mainCommand) {
    // Main commands
    case 'get-version':
      displayVersion();
      break;
    
    case 'increment-build':
      const newBuildNumber = incrementBuildNumber();
      console.log(`Build number incremented to: ${newBuildNumber}`);
      displayVersion();
      break;
      
    case 'increment-version':
      const component = remainingArgs[0];
      const value = remainingArgs[1] ? parseInt(remainingArgs[1]) : undefined;
      
      if (!component) {
        console.error('Error: Missing version component (major, minor, or patch)');
        console.log('Usage: increment-version [major|minor|patch] [value]');
        process.exit(1);
      }
      
      changeVersion(component, value);
      break;
    
    case 'generate-version-file':
      console.log('Generated version file:');
      console.log(generateVersionFile());
      break;
    
    case 'process-commit':
      const commitMessage = remainingArgs[0] || '';
      processCommitMessage(commitMessage);
      break;
    
    case 'set-version':
      handleSetVersion(remainingArgs);
      break;
      
    default:
      console.error(`Unknown command: ${mainCommand}`);
      console.log('Available commands:');
      console.log('  get-version           - Display the current version');
      console.log('  increment-version     - Increment a version component');
      console.log('  increment-build       - Increment the build number');
      console.log('  generate-version-file - Generate the buildInfo.json file');
      console.log('  process-commit        - Process a commit message for version changes');
      console.log('  set-version           - Set a specific version component or full version');
      process.exit(1);
  }
}