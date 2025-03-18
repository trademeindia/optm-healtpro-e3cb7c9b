
import { FitnessProvider } from './types';

export const getMockProviders = (): FitnessProvider[] => {
  return [
    {
      id: 'google_fit',
      name: 'Google Fit',
      logo: '/lovable-uploads/ac216bba-3494-4854-b6f4-362893358214.png',
      isConnected: false,
      metrics: ['Heart Rate', 'Steps', 'Calories', 'Blood Pressure'],
    },
    {
      id: 'samsung_health',
      name: 'Samsung Health',
      logo: 'https://via.placeholder.com/24?text=SH',
      isConnected: false,
      metrics: ['Heart Rate', 'Steps', 'Calories', 'Sleep'],
    },
    {
      id: 'apple_health',
      name: 'Apple Health',
      logo: 'https://via.placeholder.com/24?text=AH',
      isConnected: false,
      metrics: ['Heart Rate', 'Steps', 'Calories', 'Blood Pressure', 'Oxygen'],
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      logo: 'https://via.placeholder.com/24?text=FB',
      isConnected: false,
      metrics: ['Heart Rate', 'Steps', 'Calories', 'Sleep'],
    }
  ];
};
