
import { HealthMetric, HealthMetricType, TimeRange, FitnessConnection } from '@/services/health';

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
