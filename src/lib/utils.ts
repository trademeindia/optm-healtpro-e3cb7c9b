
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: Date | string | number, formatString: string): string {
  // Convert input to Date if necessary
  let date: Date;
  
  if (typeof input === 'string' || typeof input === 'number') {
    date = new Date(input);
  } else {
    date = input;
  }
  
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  return format(date, formatString);
}
