
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import useFitnessIntegration from '@/hooks/useFitnessIntegration';

interface HealthMetric {
  value: number | string;
  unit: string;
  change: number;
  source?: string;
  lastSync?: string;
}

interface ActivityData {
  data: Array<{ day: string; value: number }>;
  currentValue: number;
  source?: string;
  lastSync?: string;
}

export const useHealthData = () => {
  const { toast } = useToast();
  const { providers, fitnessData, refreshProviderData } = useFitnessIntegration();
  
  const hasConnectedApps = providers.some(p => p.isConnected);

  // Mock data for activity tracking
  const activityMockData = [
    { day: 'Mon', value: 8500 },
    { day: 'Tue', value: 9200 },
    { day: 'Wed', value: 7800 },
    { day: 'Thu', value: 8100 },
    { day: 'Fri', value: 10200 },
    { day: 'Sat', value: 6500 },
    { day: 'Sun', value: 7300 }
  ];

  const handleSyncAllData = () => {
    refreshProviderData();
    toast({
      title: "Health Data Sync",
      description: "Your health data is being synchronized...",
    });
  };

  // Get health metrics from fitness data or use defaults
  const getHeartRate = (): HealthMetric => {
    if (fitnessData.heartRate) {
      return {
        value: fitnessData.heartRate.value,
        unit: fitnessData.heartRate.unit,
        change: fitnessData.heartRate.change || 0,
        source: fitnessData.heartRate.source,
        lastSync: new Date(fitnessData.heartRate.timestamp).toLocaleTimeString()
      };
    }
    return { value: 72, unit: 'bpm', change: -3 };
  };

  const getBloodPressure = (): HealthMetric => {
    if (fitnessData.bloodPressure) {
      return {
        value: fitnessData.bloodPressure.value,
        unit: fitnessData.bloodPressure.unit,
        change: 0,
        source: fitnessData.bloodPressure.source,
        lastSync: new Date(fitnessData.bloodPressure.timestamp).toLocaleTimeString()
      };
    }
    return { value: '120/80', unit: 'mmHg', change: 0 };
  };

  const getTemperature = (): HealthMetric => {
    if (fitnessData.temperature) {
      return {
        value: fitnessData.temperature.value,
        unit: fitnessData.temperature.unit,
        change: fitnessData.temperature.change || 0.2,
        source: fitnessData.temperature.source,
        lastSync: new Date(fitnessData.temperature.timestamp).toLocaleTimeString()
      };
    }
    return { value: 98.6, unit: '°F', change: 0.2 };
  };

  const getOxygen = (): HealthMetric => {
    if (fitnessData.oxygenSaturation) {
      return {
        value: fitnessData.oxygenSaturation.value,
        unit: fitnessData.oxygenSaturation.unit,
        change: fitnessData.oxygenSaturation.change || 1,
        source: fitnessData.oxygenSaturation.source,
        lastSync: new Date(fitnessData.oxygenSaturation.timestamp).toLocaleTimeString()
      };
    }
    return { value: 98, unit: '%', change: 1 };
  };

  const getSteps = (): ActivityData => {
    return fitnessData.steps ? {
      data: activityMockData,
      currentValue: Number(fitnessData.steps.value),
      source: fitnessData.steps.source,
      lastSync: new Date(fitnessData.steps.timestamp).toLocaleTimeString()
    } : { data: activityMockData, currentValue: 8152 };
  };

  return {
    hasConnectedApps,
    handleSyncAllData,
    healthMetrics: {
      heartRate: getHeartRate(),
      bloodPressure: getBloodPressure(),
      temperature: getTemperature(),
      oxygen: getOxygen(),
      steps: getSteps()
    }
  };
};
