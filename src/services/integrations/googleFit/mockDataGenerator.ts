
import { GoogleFitDataPoint } from './types';
import { FitnessData } from '@/hooks/useFitnessIntegration';

export function generateMockHealthData(): FitnessData {
  const currentTimestamp = new Date().toISOString();
  
  // Generate realistic mock data
  return {
    heartRate: {
      name: 'Heart Rate',
      value: Math.floor(60 + Math.random() * 20), // 60-80 bpm
      unit: 'bpm',
      timestamp: currentTimestamp,
      change: Math.floor(Math.random() * 10) * (Math.random() > 0.5 ? 1 : -1),
      source: 'Google Fit'
    },
    steps: {
      name: 'Steps',
      value: Math.floor(5000 + Math.random() * 7000), // 5000-12000 steps
      unit: 'steps',
      timestamp: currentTimestamp,
      change: Math.floor(Math.random() * 15) * (Math.random() > 0.3 ? 1 : -1),
      source: 'Google Fit'
    },
    calories: {
      name: 'Calories',
      value: Math.floor(1000 + Math.random() * 1000), // 1000-2000 kcal
      unit: 'kcal',
      timestamp: currentTimestamp,
      change: Math.floor(Math.random() * 8) * (Math.random() > 0.4 ? 1 : -1),
      source: 'Google Fit'
    },
    distance: {
      name: 'Distance',
      value: Math.floor(30 + Math.random() * 100) / 10, // 3.0-13.0 km
      unit: 'km',
      timestamp: currentTimestamp,
      change: Math.floor(Math.random() * 12),
      source: 'Google Fit'
    },
    sleep: {
      name: 'Sleep',
      value: Math.floor(5 + Math.random() * 4), // 5-9 hours
      unit: 'hours',
      timestamp: currentTimestamp,
      change: Math.floor(Math.random() * 20) * (Math.random() > 0.5 ? 1 : -1),
      source: 'Google Fit'
    },
    activeMinutes: {
      name: 'Active Minutes',
      value: Math.floor(30 + Math.random() * 60), // 30-90 minutes
      unit: 'min',
      timestamp: currentTimestamp,
      change: Math.floor(Math.random() * 25),
      source: 'Google Fit'
    }
  };
}

export function generateMockHistoricalData(
  dataType: string, 
  startDate: Date, 
  endDate: Date
): GoogleFitDataPoint[] {
  const mockHistoricalData: GoogleFitDataPoint[] = [];
  
  // Generate daily data points between start and end dates
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const startTime = new Date(currentDate);
    const endTime = new Date(currentDate);
    endTime.setHours(23, 59, 59, 999);
    
    let value: number;
    
    // Generate appropriate values based on data type
    switch (dataType) {
      case 'steps':
        value = Math.floor(5000 + Math.random() * 7000);
        break;
      case 'heart_rate':
        value = Math.floor(60 + Math.random() * 20);
        break;
      case 'calories':
        value = Math.floor(1000 + Math.random() * 1000);
        break;
      case 'distance':
        value = Math.floor(30 + Math.random() * 100) / 10;
        break;
      case 'sleep':
        value = Math.floor(5 + Math.random() * 4);
        break;
      case 'active_minutes':
        value = Math.floor(30 + Math.random() * 60);
        break;
      default:
        value = Math.random() * 100;
    }
    
    mockHistoricalData.push({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      value,
      dataType
    });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return mockHistoricalData;
}
