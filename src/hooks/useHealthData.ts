
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { 
  healthDataService, 
  HealthMetric, 
  HealthMetricType, 
  TimeRange, 
  FitnessConnection 
} from '@/services/healthDataService';

export interface UseHealthDataOptions {
  autoSync?: boolean;
  syncInterval?: number; // in milliseconds
  defaultTimeRange?: TimeRange;
}

export interface UseHealthDataResult {
  metrics: Record<HealthMetricType, HealthMetric | null>;
  metricsHistory: Record<HealthMetricType, HealthMetric[]>;
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  hasGoogleFitConnected: boolean;
  connections: FitnessConnection[];
  syncData: (forceRefresh?: boolean) => Promise<boolean>;
  getMetricHistory: (metricType: HealthMetricType, timeRange?: TimeRange) => Promise<HealthMetric[]>;
  setTimeRange: (range: TimeRange) => void;
}

/**
 * Hook for accessing and managing health data
 */
export const useHealthData = (options: UseHealthDataOptions = {}): UseHealthDataResult => {
  const { 
    autoSync = true, 
    syncInterval = 30000, // 30 seconds
    defaultTimeRange = 'week' 
  } = options;
  
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>(defaultTimeRange);
  const [hasGoogleFitConnected, setHasGoogleFitConnected] = useState<boolean>(false);
  const [connections, setConnections] = useState<FitnessConnection[]>([]);
  
  // Store the latest value for each metric type
  const [metrics, setMetrics] = useState<Record<HealthMetricType, HealthMetric | null>>({
    steps: null,
    heart_rate: null,
    calories: null,
    distance: null,
    sleep: null,
    workout: null
  });
  
  // Store history for each metric type
  const [metricsHistory, setMetricsHistory] = useState<Record<HealthMetricType, HealthMetric[]>>({
    steps: [],
    heart_rate: [],
    calories: [],
    distance: [],
    sleep: [],
    workout: []
  });
  
  /**
   * Sync health data from all connected sources
   */
  const syncData = useCallback(async (forceRefresh: boolean = false): Promise<boolean> => {
    if (!user) return false;
    
    setIsSyncing(true);
    
    try {
      const success = await healthDataService.syncAllHealthData(user.id, {
        forceRefresh,
        timeRange
      });
      
      if (success) {
        setLastSyncTime(new Date());
      }
      
      return success;
    } catch (error) {
      console.error('Error syncing health data:', error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [user, timeRange]);
  
  /**
   * Get historical data for a specific metric type
   */
  const getMetricHistory = useCallback(async (
    metricType: HealthMetricType,
    range: TimeRange = timeRange
  ): Promise<HealthMetric[]> => {
    if (!user) return [];
    
    try {
      const data = await healthDataService.getHealthMetrics(user.id, metricType, range);
      
      // Update the metrics history state
      setMetricsHistory(prev => ({
        ...prev,
        [metricType]: data
      }));
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${metricType} history:`, error);
      return [];
    }
  }, [user, timeRange]);
  
  /**
   * Load initial data and check for Google Fit connection
   */
  useEffect(() => {
    const loadInitialData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Check if Google Fit is connected
        const hasConnected = await healthDataService.hasGoogleFitConnected(user.id);
        setHasGoogleFitConnected(hasConnected);
        
        // Get all connections
        const userConnections = await healthDataService.getFitnessConnections(user.id);
        setConnections(userConnections);
        
        // Load latest metrics for each type
        const metricTypes: HealthMetricType[] = ['steps', 'heart_rate', 'calories', 'distance', 'sleep', 'workout'];
        const latestMetrics: Record<HealthMetricType, HealthMetric | null> = {
          steps: null,
          heart_rate: null,
          calories: null,
          distance: null,
          sleep: null,
          workout: null
        };
        
        // Load metrics in parallel
        await Promise.all(metricTypes.map(async (type) => {
          const metric = await healthDataService.getLatestMetric(user.id, type);
          latestMetrics[type] = metric;
          
          // Also load history
          const history = await healthDataService.getHealthMetrics(user.id, type, timeRange);
          setMetricsHistory(prev => ({
            ...prev,
            [type]: history
          }));
        }));
        
        setMetrics(latestMetrics);
        
        // Perform initial sync if Google Fit is connected
        if (hasConnected && autoSync) {
          await syncData();
        }
      } catch (error) {
        console.error('Error loading initial health data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [user, autoSync, syncData, timeRange]);
  
  /**
   * Set up automatic sync on interval
   */
  useEffect(() => {
    if (!user || !autoSync || !hasGoogleFitConnected) return;
    
    const interval = setInterval(() => {
      syncData();
    }, syncInterval);
    
    return () => clearInterval(interval);
  }, [user, autoSync, syncInterval, hasGoogleFitConnected, syncData]);
  
  return {
    metrics,
    metricsHistory,
    isLoading,
    isSyncing,
    lastSyncTime,
    hasGoogleFitConnected,
    connections,
    syncData,
    getMetricHistory,
    setTimeRange
  };
};
