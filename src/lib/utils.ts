import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date, formatString: string): string {
  return format(date, formatString);
}

// Define medical colors used throughout the app
export const medicalColors = {
  red: '#ef4444',   // Heart rate, critical, danger
  blue: '#3b82f6',  // Blood pressure  
  green: '#10b981', // Oxygen, success
  yellow: '#eab308', // Temperature, warning
  purple: '#8b5cf6', // Sleep
  teal: '#06b6d4',   // Hydration
  orange: '#f97316', // Activity
  pink: '#ec4899',   // BMI
};
