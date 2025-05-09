# Version Management 

This folder contains the version management system for the application.

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run getVersion` | View the current version |
| `npm run bumpPatch` | Increment patch version |
| `npm run bumpMinor` | Increment minor version |
| `npm run bumpMajor` | Increment major version |
| `npm run setVersion 2.3.4` | Set complete version |
| `npm run setVersion major 2` | Set specific version component |

## Detailed Usage

### View Current Version

```bash
npm run getVersion
```

This displays the semantic version, build number, and full version.

### Increment Version Numbers

```bash
# Increment patch version (1.0.0 -> 1.0.1)
npm run bumpPatch

# Increment minor version (1.0.0 -> 1.1.0)
npm run bumpMinor

# Increment major version (1.0.0 -> 2.0.0)
npm run bumpMajor
```

### Set Specific Version Numbers

```bash
# Set a complete version
npm run setVersion 2.5.7

# Set major version to 2 (1.0.0 -> 2.0.0)
npm run setVersion major 2

# Set minor version to 5 (1.0.0 -> 1.5.0)
npm run setVersion minor 5

# Set patch version to 7 (1.0.0 -> 1.0.7)
npm run setVersion patch 7
```

### Version Format in Commit Messages

You can include version changes in commit messages:

```
[version|component] or [version|component:value]
```

Examples:
- `[version|minor]` - Increment minor version
- `[version|major:2]` - Set major version to 2
- `[version|patch:0]` - Set patch version to 0

## Automatic Version Management

- **Build Numbers**: Automatically incremented during the build process
- **Version Files**: Generated during builds for use by the application
- **Version Format**: `major.minor.patch+buildNumber` (e.g., `1.2.3+42`)

## For Advanced Usage

Direct use of the version manager script:

```bash
# Display help
node scripts/versioning/version-manager.js

# Available commands
node scripts/versioning/version-manager.js get-version
node scripts/versioning/version-manager.js increment-version [major|minor|patch]
node scripts/versioning/version-manager.js increment-build
node scripts/versioning/version-manager.js set-version [component] [value]
node scripts/versioning/version-manager.js set-version [version]
```