
import GoogleFitAuthManager from './googleFit/authManager';
import GoogleFitDataService from './googleFit/dataService';
import { GoogleFitDataPoint, GoogleFitSyncResult } from './googleFit/types';
import { FitnessData } from '@/hooks/useFitnessIntegration';

class GoogleFitService {
  private authManager: GoogleFitAuthManager;
  private dataService: GoogleFitDataService;

  constructor() {
    this.authManager = new GoogleFitAuthManager();
    this.dataService = new GoogleFitDataService(this.authManager);
  }

  public isAuthenticated(): boolean {
    return this.authManager.isAuthenticated();
  }

  public initiateAuth(): void {
    this.authManager.initiateAuth();
  }

  public async disconnect(): Promise<boolean> {
    return this.authManager.disconnect();
  }

  public async syncHealthData(): Promise<GoogleFitSyncResult> {
    return this.dataService.syncHealthData();
  }

  public async getHistoricalData(dataType: string, startDate: Date, endDate: Date): Promise<GoogleFitDataPoint[]> {
    return this.dataService.getHistoricalData(dataType, startDate, endDate);
  }
}

// Export a singleton instance
export const googleFitService = new GoogleFitService();

// Re-export types for consumer convenience
export type { GoogleFitDataPoint, GoogleFitSyncResult };
