
import { GoogleFitDataPoint, GoogleFitSyncResult } from './types';
import GoogleFitAuthManager from './authManager';
import { generateMockHealthData, generateMockHistoricalData } from './mockDataGenerator';
import { FitnessData } from '@/hooks/fitness';

class GoogleFitDataService {
  private authManager: GoogleFitAuthManager;

  constructor(authManager: GoogleFitAuthManager) {
    this.authManager = authManager;
  }

  public async syncHealthData(userId: string | null = null): Promise<GoogleFitSyncResult> {
    try {
      const hasValidToken = await this.authManager.ensureValidToken();
      if (!hasValidToken) {
        return {
          success: false,
          data: {},
          message: "Not authenticated with Google Fit",
          timestamp: new Date().toISOString()
        };
      }
      
      if (userId) {
        console.log(`Syncing Google Fit data for user: ${userId}`);
      }
      
      // In a real implementation, this would call Google Fit API endpoints
      // For demo purposes, we'll return mock data
      const currentTimestamp = new Date().toISOString();
      
      // Generate realistic mock data
      const mockData: FitnessData = generateMockHealthData();
      
      // Store user-specific data
      if (userId) {
        try {
          localStorage.setItem(`googleFit_data_${userId}`, JSON.stringify(mockData));
          localStorage.setItem(`googleFit_lastSync_${userId}`, currentTimestamp);
        } catch (e) {
          console.error('Error storing Google Fit data in localStorage:', e);
        }
      }
      
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

  public async getHistoricalData(
    dataType: string, 
    startDate: Date, 
    endDate: Date,
    userId: string | null = null
  ): Promise<GoogleFitDataPoint[]> {
    try {
      const hasValidToken = await this.authManager.ensureValidToken();
      if (!hasValidToken) {
        throw new Error("Not authenticated with Google Fit");
      }
      
      if (userId) {
        console.log(`Getting historical ${dataType} data for user: ${userId}`);
      }
      
      // In a real implementation, this would call Google Fit API endpoints
      // For demo purposes, we'll return mock historical data
      return generateMockHistoricalData(dataType, startDate, endDate);
    } catch (error) {
      console.error(`Error getting historical ${dataType} data:`, error);
      throw error;
    }
  }
}

export default GoogleFitDataService;
