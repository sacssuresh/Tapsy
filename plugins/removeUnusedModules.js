const { withAndroidManifest, withInfoPlist } = require('@expo/config-plugins');

/**
 * Expo config plugin to remove unused native modules from the build
 * This reduces app size by excluding modules that aren't used
 * 
 * In managed workflow, modules not in package.json won't be included.
 * This plugin handles edge cases and ensures clean builds.
 */
const withRemoveUnusedModules = (config) => {
  // List of Expo modules that should NOT be autolinked
  // These are modules that might be included as transitive dependencies
  // but aren't actually used in this app
  const unusedModules = [
    'expo-camera',
    'expo-location',
    'expo-sensors',
    'expo-contacts',
    'expo-calendar',
    'expo-image-picker',
    'expo-file-system',
    'expo-media-library',
    'expo-notifications',
    'expo-haptics',
    'expo-status-bar',
    'expo-screen-orientation',
    'expo-device',
    'expo-face-detector',
    'expo-barcode-scanner',
    'expo-gl',
    'expo-keep-awake',
    'expo-linking',
    'expo-mail-composer',
    'expo-secure-store',
    'expo-sharing',
    'expo-speech',
    'expo-store-review',
    'expo-task-manager',
    'expo-web-browser',
  ];

  // Configure Android to exclude unused modules from autolinking
  config = withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    
    // Clean up any meta-data tags for unused modules
    if (manifest.manifest && manifest.manifest.application) {
      const application = manifest.manifest.application[0];
      if (application['meta-data']) {
        application['meta-data'] = application['meta-data'].filter(
          (meta) => {
            const name = meta.$?.['android:name'];
            if (!name) return true;
            // Filter out any meta-data for unused modules
            return !unusedModules.some(module => 
              name.toLowerCase().includes(module.toLowerCase())
            );
          }
        );
      }
    }
    
    return config;
  });

  // Configure iOS Info.plist to remove unused permission descriptions
  config = withInfoPlist(config, (config) => {
    // Remove permission descriptions for unused modules
    // This reduces app size and avoids unnecessary permission prompts
    const permissionKeysToRemove = [
      'NSCameraUsageDescription',
      'NSLocationWhenInUseUsageDescription',
      'NSLocationAlwaysAndWhenInUseUsageDescription',
      'NSLocationAlwaysUsageDescription',
      'NSContactsUsageDescription',
      'NSCalendarsUsageDescription',
      'NSPhotoLibraryUsageDescription',
      'NSPhotoLibraryAddUsageDescription',
      'NSMicrophoneUsageDescription',
      'NSRemindersUsageDescription',
      'NSMotionUsageDescription',
      'NSFaceIDUsageDescription',
    ];

    permissionKeysToRemove.forEach(key => {
      if (config.modResults[key]) {
        delete config.modResults[key];
      }
    });

    return config;
  });

  // Store excluded modules list in expo config for reference
  if (config.expo && !config.expo.extra) {
    config.expo.extra = {};
  }
  if (config.expo) {
    config.expo.extra.excludedModules = unusedModules;
  }

  return config;
};

module.exports = withRemoveUnusedModules;

