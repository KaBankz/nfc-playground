import { useState } from 'react';
import { Alert, ScrollView, TextInput, View } from 'react-native';

import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';

import { Pressable } from '@/components/Pressable';
import { Text } from '@/components/Text';

export default function WriteTag() {
  const [userInput, setUserInput] = useState('');

  async function writeNdef() {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const bytes = Ndef.encodeMessage([Ndef.textRecord(userInput)]);

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
      }
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
          onPress={writeNdef}>
          <Text className='text-xl font-semibold'>
            <Trans>Write NFC Tag</Trans>
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
              { text: t`OK`, onPress: () => setUserInput('') },
            ]);
          }}>
          <Text className='text-xl font-semibold'>
            <Trans>Reset</Trans>
          </Text>
        </Pressable>
      </View>

      <Text className='text-lg font-medium'>
        <Trans>Input:</Trans>
      </Text>
      <View className='rounded-lg bg-neutral-900 p-2'>
        <TextInput
          value={userInput}
          onChangeText={setUserInput}
          multiline
          className='text-black dark:text-white'
        />
      </View>
    </ScrollView>
  );
}
