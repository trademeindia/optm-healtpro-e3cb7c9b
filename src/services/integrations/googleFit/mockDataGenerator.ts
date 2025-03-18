
import { FitnessData } from '@/hooks/fitness';
import { GoogleFitDataPoint } from './types';
import { addDays, format } from 'date-fns';

// Generate mock health data
export const generateMockHealthData = (): FitnessData => {
  const now = new Date();
  const timestamp = now.toISOString();
  
  return {
    steps: {
      name: 'Steps',
      value: Math.floor(Math.random() * 5000) + 3000, // 3000-8000 steps
      unit: 'steps',
      timestamp,
      change: Math.floor(Math.random() * 1000) - 200, // -200 to 800 change
      source: 'Google Fit'
    },
    heartRate: {
      name: 'Heart Rate',
      value: Math.floor(Math.random() * 30) + 60, // 60-90 bpm
      unit: 'bpm',
      timestamp,
      change: Math.floor(Math.random() * 10) - 5, // -5 to +5 change
      source: 'Google Fit'
    },
    calories: {
      name: 'Calories',
      value: Math.floor(Math.random() * 500) + 1200, // 1200-1700 calories
      unit: 'kcal',
      timestamp,
      change: Math.floor(Math.random() * 200) - 50, // -50 to +150 change
      source: 'Google Fit'
    },
    distance: {
      name: 'Distance',
      value: (Math.random() * 5 + 1).toFixed(1), // 1.0-6.0 km
      unit: 'km',
      timestamp,
      change: parseFloat((Math.random() * 2 - 0.5).toFixed(1)), // -0.5 to +1.5 km change
      source: 'Google Fit'
    },
    sleep: {
      name: 'Sleep',
      value: (Math.random() * 2 + 6).toFixed(1), // 6.0-8.0 hours
      unit: 'hours',
      timestamp,
      change: parseFloat((Math.random() * 1 - 0.5).toFixed(1)), // -0.5 to +0.5 hour change
      source: 'Google Fit'
    },
    activeMinutes: {
      name: 'Active Minutes',
      value: Math.floor(Math.random() * 60) + 30, // 30-90 minutes
      unit: 'min',
      timestamp,
      change: Math.floor(Math.random() * 30) - 10, // -10 to +20 minute change
      source: 'Google Fit'
    }
  };
};

// Generate mock historical data for a given data type, start date, and end date
export const generateMockHistoricalData = (
  dataType: string,
  startDate: Date,
  endDate: Date
): GoogleFitDataPoint[] => {
  const data: GoogleFitDataPoint[] = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Generate data for each day
    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    let value: number;
    
    switch (dataType.toLowerCase()) {
      case 'steps':
        // 3000-9000 steps with weekend bump
        const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
        value = Math.floor(Math.random() * 4000) + (isWeekend ? 5000 : 3000);
        break;
      case 'heart_rate':
        // 60-90 bpm with some variance
        value = Math.floor(Math.random() * 30) + 60;
        break;
      case 'calories':
        // 1200-2200 calories with weekend bump
        value = Math.floor(Math.random() * 500) + (currentDate.getDay() === 0 ? 1700 : 1200);
        break;
      case 'distance':
        // 0.5-6.0 km with weekend bump
        value = parseFloat((Math.random() * 4 + (currentDate.getDay() === 6 ? 2 : 0.5)).toFixed(1));
        break;
      case 'sleep':
        // 5-9 hours with weekend bump
        value = parseFloat((Math.random() * 2 + (currentDate.getDay() === 0 ? 7 : 5)).toFixed(1));
        break;
      case 'active_minutes':
        // 20-90 minutes with weekend bump
        value = Math.floor(Math.random() * 50) + (currentDate.getDay() === 6 ? 40 : 20);
        break;
      default:
        value = Math.floor(Math.random() * 100);
    }
    
    data.push({
      startTime: currentDate.toISOString(),
      endTime: endOfDay.toISOString(),
      value,
      dataType
    });
    
    // Move to next day
    currentDate = addDays(currentDate, 1);
  }
  
  return data;
};
