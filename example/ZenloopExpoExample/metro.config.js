const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/**
 * Metro configuration for Zenloop SDK Expo Example
 * Configured to work with local SDK development
 */

// Path to the local SDK
const sdkPath = path.resolve(__dirname, '../../');

const config = getDefaultConfig(__dirname);

// Watch the SDK folder for changes during development
config.watchFolders = [sdkPath];

// Configure resolver to find SDK modules
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

// Exclude SDK's node_modules to avoid conflicts
config.resolver.blockList = [
  /\/Users\/admin\/Documents\/zenloop\/ReactNativeSDK\/node_modules\/.*/,
];

module.exports = config;