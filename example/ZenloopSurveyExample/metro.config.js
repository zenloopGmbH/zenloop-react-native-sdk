const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration for Zenloop SDK Example
 * Configured to work with local SDK development
 */

// Path to the local SDK
const sdkPath = path.resolve(__dirname, '../../');

const config = {
  // Watch the SDK folder for changes during development
  watchFolders: [sdkPath],
  
  // Configure resolver to find SDK modules
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(sdkPath, 'node_modules'),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
