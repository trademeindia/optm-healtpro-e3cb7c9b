
import { FitnessData } from './types';

export const getGoogleFitData = (): FitnessData => {
  return {
    heartRate: {
      name: 'Heart Rate',
      value: 72,
      unit: 'bpm',
      timestamp: new Date().toISOString(),
      change: -3,
      source: 'Google Fit'
    },
    steps: {
      name: 'Steps',
      value: 8524,
      unit: 'steps',
      timestamp: new Date().toISOString(),
      change: 12,
      source: 'Google Fit'
    },
    calories: {
      name: 'Calories',
      value: 1250,
      unit: 'kcal',
      timestamp: new Date().toISOString(),
      change: 5,
      source: 'Google Fit'
    },
    bloodPressure: {
      name: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      timestamp: new Date().toISOString(),
      source: 'Google Fit'
    }
  };
};

export const getSamsungHealthData = (): FitnessData => {
  return {
    heartRate: {
      name: 'Heart Rate',
      value: 68,
      unit: 'bpm',
      timestamp: new Date().toISOString(),
      change: -8,
      source: 'Samsung Health'
    },
    steps: {
      name: 'Steps',
      value: 9120,
      unit: 'steps',
      timestamp: new Date().toISOString(),
      change: 15,
      source: 'Samsung Health'
    },
    calories: {
      name: 'Calories',
      value: 1380,
      unit: 'kcal',
      timestamp: new Date().toISOString(),
      change: 8,
      source: 'Samsung Health'
    }
  };
};

export const getAppleHealthData = (): FitnessData => {
  return {
    heartRate: {
      name: 'Heart Rate',
      value: 70,
      unit: 'bpm',
      timestamp: new Date().toISOString(),
      change: -5,
      source: 'Apple Health'
    },
    steps: {
      name: 'Steps',
      value: 8950,
      unit: 'steps',
      timestamp: new Date().toISOString(),
      change: 14,
      source: 'Apple Health'
    },
    bloodPressure: {
      name: 'Blood Pressure',
      value: '118/78',
      unit: 'mmHg',
      timestamp: new Date().toISOString(),
      source: 'Apple Health'
    },
    oxygenSaturation: {
      name: 'Oxygen Saturation',
      value: 98,
      unit: '%',
      timestamp: new Date().toISOString(),
      change: 1,
      source: 'Apple Health'
    }
  };
};

export const getFitbitData = (): FitnessData => {
  return {
    heartRate: {
      name: 'Heart Rate',
      value: 74,
      unit: 'bpm',
      timestamp: new Date().toISOString(),
      change: 2,
      source: 'Fitbit'
    },
    steps: {
      name: 'Steps',
      value: 7890,
      unit: 'steps',
      timestamp: new Date().toISOString(),
      change: 5,
      source: 'Fitbit'
    },
    calories: {
      name: 'Calories',
      value: 1120,
      unit: 'kcal',
      timestamp: new Date().toISOString(),
      change: 3,
      source: 'Fitbit'
    }
  };
};

export const getProviderData = (providerId: string): FitnessData => {
  switch (providerId) {
    case 'google_fit':
      return getGoogleFitData();
    case 'samsung_health':
      return getSamsungHealthData();
    case 'apple_health':
      return getAppleHealthData();
    case 'fitbit':
      return getFitbitData();
    default:
      return {};
  }
};
