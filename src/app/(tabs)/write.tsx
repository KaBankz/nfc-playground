import { useState } from 'react';
import { Alert, TextInput, View } from 'react-native';

import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';

import { Pressable } from '@/components/Pressable';
import { TabBodyScrollView } from '@/components/TabBodyScrollView';
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
    <TabBodyScrollView className='flex-1' contentContainerClassName='gap-4 p-6'>
      <View className='flex-row gap-4'>
        <Pressable
          className='grow items-center rounded-lg bg-neutral-300 px-4 py-6 transition-colors active:bg-neutral-400 dark:bg-neutral-800 dark:active:bg-neutral-700'
          onPress={writeNdef}>
          <Text className='text-xl font-semibold'>
            <Trans>Write NFC Tag</Trans>
          </Text>
        </Pressable>
        <Pressable
          className='grow items-center rounded-lg bg-red-500 px-4 py-6 transition-colors active:bg-red-600 dark:bg-red-600 dark:active:bg-red-700'
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
      <View className='rounded-lg bg-neutral-300 p-2 dark:bg-neutral-900'>
        <TextInput
          value={userInput}
          onChangeText={setUserInput}
          multiline
          className='text-black dark:text-white'
        />
      </View>
    </TabBodyScrollView>
  );
}
