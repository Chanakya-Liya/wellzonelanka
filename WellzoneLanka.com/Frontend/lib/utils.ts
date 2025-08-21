import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// This is the `cn` function that combines `clsx` and `twMerge`
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

