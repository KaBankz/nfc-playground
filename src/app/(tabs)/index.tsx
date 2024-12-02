import { useState } from 'react';
import { Alert, View } from 'react-native';

import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { Tabs } from 'expo-router';
import NfcManager, { NfcTech, type TagEvent } from 'react-native-nfc-manager';

import { Pressable } from '@/components/Pressable';
import { Text } from '@/components/Text';

export default function ReadTag() {
  const [nfcData, setNfcData] = useState<TagEvent | null>(null);

  async function readNdef() {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      tag.ndefStatus = await NfcManager.ndefHandler.getNdefStatus();
      console.log('Tag found', tag);
      setNfcData(tag);
    } catch (ex) {
      console.log('User canceled scan', ex);
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
                { text: t`OK`, onPress: () => setNfcData(null) },
              ]);
            }}>
            <Text className='text-xl font-semibold'>
              <Trans>Reset</Trans>
            </Text>
          </Pressable>
        </View>

        <Text className='text-lg font-medium'>
          <Trans>Raw NFC Data:</Trans>
        </Text>
        <View className='rounded-lg bg-neutral-900 p-2'>
          <Text className='font-mono font-semibold'>
            {nfcData !== null ? JSON.stringify(nfcData, null, 4) : t`No Data`}
          </Text>
        </View>
      </View>
    </>
  );
}
