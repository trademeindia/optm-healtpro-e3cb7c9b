
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
  silent?: boolean;
}
