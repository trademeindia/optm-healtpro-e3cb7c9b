
import { HealthMetric } from '@/types/health';
import { FitnessData } from '@/hooks/useFitnessIntegration';
import { Activity, Heart, Thermometer, Droplet } from 'lucide-react';

export const useHealthMetrics = (fitnessData: FitnessData): HealthMetric[] => {
  // Default metrics that would normally come from a health API
  const metrics: HealthMetric[] = [
    {
      id: '1',
      name: 'Heart Rate',
      value: fitnessData?.heartRate?.summary?.average || 72,
      unit: 'bpm',
      change: 2,
      status: 'normal',
      trend: 'stable',
      source: 'Google Fit',
      lastSync: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      change: 0,
      status: 'normal',
      trend: 'stable',
      source: 'Health Connect',
      lastSync: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Temperature',
      value: 98.6,
      unit: '°F',
      status: 'normal',
      trend: 'stable'
    },
    {
      id: '4',
      name: 'Oxygen Saturation',
      value: 98,
      unit: '%',
      status: 'normal',
      trend: 'stable'
    }
  ];

  return metrics;
};
