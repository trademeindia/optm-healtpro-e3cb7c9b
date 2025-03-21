
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SyncOptions } from '../types';

/**
 * Service for handling provider-specific sync operations
 */
export class ProviderSyncService {
  /**
   * Get all connected fitness providers for a user
   */
  public async getConnectedProviders(userId: string) {
    const { data: connections, error } = await supabase
      .from('fitness_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('is_connected', true);
      
    if (error) {
      console.error('Error fetching fitness connections:', error);
      throw error;
    }
    
    return connections;
  }

  /**
   * Sync data specifically from Google Fit
   */
  public async syncGoogleFitData(
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
          
          // Direct retry with the newly refreshed token - avoid recursive call
          return await this.performRetryAfterTokenRefresh(userId, accessToken, options, supabaseUrl);
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

  /**
   * Helper method to retry sync after token refresh
   * Breaking out this function to avoid recursive call that caused infinite type instantiation
   */
  private async performRetryAfterTokenRefresh(
    userId: string,
    accessToken: string,
    options: SyncOptions,
    supabaseUrl: string
  ): Promise<boolean> {
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
  }
}
