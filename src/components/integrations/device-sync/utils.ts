
import { FitnessData } from '@/hooks/useFitnessIntegration';

// Format health data for display
export const formatHealthMetric = (value: number | string, unit: string) => {
  return `${value} ${unit}`;
};

// Check if health data is available
export const hasHealthData = (data: FitnessData): boolean => {
  return Object.keys(data).length > 0;
};

// Get percentage change indicator
export const getChangeIndicator = (changeValue: number): 'positive' | 'negative' | 'neutral' => {
  if (changeValue > 0) return 'positive';
  if (changeValue < 0) return 'negative';
  return 'neutral';
};

// Format change value for display
export const formatChange = (change: number): string => {
  const prefix = change > 0 ? '+' : '';
  return `${prefix}${change}%`;
};

// Get class name based on health metric change
export const getChangeClass = (change: number): string => {
  if (change > 0) return 'text-green-500';
  if (change < 0) return 'text-red-500';
  return 'text-gray-500';
};

// Get icon name based on health metric change
export const getChangeIcon = (change: number): string => {
  if (change > 0) return 'trending_up';
  if (change < 0) return 'trending_down';
  return 'remove';
};
