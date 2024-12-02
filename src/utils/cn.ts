import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function to merge complex tailwind classes
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
