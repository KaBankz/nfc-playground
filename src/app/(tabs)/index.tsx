import { useState } from 'react';
import { Alert, View } from 'react-native';

import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { Tabs } from 'expo-router';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

import { Pressable } from '@/components/Pressable';
import { Text } from '@/components/Text';

export default function HomeScreen() {
  const [nfcData, setNfcData] = useState('');

  async function readNdef() {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      console.log('Tag found', tag);
      setNfcData(JSON.stringify(tag));
    } catch (ex) {
      console.error('Oops!', ex);
    } finally {
      await NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <>
      <Tabs.Screen options={{ headerShown: true }} />
      <View className='flex-1 gap-4 p-6'>
        <View className='flex-row gap-4'>
          <Pressable
            className='grow items-center rounded-lg bg-neutral-800 px-4 py-6 transition-colors active:bg-neutral-700'
            onPress={readNdef}>
            <Text className='text-xl font-semibold'>
              <Trans>Read NFC Tag</Trans>
            </Text>
          </Pressable>
          <Pressable
            className='grow items-center rounded-lg bg-red-600 px-4 py-6 transition-colors active:bg-red-700'
            onPress={() => {
              Alert.alert(t`Are you sure?`, t`This will reset the NFC data`, [
                {
                  text: t`Cancel`,
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                { text: t`OK`, onPress: () => setNfcData('') },
              ]);
            }}>
            <Text className='text-xl font-semibold'>
              <Trans>Reset</Trans>
            </Text>
          </Pressable>
        </View>

        <Text>
          <Trans>NFC Data:</Trans>
        </Text>
        <View className='rounded-lg bg-neutral-900 p-2'>
          <Text>{nfcData}</Text>
        </View>
      </View>
    </>
  );
}
