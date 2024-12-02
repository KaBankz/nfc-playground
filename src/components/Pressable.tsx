import { forwardRef, useCallback } from 'react';
import {
  Platform,
  Pressable as RNPressable,
  type GestureResponderEvent,
  type PressableProps,
  type View,
} from 'react-native';

import * as Haptics from 'expo-haptics';

type CustomPressableProps = {
  haptics?: boolean;
  hapticsType?: 'impactAsync' | 'notificationAsync';
  hapticsStyle?: Haptics.ImpactFeedbackStyle | Haptics.NotificationFeedbackType;
  hapticsEventTrigger?: 'onPressIn' | 'onPress';
};

// eslint-disable-next-line react/display-name
export const Pressable = forwardRef<
  View,
  PressableProps & CustomPressableProps
>(
  (
    {
      onPressIn,
      onPress,
      haptics = true,
      hapticsType = 'impactAsync',
      hapticsStyle = Haptics.ImpactFeedbackStyle.Light,
      hapticsEventTrigger = 'onPressIn',
      ...props
    },
    ref
  ) => {
    const hapticFeedback = useCallback(() => {
      if (haptics) {
        if (hapticsType === 'impactAsync') {
          Haptics.impactAsync(hapticsStyle as Haptics.ImpactFeedbackStyle);
        } else if (hapticsType === 'notificationAsync') {
          Haptics.notificationAsync(
            hapticsStyle as Haptics.NotificationFeedbackType
          );
        }
      }
    }, [haptics, hapticsStyle, hapticsType]);

    const onPressInHandler = useCallback(
      (event: GestureResponderEvent) => {
        if (hapticsEventTrigger === 'onPressIn') hapticFeedback();
        onPressIn?.(event);
      },
      [hapticFeedback, hapticsEventTrigger, onPressIn]
    );

    const onPressHandler = useCallback(
      (event: GestureResponderEvent) => {
        if (hapticsEventTrigger === 'onPress') hapticFeedback();
        onPress?.(event);
      },
      [hapticFeedback, hapticsEventTrigger, onPress]
    );

    return (
      <RNPressable
        ref={ref}
        onPressIn={Platform.OS !== 'web' ? onPressInHandler : onPressIn}
        onPress={Platform.OS !== 'web' ? onPressHandler : onPress}
        {...props}
      />
    );
  }
);
