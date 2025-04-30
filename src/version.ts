// This file can be automatically updated by CI/CD pipelines
// For example, in GitHub Actions, you could use a script to rewrite this file

// @ts-ignore - We've configured vite to handle this import
import packageJson from '@package';

export interface VersionInfo {
  version: string;
  buildDate: string;
  commitHash?: string;
  environment: string;
}

// In a real CI/CD pipeline, these values would be injected during the build
const versionInfo: VersionInfo = {
  version: packageJson.version,
  buildDate: new Date().toISOString().split('T')[0],
  environment: import.meta.env.MODE
};

export default versionInfo;