
import { FitnessData } from './types';

// Mock function to simulate getting data from a fitness provider API
export const getProviderData = async (providerId: string): Promise<FitnessData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return mock data based on provider ID
  switch (providerId) {
    case 'google_fit':
      return {
        heartRate: {
          name: 'Heart Rate',
          value: Math.floor(Math.random() * 30) + 60, // 60-90 bpm
          unit: 'bpm',
          timestamp: new Date().toISOString(),
          change: Math.floor(Math.random() * 10) - 5, // -5 to +5 change
          source: 'Google Fit'
        },
        steps: {
          name: 'Steps',
          value: Math.floor(Math.random() * 5000) + 2000, // 2000-7000 steps
          unit: 'steps',
          timestamp: new Date().toISOString(),
          change: Math.floor(Math.random() * 1000), // 0 to 1000 steps increase
          source: 'Google Fit'
        },
        calories: {
          name: 'Calories',
          value: Math.floor(Math.random() * 500) + 200, // 200-700 calories
          unit: 'kcal',
          timestamp: new Date().toISOString(),
          change: Math.floor(Math.random() * 100), // 0 to 100 calories increase
          source: 'Google Fit'
        }
      };
      
    case 'fitbit':
      return {
        heartRate: {
          name: 'Heart Rate',
          value: Math.floor(Math.random() * 25) + 65, // 65-90 bpm
          unit: 'bpm',
          timestamp: new Date().toISOString(),
          change: Math.floor(Math.random() * 8) - 4, // -4 to +4 change
          source: 'Fitbit'
        },
        steps: {
          name: 'Steps',
          value: Math.floor(Math.random() * 6000) + 3000, // 3000-9000 steps
          unit: 'steps',
          timestamp: new Date().toISOString(),
          change: Math.floor(Math.random() * 1200), // 0 to 1200 steps increase
          source: 'Fitbit'
        },
        sleep: {
          name: 'Sleep',
          value: Math.floor(Math.random() * 3) + 5, // 5-8 hours
          unit: 'hours',
          timestamp: new Date().toISOString(),
          change: (Math.random() * 1.5) - 0.5, // -0.5 to +1 hour change
          source: 'Fitbit'
        }
      };
      
    case 'apple_health':
      return {
        heartRate: {
          name: 'Heart Rate',
          value: Math.floor(Math.random() * 20) + 60, // 60-80 bpm
          unit: 'bpm',
          timestamp: new Date().toISOString(),
          change: Math.floor(Math.random() * 6) - 3, // -3 to +3 change
          source: 'Apple Health'
        },
        steps: {
          name: 'Steps',
          value: Math.floor(Math.random() * 4000) + 4000, // 4000-8000 steps
          unit: 'steps',
          timestamp: new Date().toISOString(),
          change: Math.floor(Math.random() * 800), // 0 to 800 steps increase
          source: 'Apple Health'
        },
        oxygenSaturation: {
          name: 'Oxygen Saturation',
          value: Math.floor(Math.random() * 3) + 97, // 97-99%
          unit: '%',
          timestamp: new Date().toISOString(),
          change: 0,
          source: 'Apple Health'
        }
      };
      
    case 'samsung_health':
      return {
        heartRate: {
          name: 'Heart Rate',
          value: Math.floor(Math.random() * 25) + 60, // 60-85 bpm
          unit: 'bpm',
          timestamp: new Date().toISOString(),
          change: Math.floor(Math.random() * 10) - 5, // -5 to +5 change
          source: 'Samsung Health'
        },
        steps: {
          name: 'Steps',
          value: Math.floor(Math.random() * 5500) + 2500, // 2500-8000 steps
          unit: 'steps',
          timestamp: new Date().toISOString(),
          change: Math.floor(Math.random() * 900), // 0 to 900 steps increase
          source: 'Samsung Health'
        },
        sleep: {
          name: 'Sleep',
          value: Math.floor(Math.random() * 4) + 5, // 5-9 hours
          unit: 'hours',
          timestamp: new Date().toISOString(),
          change: (Math.random() * 1.2) - 0.4, // -0.4 to +0.8 hour change
          source: 'Samsung Health'
        }
      };
      
    default:
      return {};
  }
};
