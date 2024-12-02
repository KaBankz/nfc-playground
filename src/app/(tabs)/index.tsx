import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import NfcManager, { NfcTech, type TagEvent } from 'react-native-nfc-manager';

import { Pressable } from '@/components/Pressable';
import { Text } from '@/components/Text';

export default function ReadTag() {
  const [nfcData, setNfcData] = useState<TagEvent | null>(null);
  const [nfcMessages, setNfcMessages] = useState<string[] | null>(null);

  async function readNdef() {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      tag.ndefStatus = await NfcManager.ndefHandler.getNdefStatus();
      tag.nxpBytes = await NfcManager.nfcAHandler.transceive([0x3c, 0x00]);

      tag?.ndefMessage?.forEach((message) => {
        const text = message.payload
          .map((byte: number) => String.fromCharCode(byte))
          .join('');
        setNfcMessages((prev) => [...(prev ?? []), text]);
      });

      console.log('Tag found', tag);
      setNfcData(tag);
    } catch (ex) {
      console.log('User canceled scan', ex);
    } finally {
      await NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <ScrollView className='flex-1 p-6' contentContainerClassName='gap-4'>
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

      <Text className='text-lg font-medium'>
        <Trans>Parsed Messages:</Trans>
      </Text>
      <View className='rounded-lg bg-neutral-900 p-2'>
        <Text className='font-mono font-semibold'>
          {nfcData !== null ? nfcMessages : t`No Data`}
        </Text>
      </View>
    </ScrollView>
  );
}
