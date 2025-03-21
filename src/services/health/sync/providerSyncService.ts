
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
      
      const result = await this.fetchGoogleFitData(userId, accessToken, options, supabaseUrl);
      
      // Handle token refresh case
      if (result.status === 401 && result.data?.refreshed) {
        console.log("Token refreshed, retrying Google Fit sync");
        
        if (!options.silent) {
          toast.info("Google Fit connection refreshed. Syncing data again...");
        }
        
        // Wait a moment to ensure token is updated in the system
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Retry the request with a new fetch call
        return await this.retryFetchAfterRefresh(userId, accessToken, options, supabaseUrl);
      }
      
      // Handle authentication failure
      if (result.status === 401) {
        console.error('Google Fit authentication failed:', result.error);
        
        if (!options.silent) {
          toast.error("Google Fit authentication expired", {
            description: "Please reconnect your Google Fit account."
          });
        }
        
        return false;
      }
      
      // Handle other errors
      if (!result.success) {
        console.error('Error response from Google Fit API:', result.error);
        throw new Error(`Error fetching Google Fit data: ${result.error || result.statusText}`);
      }
      
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
   * Make the actual fetch request to Google Fit API
   * Extracted to separate method to prevent recursive type instantiation
   */
  private async fetchGoogleFitData(
    userId: string,
    accessToken: string,
    options: SyncOptions,
    supabaseUrl: string
  ): Promise<{
    status: number;
    success: boolean;
    data?: any;
    error?: string;
    statusText?: string;
  }> {
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
    
    const data = await response.json().catch(() => ({}));
    
    return {
      status: response.status,
      success: response.ok,
      data,
      error: data.error,
      statusText: response.statusText
    };
  }

  /**
   * Retry fetch after token refresh
   * Separate method to avoid recursive type instantiation
   */
  private async retryFetchAfterRefresh(
    userId: string,
    accessToken: string,
    options: SyncOptions,
    supabaseUrl: string
  ): Promise<boolean> {
    const result = await this.fetchGoogleFitData(userId, accessToken, options, supabaseUrl);
    
    if (!result.success) {
      console.error('Error response from Google Fit API after token refresh:', result.error);
      throw new Error(`Error fetching Google Fit data after token refresh: ${result.error || result.statusText}`);
    }
    
    return true;
  }
}
