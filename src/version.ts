// This file is automatically updated during the build process

// We've configured vite to handle this import
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import packageJson from '@package';

// Import buildInfo.json statically to avoid dynamic import issues
// We're importing a JSON file
// Import JSON file and cast it to the expected type
import buildInfoJson from './buildInfo.json';
const buildInfo = buildInfoJson as BuildInfo;

// Define the expected structure of buildInfo.json
interface BuildInfo {
  version: string;
  buildNumber: number;
  buildDate: string;
  fullVersion: string;
  timestamp: number;
}

export interface VersionInfo {
  version: string;
  buildNumber: number;
  buildDate: string;
  fullVersion: string;
  timestamp: number;
  environment: string;
  commitHash?: string;
}

// Combine package.json version with build information
const versionInfo: VersionInfo = {
  version: packageJson.version,
  buildNumber: buildInfo.buildNumber || 0,
  buildDate: buildInfo.buildDate || new Date().toISOString().split('T')[0],
  fullVersion: buildInfo.fullVersion || packageJson.version,
  timestamp: buildInfo.timestamp || Date.now(),
  environment: import.meta.env.MODE
};

export default versionInfo;