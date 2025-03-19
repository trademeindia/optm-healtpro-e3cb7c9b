
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, formatString: string): string {
  // Convert string to Date if necessary
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  return format(dateObj, formatString);
}
