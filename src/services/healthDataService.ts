
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type HealthMetricType = 'steps' | 'heart_rate' | 'calories' | 'distance' | 'sleep' | 'workout';
export type TimeRange = 'day' | 'week' | 'month' | 'year';

export interface HealthMetric {
  id: string;
  userId: string;
  type: HealthMetricType;
  value: number;
  unit: string;
  timestamp: string;
  source: string;
  metadata?: Record<string, any>;
}

export interface FitnessConnection {
  id: string;
  userId: string;
  provider: string;
  isConnected: boolean;
  lastSync?: string;
}

export interface SyncOptions {
  forceRefresh?: boolean;
  timeRange?: TimeRange;
  metricTypes?: HealthMetricType[];
}

/**
 * Service for managing health data from various sources
 */
export class HealthDataService {
  
  // Singleton instance
  private static instance: HealthDataService;
  
  // Flag to track active synchronization
  private isSyncing: boolean = false;
  
  // Cache for quick access to the latest metrics
  private metricCache: Map<string, HealthMetric> = new Map();
  
  // Timestamp of last sync
  private lastSyncTime: Date | null = null;
  
  private constructor() {
    // Initialize service
    this.setupRealtimeSubscription();
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
      
      // Update last sync time if successful
      if (syncSuccessful) {
        this.lastSyncTime = new Date();
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
  
  /**
   * Get health metrics for a specific user
   */
  public async getHealthMetrics(
    userId: string,
    metricType?: HealthMetricType,
    timeRange: TimeRange = 'week',
    limit: number = 100
  ): Promise<HealthMetric[]> {
    try {
      let query = supabase
        .from('fitness_data')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false })
        .limit(limit);
        
      if (metricType) {
        query = query.eq('data_type', metricType);
      }
      
      // Apply time range filter
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case 'day':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      query = query.gte('start_time', startDate.toISOString());
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data.map(item => ({
        id: item.id,
        userId: item.user_id,
        type: item.data_type as HealthMetricType,
        value: Number(item.value),
        unit: item.unit,
        timestamp: item.start_time,
        source: item.source,
        metadata: item.metadata
      })) as HealthMetric[];
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      return [];
    }
  }
  
  /**
   * Get the latest value for a specific metric
   */
  public async getLatestMetric(
    userId: string,
    metricType: HealthMetricType
  ): Promise<HealthMetric | null> {
    try {
      // Check cache first
      const cacheKey = `${userId}:${metricType}`;
      if (this.metricCache.has(cacheKey)) {
        return this.metricCache.get(cacheKey) || null;
      }
      
      const { data, error } = await supabase
        .from('fitness_data')
        .select('*')
        .eq('user_id', userId)
        .eq('data_type', metricType)
        .order('start_time', { ascending: false })
        .limit(1);
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const metric: HealthMetric = {
          id: data[0].id,
          userId: data[0].user_id,
          type: data[0].data_type as HealthMetricType,
          value: Number(data[0].value),
          unit: data[0].unit,
          timestamp: data[0].start_time,
          source: data[0].source,
          metadata: data[0].metadata
        };
        
        // Cache the result
        this.metricCache.set(cacheKey, metric);
        
        return metric;
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching latest ${metricType} metric:`, error);
      return null;
    }
  }
  
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
  
  /**
   * Setup realtime subscription to health data
   */
  private setupRealtimeSubscription() {
    try {
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'fitness_data'
          },
          (payload) => {
            // Update cache with new data
            const { new: newData } = payload;
            if (newData) {
              const metric: HealthMetric = {
                id: newData.id,
                userId: newData.user_id,
                type: newData.data_type as HealthMetricType,
                value: Number(newData.value),
                unit: newData.unit,
                timestamp: newData.start_time,
                source: newData.source,
                metadata: newData.metadata
              };
              
              const cacheKey = `${metric.userId}:${metric.type}`;
              this.metricCache.set(cacheKey, metric);
            }
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('Error setting up realtime subscription:', error);
    }
  }
}

// Export singleton instance
export const healthDataService = HealthDataService.getInstance();
