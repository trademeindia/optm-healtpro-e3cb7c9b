
import { FitnessProvider, FitnessData } from './types';

export const mockProviders: FitnessProvider[] = [
  {
    id: 'google-fit',
    name: 'Google Fit',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Google_Fit_icon_%282018%29.svg',
    isConnected: false,
    lastSynced: '',
    metrics: {
      steps: 0,
      calories: 0,
      heartRate: 0,
      distance: 0,
    }
  },
  {
    id: 'apple-health',
    name: 'Apple Health',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Apple_Health_Icon.png',
    isConnected: false,
    lastSynced: '',
    metrics: {
      steps: 0,
      calories: 0,
      heartRate: 0,
      distance: 0,
    }
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Fitbit_logo.svg',
    isConnected: false,
    lastSynced: '',
    metrics: {
      steps: 0,
      calories: 0,
      heartRate: 0,
      distance: 0,
    }
  }
];

export const generateMockFitnessData = (): FitnessData => ({
  steps: {
    data: Array.from({ length: 7 }, (_, i) => ({
      timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: Math.floor(Math.random() * 5000) + 3000
    })),
    summary: { total: 0, average: 0 }
  },
  heartRate: {
    data: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
      value: Math.floor(Math.random() * 20) + 60
    })),
    summary: { average: 0, min: 0, max: 0 }
  },
  calories: {
    data: Array.from({ length: 7 }, (_, i) => ({
      timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: Math.floor(Math.random() * 500) + 1500
    })),
    summary: { total: 0, average: 0 }
  }
});
