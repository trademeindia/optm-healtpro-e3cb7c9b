
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
        console.log('Demo user sync completed successfully');
        return true;
      }
      
      const success = await this.performSync(userId, options);
      
      if (success) {
        this.lastSyncTime = new Date();
        this.syncAttempts = 0;
        console.log('Health data sync completed successfully');
        return true;
      } else if (this.syncAttempts < this.MAX_SYNC_ATTEMPTS) {
        // Retry sync with exponential backoff
        console.log(`Sync failed, attempt ${this.syncAttempts + 1}/${this.MAX_SYNC_ATTEMPTS}`);
        return await this.retrySync(userId, options);
      }
      
      console.error('Health data sync failed after maximum attempts');
      return false;
    } catch (error) {
      console.error('Error syncing health data:', error);
      
      // Retry on error if we haven't exceeded max attempts
      if (this.syncAttempts < this.MAX_SYNC_ATTEMPTS) {
        console.log(`Sync error, retrying (attempt ${this.syncAttempts + 1}/${this.MAX_SYNC_ATTEMPTS})`);
        return await this.retrySync(userId, options);
      }
      
      console.error('Health data sync failed after maximum attempts due to errors');
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
      console.log(`Starting health data sync for user ${userId}`);
      // Get all connected fitness providers
      const { data: connections, error } = await supabase
        .from('fitness_connections')
        .select('*')
        .eq('user_id', userId)
        .eq('is_connected', true);
        
      if (error) {
        console.error('Error fetching fitness connections:', error);
        throw error;
      }
      
      if (!connections || connections.length === 0) {
        console.log('No connected fitness providers found');
        return false;
      }
      
      console.log(`Found ${connections.length} connected fitness providers`);
      let syncSuccessful = false;
      
      // Sync data from each connected provider
      for (const connection of connections) {
        if (connection.provider === 'google_fit') {
          console.log(`Syncing Google Fit data for user ${userId}`);
          // Fixed: Removed recursive call by not passing the syncAllHealthData method
          const success = await this.syncGoogleFitData(
            userId, 
            connection.access_token, 
            options
          );
          syncSuccessful = syncSuccessful || success;
          
          if (success) {
            console.log('Google Fit data sync successful');
          } else {
            console.error('Google Fit data sync failed');
          }
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
      
      // Get the Supabase URL from environment variable or use the default
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://evqbnxbeimcacqkgdola.supabase.co";
      
      const response = await fetch(`${supabaseUrl}/functions/v1/fetch-google-fit-data`, {
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

      // Handle token refresh
      if (response.status === 401) {
        const errorData = await response.json();
        
        if (errorData.refreshed) {
          console.log("Token refreshed, retrying Google Fit sync");
          
          if (!options.silent) {
            toast.info("Google Fit connection refreshed. Syncing data again...");
          }
          
          // Wait a moment to ensure token is updated in the system
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Fixed: Use a direct retry instead of a recursive call
          // This will retry the sync once after a token refresh
          const retryResponse = await fetch(`${supabaseUrl}/functions/v1/fetch-google-fit-data`, {
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
          
          if (!retryResponse.ok) {
            const retryErrorData = await retryResponse.json();
            console.error('Error response from Google Fit API after token refresh:', retryErrorData);
            throw new Error(`Error fetching Google Fit data after token refresh: ${retryErrorData.error || retryResponse.statusText}`);
          }
          
          return true;
        } else {
          console.error('Google Fit authentication failed:', errorData.error);
          
          if (!options.silent) {
            toast.error("Google Fit authentication expired", {
              description: "Please reconnect your Google Fit account."
            });
          }
          
          return false;
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from Google Fit API:', errorData);
        
        throw new Error(`Error fetching Google Fit data: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log('Successfully fetched Google Fit data');
      
      // Update last sync time in the database
      await supabase
        .from('fitness_connections')
        .update({ last_sync: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('provider', 'google_fit');
      
      return true;
    } catch (error) {
      console.error('Error syncing Google Fit data:', error);
      
      // Show a toast notification if not in silent mode
      if (!options.silent) {
        toast.error("Failed to sync Google Fit data", {
          description: error.message || "Please try again later."
        });
      }
      
      return false;
    }
  }
}

export const healthSyncService = new HealthSyncService();
