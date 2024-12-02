import { Text as RNText, type TextProps } from 'react-native';

import { cn } from '@/utils/cn';

/**
 * Theme aware `Text` component
 */
export const Text = ({ className, ...props }: TextProps) => {
  return (
    <RNText
      className={cn('text-black dark:text-white', className)}
      {...props}
    />
  );
};
