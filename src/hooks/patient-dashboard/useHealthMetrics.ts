
import { FitnessData } from '@/types/medicalData';

// Interface for processed health metrics
export interface HealthMetricsData {
  heartRate: { value: string | number; unit: string; change: number; source?: string; lastSync?: string };
  bloodPressure: { value: string; unit: string; change: number; source?: string; lastSync?: string };
  temperature: { value: string | number; unit: string; change: number; source?: string; lastSync?: string };
  oxygen: { value: string | number; unit: string; change: number; source?: string; lastSync?: string };
}

export const useHealthMetrics = (fitnessData: FitnessData) => {
  // Helper functions for health metrics
  const getHeartRate = () => {
    if (fitnessData.heartRate) {
      return {
        value: fitnessData.heartRate.value,
        unit: fitnessData.heartRate.unit,
        change: fitnessData.heartRate.change || 0,
        source: fitnessData.heartRate.source,
        lastSync: new Date(fitnessData.heartRate.timestamp).toLocaleTimeString()
      };
    }
    // Make sure we return a number here, not a string
    return { value: 72, unit: 'bpm', change: -3 };
  };

  const getBloodPressure = () => {
    if (fitnessData.bloodPressure) {
      return {
        value: String(fitnessData.bloodPressure.value), // Ensure value is a string
        unit: fitnessData.bloodPressure.unit,
        change: 0,
        source: fitnessData.bloodPressure.source,
        lastSync: new Date(fitnessData.bloodPressure.timestamp).toLocaleTimeString()
      };
    }
    return { value: '120/80', unit: 'mmHg', change: 0 };
  };

  const getTemperature = () => {
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

  const getOxygen = () => {
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

  // Get processed health metrics
  const healthMetrics: HealthMetricsData = {
    heartRate: getHeartRate(),
    bloodPressure: getBloodPressure(),
    temperature: getTemperature(),
    oxygen: getOxygen()
  };

  return healthMetrics;
};
