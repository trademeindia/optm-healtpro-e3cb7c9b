
import { supabase } from '@/integrations/supabase/client';
import { FitnessConnection } from './types';

/**
 * Service for managing connections to fitness platforms
 */
export class ConnectionService {
  /**
   * Check if a user has connected Google Fit
   */
  public async hasGoogleFitConnected(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('fitness_connections')
        .select('*')
        .eq('user_id', userId)
        .eq('provider', 'google_fit')
        .limit(1);
        
      if (error) {
        throw error;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking Google Fit connection:', error);
      return false;
    }
  }
  
  /**
   * Get information about the user's fitness connections
   */
  public async getFitnessConnections(userId: string): Promise<FitnessConnection[]> {
    try {
      const { data, error } = await supabase
        .from('fitness_connections')
        .select('*')
        .eq('user_id', userId);
        
      if (error) {
        throw error;
      }
      
      return (data || []).map(conn => ({
        id: conn.id,
        userId: conn.user_id,
        provider: conn.provider,
        isConnected: true,
        lastSync: conn.last_sync
      }));
    } catch (error) {
      console.error('Error fetching fitness connections:', error);
      return [];
    }
  }
}

export const connectionService = new ConnectionService();
