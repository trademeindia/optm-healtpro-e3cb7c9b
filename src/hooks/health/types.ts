
import { TimeRange, HealthMetricType, FitnessConnection } from '@/services/health/types';

export interface UseHealthDataOptions {
  autoSync?: boolean;
  syncInterval?: number;
  defaultTimeRange?: TimeRange;
}

export interface UseHealthDataResult {
  metrics: any;
  metricsHistory: any;
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  hasGoogleFitConnected: boolean;
  connections: FitnessConnection[];
  syncData: (forceRefresh?: boolean) => Promise<boolean>;
  getMetricHistory: (type: HealthMetricType) => any[];
  setTimeRange: (range: TimeRange) => void;
}
