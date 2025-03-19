
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HealthMetricType, SyncOptions } from './types';

/**
 * Service for synchronizing health data from connected providers
 */
export class HealthSyncService {
  // Flag to track active synchronization
  private isSyncing: boolean = false;

  /**
   * Synchronize health data from all connected providers
   */
  public async syncAllHealthData(userId: string, options: SyncOptions = {}): Promise<boolean> {
    if (!userId) {
      console.error('Cannot sync health data: No user ID provided');
      return false;
    }
    
    if (this.isSyncing && !options.forceRefresh) {
      console.log('Health data sync already in progress');
      return false;
    }
    
    this.isSyncing = true;
    
    try {
      // Get all connected fitness providers
      const { data: connections, error } = await supabase
        .from('fitness_connections')
        .select('*')
        .eq('user_id', userId);
        
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
          const success = await this.syncGoogleFitData(userId, connection.access_token, options);
          syncSuccessful = syncSuccessful || success;
        }
      }
      
      return syncSuccessful;
    } catch (error) {
      console.error('Error syncing health data:', error);
      return false;
    } finally {
      this.isSyncing = false;
    }
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
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || "https://xjxxuqqyjqzgmvtgrpgv.supabase.co"}/functions/v1/fetch-google-fit-data`, {
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
        
        // Handle token refresh specifically
        if (response.status === 401 && errorData.refreshed) {
          toast.info("Google Fit connection refreshed. Syncing data again...");
          // Retry after token refresh
          return this.syncAllHealthData(userId, options);
        }
        
        throw new Error(`Error fetching Google Fit data: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      return true;
    } catch (error) {
      console.error('Error syncing Google Fit data:', error);
      return false;
    }
  }
}

export const healthSyncService = new HealthSyncService();
