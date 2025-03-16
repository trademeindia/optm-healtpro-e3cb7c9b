
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Add formatDate utility function
export function formatDate(date: Date | string, formatString: string = 'PPP'): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  try {
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
}
