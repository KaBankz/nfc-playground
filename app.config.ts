import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'NFC Playground',
  slug: 'nfcp',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './src/assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './src/assets/images/icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.kabanks.nfcp',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './src/assets/images/favicon.png',
  },
  plugins: ['expo-router', 'expo-localization', 'react-native-nfc-manager'],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
