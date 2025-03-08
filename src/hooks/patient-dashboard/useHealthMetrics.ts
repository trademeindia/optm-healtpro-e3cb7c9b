
import { FitnessData } from '@/hooks/useFitnessIntegration';

// Helper functions for health metrics
export const getHeartRate = (fitnessData: FitnessData) => {
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

export const getBloodPressure = (fitnessData: FitnessData) => {
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

export const getTemperature = (fitnessData: FitnessData) => {
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

export const getOxygen = (fitnessData: FitnessData) => {
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
