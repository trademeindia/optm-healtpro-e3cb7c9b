
import { FitnessData } from '@/types/medicalData';

export const useHealthMetrics = (fitnessData: FitnessData) => {
  // Helper functions for health metrics
  const getHeartRate = () => {
    if (fitnessData.heartRate) {
      return parseInt(String(fitnessData.heartRate.value));
    }
    return 72;
  };

  const getBloodPressure = () => {
    if (fitnessData.bloodPressure) {
      const bpString = String(fitnessData.bloodPressure.value);
      const [systolic, diastolic] = bpString.split('/').map(v => parseInt(v.trim()));
      return { systolic, diastolic };
    }
    return { systolic: 120, diastolic: 80 };
  };

  const getTemperature = () => {
    if (fitnessData.temperature) {
      return parseFloat(String(fitnessData.temperature.value));
    }
    return 98.6;
  };

  const getOxygen = () => {
    if (fitnessData.oxygenSaturation) {
      return parseInt(String(fitnessData.oxygenSaturation.value));
    }
    return 98;
  };

  return {
    heartRate: getHeartRate(),
    bloodPressure: getBloodPressure(),
    bloodOxygen: getOxygen(),
    temperature: getTemperature()
  };
};
