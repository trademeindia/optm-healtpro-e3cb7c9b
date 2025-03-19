
import { healthSyncService } from './syncService';
import { healthMetricsService } from './metricsService';
import { connectionService } from './connectionService';
import { realtimeService } from './realtimeService';
import { SyncOptions, HealthMetricType, TimeRange, HealthMetric, FitnessConnection } from './types';

/**
 * Service for managing health data from various sources
 */
export class HealthDataService {
  
  // Singleton instance
  private static instance: HealthDataService;
  
  // Timestamp of last sync
  private lastSyncTime: Date | null = null;
  
  private constructor() {
    // Initialize service and setup realtime subscription
    realtimeService.setupRealtimeSubscription();
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(): HealthDataService {
    if (!HealthDataService.instance) {
      HealthDataService.instance = new HealthDataService();
    }
    return HealthDataService.instance;
  }
  
  /**
   * Synchronize health data from all connected providers
   */
  public async syncAllHealthData(userId: string, options: SyncOptions = {}): Promise<boolean> {
    const success = await healthSyncService.syncAllHealthData(userId, options);
    
    // Update last sync time if successful
    if (success) {
      this.lastSyncTime = new Date();
    }
    
    return success;
  }
  
  /**
   * Get health metrics for a specific user
   */
  public async getHealthMetrics(
    userId: string,
    metricType?: HealthMetricType,
    timeRange: TimeRange = 'week',
    limit: number = 100
  ): Promise<HealthMetric[]> {
    return healthMetricsService.getHealthMetrics(userId, metricType, timeRange, limit);
  }
  
  /**
   * Get the latest value for a specific metric
   */
  public async getLatestMetric(
    userId: string,
    metricType: HealthMetricType
  ): Promise<HealthMetric | null> {
    return healthMetricsService.getLatestMetric(userId, metricType);
  }
  
  /**
   * Check if a user has connected Google Fit
   */
  public async hasGoogleFitConnected(userId: string): Promise<boolean> {
    return connectionService.hasGoogleFitConnected(userId);
  }
  
  /**
   * Get information about the user's fitness connections
   */
  public async getFitnessConnections(userId: string): Promise<FitnessConnection[]> {
    return connectionService.getFitnessConnections(userId);
  }

  /**
   * Get the last sync time
   */
  public getLastSyncTime(): Date | null {
    return this.lastSyncTime;
  }
}

// Export singleton instance
export const healthDataService = HealthDataService.getInstance();

// Re-export types
export * from './types';
