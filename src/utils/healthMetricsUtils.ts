
/**
 * Utility functions for processing health metrics data
 */

interface HealthMetric {
  value: number | string;
  unit: string;
  change: number;
  source?: string;
  lastSync?: string;
}

export const getHeartRate = (fitnessData: any): HealthMetric => {
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

export const getBloodPressure = (fitnessData: any): HealthMetric => {
  if (fitnessData.bloodPressure) {
    return {
      value: String(fitnessData.bloodPressure.value),
      unit: fitnessData.bloodPressure.unit,
      change: 0,
      source: fitnessData.bloodPressure.source,
      lastSync: new Date(fitnessData.bloodPressure.timestamp).toLocaleTimeString()
    };
  }
  return { value: '120/80', unit: 'mmHg', change: 0 };
};

export const getTemperature = (fitnessData: any): HealthMetric => {
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

export const getOxygen = (fitnessData: any): HealthMetric => {
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

export const getSteps = (fitnessData: any, activityData: any) => {
  return fitnessData.steps ? {
    data: activityData,
    currentValue: Number(fitnessData.steps.value),
    source: fitnessData.steps.source,
    lastSync: new Date(fitnessData.steps.timestamp).toLocaleTimeString()
  } : { data: activityData, currentValue: 8152 };
};

export const processHealthMetrics = (fitnessData: any, activityData: any) => {
  return {
    healthMetrics: {
      heartRate: getHeartRate(fitnessData),
      bloodPressure: getBloodPressure(fitnessData),
      temperature: getTemperature(fitnessData),
      oxygen: getOxygen(fitnessData)
    },
    steps: getSteps(fitnessData, activityData)
  };
};
