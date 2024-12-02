import React from 'react';
import { Platform } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLingui } from '@lingui/react/macro';
import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useLingui();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name='index'
        options={{
          title: t`Read`,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='cube-scan' size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='write'
        options={{
          title: t`Edit`,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='file-edit' size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
