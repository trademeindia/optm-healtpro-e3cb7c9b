
import { FitnessData } from '@/hooks/useFitnessIntegration';
import { Activity, Heart, Footprints, Flame, Navigation, Moon, Clock } from 'lucide-react';

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

// Get icon component based on metric type
export const getMetricIcon = (metricType: string) => {
  switch (metricType.toLowerCase()) {
    case 'steps':
      return Footprints;
    case 'heart rate':
      return Heart;
    case 'calories':
      return Flame;
    case 'distance':
      return Navigation;
    case 'sleep':
      return Moon;
    case 'active minutes':
      return Clock;
    default:
      return Activity;
  }
};
