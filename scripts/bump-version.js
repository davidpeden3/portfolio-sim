#!/usr/bin/env node

/**
 * This script can be used to bump the version in package.json
 * Usage: node scripts/bump-version.js [patch|minor|major]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const versionType = process.argv[2] || 'patch';
const validTypes = ['patch', 'minor', 'major'];

if (!validTypes.includes(versionType)) {
  console.error(`Invalid version type. Must be one of: ${validTypes.join(', ')}`);
  process.exit(1);
}

// Read the current package.json
const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

// Bump the version
console.log(`Current version: ${currentVersion}`);
console.log(`Bumping ${versionType} version...`);

try {
  // Execute npm version command
  execSync(`npm version ${versionType} --no-git-tag-version`, { stdio: 'inherit' });
  
  // Read the new version
  const updatedPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log(`New version: ${updatedPackageJson.version}`);
  
  // In a CI environment, you might want to commit this change
  // execSync('git add package.json');
  // execSync(`git commit -m "Bump version to ${updatedPackageJson.version}"`);
  
} catch (error) {
  console.error('Error bumping version:', error);
  process.exit(1);
}