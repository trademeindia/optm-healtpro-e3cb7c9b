
import { FitnessData } from '@/hooks/useFitnessIntegration';
import { GoogleFitAuth } from '../auth/googleFitAuth';
import { GoogleFitDataPoint, GoogleFitSyncResult } from './googleFitDataTypes';

export class GoogleFitDataService {
  private auth: GoogleFitAuth;

  constructor(auth: GoogleFitAuth) {
    this.auth = auth;
  }

  public async syncHealthData(): Promise<GoogleFitSyncResult> {
    try {
      const hasValidToken = await this.auth.ensureValidToken();
      if (!hasValidToken) {
        return {
          success: false,
          data: {},
          message: "Not authenticated with Google Fit",
          timestamp: new Date().toISOString()
        };
      }
      
      // In a real implementation, this would call Google Fit API endpoints
      // For demo purposes, we'll return mock data
      const currentTimestamp = new Date().toISOString();
      
      // Generate realistic mock data
      const mockData: FitnessData = this.generateMockHealthData(currentTimestamp);
      
      return {
        success: true,
        data: mockData,
        message: "Health data synced successfully",
        timestamp: currentTimestamp
      };
    } catch (error) {
      console.error('Error syncing Google Fit data:', error);
      return {
        success: false,
        data: {},
        message: "Failed to sync health data",
        timestamp: new Date().toISOString()
      };
    }
  }

  private generateMockHealthData(timestamp: string): FitnessData {
    return {
      heartRate: {
        name: 'Heart Rate',
        value: Math.floor(60 + Math.random() * 20), // 60-80 bpm
        unit: 'bpm',
        timestamp: timestamp,
        change: Math.floor(Math.random() * 10) * (Math.random() > 0.5 ? 1 : -1),
        source: 'Google Fit'
      },
      steps: {
        name: 'Steps',
        value: Math.floor(5000 + Math.random() * 7000), // 5000-12000 steps
        unit: 'steps',
        timestamp: timestamp,
        change: Math.floor(Math.random() * 15) * (Math.random() > 0.3 ? 1 : -1),
        source: 'Google Fit'
      },
      calories: {
        name: 'Calories',
        value: Math.floor(1000 + Math.random() * 1000), // 1000-2000 kcal
        unit: 'kcal',
        timestamp: timestamp,
        change: Math.floor(Math.random() * 8) * (Math.random() > 0.4 ? 1 : -1),
        source: 'Google Fit'
      },
      distance: {
        name: 'Distance',
        value: Math.floor(30 + Math.random() * 100) / 10, // 3.0-13.0 km
        unit: 'km',
        timestamp: timestamp,
        change: Math.floor(Math.random() * 12),
        source: 'Google Fit'
      },
      sleep: {
        name: 'Sleep',
        value: Math.floor(5 + Math.random() * 4), // 5-9 hours
        unit: 'hours',
        timestamp: timestamp,
        change: Math.floor(Math.random() * 20) * (Math.random() > 0.5 ? 1 : -1),
        source: 'Google Fit'
      },
      activeMinutes: {
        name: 'Active Minutes',
        value: Math.floor(30 + Math.random() * 60), // 30-90 minutes
        unit: 'min',
        timestamp: timestamp,
        change: Math.floor(Math.random() * 25),
        source: 'Google Fit'
      }
    };
  }

  public async getHistoricalData(dataType: string, startDate: Date, endDate: Date): Promise<GoogleFitDataPoint[]> {
    try {
      const hasValidToken = await this.auth.ensureValidToken();
      if (!hasValidToken) {
        throw new Error("Not authenticated with Google Fit");
      }
      
      // In a real implementation, this would call Google Fit API endpoints
      // For demo purposes, we'll return mock historical data
      return this.generateMockHistoricalData(dataType, startDate, endDate);
    } catch (error) {
      console.error(`Error getting historical ${dataType} data:`, error);
      throw error;
    }
  }

  private generateMockHistoricalData(dataType: string, startDate: Date, endDate: Date): GoogleFitDataPoint[] {
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
}
