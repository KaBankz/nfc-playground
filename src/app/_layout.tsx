import { useColorScheme } from 'react-native';

import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import NfcManager from 'react-native-nfc-manager';

import '@/app/global.css';
import '@/locale/i18n';

void SplashScreen.hideAsync();

NfcManager.start();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <I18nProvider i18n={i18n}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen name='+not-found' />
        </Stack>
        <StatusBar style='auto' />
      </ThemeProvider>
    </I18nProvider>
  );
}
