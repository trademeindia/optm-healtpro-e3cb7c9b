
import GoogleFitAuthManager from './googleFit/authManager';
import GoogleFitDataService from './googleFit/dataService';
import { GoogleFitDataPoint, GoogleFitSyncResult } from './googleFit/types';
import { FitnessData } from '@/hooks/fitness';

class GoogleFitService {
  private authManager: GoogleFitAuthManager;
  private dataService: GoogleFitDataService;
  private userId: string | null = null;

  constructor() {
    this.authManager = new GoogleFitAuthManager();
    this.dataService = new GoogleFitDataService(this.authManager);
    
    // Try to get user ID from localStorage
    this.loadUserContext();
  }
  
  private loadUserContext() {
    try {
      const authData = localStorage.getItem('authUser');
      if (authData) {
        const user = JSON.parse(authData);
        if (user && user.id) {
          this.userId = user.id;
          console.log(`GoogleFitService initialized with user ID: ${this.userId}`);
        }
      }
    } catch (e) {
      console.error('Error loading user context for GoogleFitService:', e);
    }
  }
  
  public setUserId(userId: string) {
    this.userId = userId;
    console.log(`GoogleFitService: User ID set to ${userId}`);
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
    // Include user context for data service
    return this.dataService.syncHealthData(this.userId);
  }

  public async getHistoricalData(dataType: string, startDate: Date, endDate: Date): Promise<GoogleFitDataPoint[]> {
    // Include user context for historical data
    return this.dataService.getHistoricalData(dataType, startDate, endDate, this.userId);
  }
}

// Export a singleton instance
export const googleFitService = new GoogleFitService();

// Re-export types for consumer convenience
export type { GoogleFitDataPoint, GoogleFitSyncResult };
