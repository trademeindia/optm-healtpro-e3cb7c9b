
export interface HealthMetric {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  change?: number;
  status?: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  source?: string;
  lastSync?: string;
  icon?: React.ReactNode;
}
