import { forwardRef } from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';

import { useBottomTabOverflow } from '@/components/ui/TabBarBackground.ios';

// eslint-disable-next-line react/display-name
export const TabBodyScrollView = forwardRef<any, ScrollViewProps>(
  ({ ...props }, ref) => {
    const paddingBottom = useBottomTabOverflow();

    return (
      <ScrollView
        automaticallyAdjustsScrollIndicatorInsets
        contentInsetAdjustmentBehavior='automatic'
        contentInset={{ bottom: paddingBottom }}
        scrollIndicatorInsets={{ bottom: paddingBottom }}
        {...props}
        ref={ref}
      />
    );
  }
);
