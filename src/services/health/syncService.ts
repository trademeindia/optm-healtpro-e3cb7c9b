
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HealthMetricType, SyncOptions } from './types';

/**
 * Service for synchronizing health data from connected providers
 */
export class HealthSyncService {
  // Flag to track active synchronization
  private isSyncing: boolean = false;
  private lastSyncTime: Date | null = null;
  private syncAttempts: number = 0;
  private MAX_SYNC_ATTEMPTS: number = 3;

  /**
   * Synchronize health data from all connected providers
   */
  public async syncAllHealthData(userId: string, options: SyncOptions = {}): Promise<boolean> {
    if (!userId) {
      console.error('Cannot sync health data: No user ID provided');
      return false;
    }
    
    // Skip if already syncing, unless force refresh is specified
    if (this.isSyncing && !options.forceRefresh) {
      console.log('Health data sync already in progress');
      return false;
    }
    
    this.isSyncing = true;
    this.syncAttempts = 0;
    
    try {
      // For demo users, just simulate a successful sync
      if (userId.startsWith('demo-')) {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.lastSyncTime = new Date();
        return true;
      }
      
      const success = await this.performSync(userId, options);
      
      if (success) {
        this.lastSyncTime = new Date();
        this.syncAttempts = 0;
        return true;
      } else if (this.syncAttempts < this.MAX_SYNC_ATTEMPTS) {
        // Retry sync with exponential backoff
        return await this.retrySync(userId, options);
      }
      
      return false;
    } catch (error) {
      console.error('Error syncing health data:', error);
      
      // Retry on error if we haven't exceeded max attempts
      if (this.syncAttempts < this.MAX_SYNC_ATTEMPTS) {
        return await this.retrySync(userId, options);
      }
      
      return false;
    } finally {
      this.isSyncing = false;
    }
  }
  
  /**
   * Get the last sync time
   */
  public getLastSyncTime(): Date | null {
    return this.lastSyncTime;
  }
  
  /**
   * Check if sync is currently in progress
   */
  public isSyncInProgress(): boolean {
    return this.isSyncing;
  }
  
  /**
   * Perform the actual sync operation
   */
  private async performSync(userId: string, options: SyncOptions = {}): Promise<boolean> {
    try {
      // Get all connected fitness providers
      const { data: connections, error } = await supabase
        .from('fitness_connections')
        .select('*')
        .eq('user_id', userId) as any;
        
      if (error) {
        throw error;
      }
      
      if (!connections || connections.length === 0) {
        console.log('No connected fitness providers found');
        return false;
      }
      
      let syncSuccessful = false;
      
      // Sync data from each connected provider
      for (const connection of connections) {
        if (connection.provider === 'google_fit') {
          console.log(`Syncing Google Fit data for user ${userId}`);
          const success = await this.syncGoogleFitData(userId, connection.access_token, options);
          syncSuccessful = syncSuccessful || success;
        }
      }
      
      return syncSuccessful;
    } catch (error) {
      console.error('Error in performSync:', error);
      this.syncAttempts++;
      throw error;
    }
  }
  
  /**
   * Retry sync with exponential backoff
   */
  private async retrySync(userId: string, options: SyncOptions = {}): Promise<boolean> {
    this.syncAttempts++;
    
    // Calculate backoff time: 2^attempt * 1000ms (1s, 2s, 4s)
    const backoffTime = Math.pow(2, this.syncAttempts - 1) * 1000;
    console.log(`Retrying sync attempt ${this.syncAttempts} after ${backoffTime}ms`);
    
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const success = await this.performSync(userId, options);
          resolve(success);
        } catch (error) {
          console.error(`Error in retry attempt ${this.syncAttempts}:`, error);
          resolve(false);
        } finally {
          this.isSyncing = false;
        }
      }, backoffTime);
    });
  }
  
  /**
   * Sync data specifically from Google Fit
   */
  private async syncGoogleFitData(
    userId: string, 
    accessToken: string, 
    options: SyncOptions = {}
  ): Promise<boolean> {
    try {
      console.log(`Fetching Google Fit data for user ${userId}`);
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || "https://evqbnxbeimcacqkgdola.supabase.co"}/functions/v1/fetch-google-fit-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          accessToken,
          timeRange: options.timeRange || 'week',
          metricTypes: options.metricTypes || ['steps', 'heart_rate', 'calories', 'distance', 'sleep', 'workout']
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from Google Fit API:', errorData);
        
        // Handle token refresh specifically
        if (response.status === 401 && errorData.refreshed) {
          toast.info("Google Fit connection refreshed. Syncing data again...");
          // Retry after token refresh
          return this.syncAllHealthData(userId, options);
        }
        
        throw new Error(`Error fetching Google Fit data: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log('Successfully fetched Google Fit data:', data);
      
      // Update last sync time in the database
      await supabase
        .from('fitness_connections')
        .update({ last_sync: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('provider', 'google_fit');
      
      return true;
    } catch (error) {
      console.error('Error syncing Google Fit data:', error);
      return false;
    }
  }
}

export const healthSyncService = new HealthSyncService();
