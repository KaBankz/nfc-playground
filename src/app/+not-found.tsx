import { StyleSheet, View } from 'react-native';

import { Trans, useLingui } from '@lingui/react/macro';
import { Link, Stack } from 'expo-router';

import { Text } from '@/components/Text';

export default function NotFoundScreen() {
  const { t } = useLingui();

  return (
    <>
      <Stack.Screen options={{ title: t`Oops!` }} />
      <View style={styles.container}>
        <Text>
          <Trans>This screen doesn't exist.</Trans>
        </Text>
        <Link href='/' style={styles.link}>
          <Text>
            <Trans>Go to home screen!</Trans>
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
