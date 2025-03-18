
import { GoogleFitAuth } from './auth/googleFitAuth';
import { GoogleFitDataService } from './data/googleFitDataService';
import { GoogleFitDataPoint, GoogleFitSyncResult, HistoricalDataRequest } from './data/googleFitDataTypes';
import { FitnessData } from '@/hooks/useFitnessIntegration';

/**
 * Main Google Fit service that provides all Google Fit functionality
 * This service coordinates authentication and data fetching
 */
class GoogleFitService {
  private auth: GoogleFitAuth;
  private dataService: GoogleFitDataService;

  constructor() {
    this.auth = new GoogleFitAuth();
    this.dataService = new GoogleFitDataService(this.auth);
  }

  /**
   * Check if user is authenticated with Google Fit
   */
  public isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  /**
   * Start the authentication process with Google Fit
   */
  public initiateAuth(): void {
    this.auth.initiateAuth();
  }

  /**
   * Disconnect from Google Fit
   */
  public async disconnect(): Promise<boolean> {
    return await this.auth.disconnect();
  }

  /**
   * Sync health data from Google Fit
   */
  public async syncHealthData(): Promise<GoogleFitSyncResult> {
    return await this.dataService.syncHealthData();
  }

  /**
   * Get historical health data from Google Fit
   */
  public async getHistoricalData(request: HistoricalDataRequest): Promise<GoogleFitDataPoint[]> {
    return await this.dataService.getHistoricalData(
      request.dataType,
      request.startDate,
      request.endDate
    );
  }
}

// Export a singleton instance
export const googleFitService = new GoogleFitService();

// Re-export types to maintain the same public API
export type { GoogleFitDataPoint, GoogleFitSyncResult, HistoricalDataRequest };
export { FitnessData };
