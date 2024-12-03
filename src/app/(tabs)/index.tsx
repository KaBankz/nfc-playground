/* eslint-disable lingui/no-unlocalized-strings */
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import NfcManager, {
  NfcTech,
  type TagEvent,
  type TNF,
} from 'react-native-nfc-manager';

import { Pressable } from '@/components/Pressable';
import { TabBodyScrollView } from '@/components/TabBodyScrollView';
import { Text } from '@/components/Text';

const parseNfcTagData = (tag: TagEvent) => {
  let parsedData = '';

  const tnfDescriptions: { [key in TNF]: string } = {
    0x0: 'Empty',
    0x01: 'Well-known',
    0x02: 'MIME Media Type',
    0x03: 'Absolute URI',
    0x04: 'External',
    0x05: 'Unknown',
    0x06: 'Unchanged',
    0x07: 'Reserved',
  };

  const parseNdefStatus = (status?: { status: number; capacity: number }) => {
    if (!status) return 'N/A';

    const statusDescriptions: Record<number, string> = {
      0: 'Not formatted for NDEF',
      1: 'Formatted but read-only',
      2: 'Formatted and read-write',
      3: 'Unknown status',
    };

    return {
      readable: statusDescriptions[status.status] || 'Unknown',
      capacity: `${status.capacity} bytes`,
    };
  };

  const decodeTextPayload = (payload: number[]): string => {
    const languageCodeLength = payload[0];
    return String.fromCharCode(...payload.slice(1 + languageCodeLength));
  };

  const getRecordType = (type: number[] | string): string => {
    const typeMap: Record<number, string> = {
      84: 'Text Record',
      85: 'URI Record',
      83: 'Smart Poster',
    };

    if (Array.isArray(type)) {
      return typeMap[type[0]] || `Custom Type (${type})`;
    }
    return type;
  };

  console.log('NFC Tag Details:');
  console.log('---------------');
  console.log(`Tag ID: ${tag.id ?? 'N/A'}`);
  console.log(`Tag Type: ${tag.tech ?? 'N/A'}`);

  parsedData += `Tag ID: ${tag.id ?? 'N/A'}\n`;
  parsedData += `Tag Type: ${tag.tech ?? 'N/A'}\n`;

  if (tag.ndefStatus) {
    const ndefStatus = parseNdefStatus(tag.ndefStatus);
    console.log(`NDEF Status: ${JSON.stringify(ndefStatus, null, 4)}`);
    parsedData += `NDEF Status: ${JSON.stringify(ndefStatus, null, 4)}`;
  }

  if (tag.ndefMessage) {
    tag.ndefMessage.forEach((record, index) => {
      console.log(`\nRecord ${index + 1}:`);
      console.log(`- TNF: ${record.tnf} (${tnfDescriptions[record.tnf]})`);
      console.log(`- Record Type: ${getRecordType(record.type)}`);
      console.log(`- Record ID: ${record.id || 'N/A'}`);

      parsedData += `\nRecord ${index + 1}:\n`;
      parsedData += `- TNF: ${record.tnf} (${tnfDescriptions[record.tnf]})\n`;
      parsedData += `- Record Type: ${getRecordType(record.type)}\n`;
      parsedData += `- Record ID: ${record.id || 'N/A'}\n`;

      try {
        if (Array.isArray(record.type) && record.type[0] === 84) {
          const decodedText = decodeTextPayload(record.payload);
          console.log(`- Decoded Payload: "${decodedText}"`);
          parsedData += `- Decoded Payload: "${decodedText}"\n`;
        } else {
          console.log(`- Raw Payload: ${JSON.stringify(record.payload)}`);
          parsedData += `- Raw Payload: ${JSON.stringify(record.payload)}\n`;
        }
      } catch (error) {
        console.log('- Payload Decoding Failed', error);
      }
    });
  }

  return parsedData;
};

export default function ReadTag() {
  const [nfcData, setNfcData] = useState<TagEvent | null>(null);
  const [parsedNfcData, setParsedNfcData] = useState<string | null>(null);

  async function readNdef() {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      tag.ndefStatus = await NfcManager.ndefHandler.getNdefStatus();
      // tag.nxpBytes = await NfcManager.nfcAHandler.transceive([0x3c, 0x00]);

      setNfcData(tag);
      setParsedNfcData(parseNfcTagData(tag));
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
              {
                text: t`OK`,
                onPress: () => {
                  setNfcData(null);
                  setParsedNfcData(null);
                },
              },
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
        <Trans>Parsed NFC Data:</Trans>
      </Text>
      <View className='rounded-lg bg-neutral-900 p-2'>
        <Text className='font-mono font-semibold'>
          {nfcData !== null ? parsedNfcData : t`No Data`}
        </Text>
      </View>
    </TabBodyScrollView>
  );
}
