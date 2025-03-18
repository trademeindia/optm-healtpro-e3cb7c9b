
export interface HealthMetric {
  name: string;
  value: number | string;
  unit: string;
  timestamp: string;
  change?: number;
  source: string;
}

export interface FitnessData {
  heartRate?: HealthMetric;
  steps?: HealthMetric;
  calories?: HealthMetric;
  bloodPressure?: HealthMetric;
  temperature?: HealthMetric;
  oxygenSaturation?: HealthMetric;
  distance?: HealthMetric;
  sleep?: HealthMetric;
  activeMinutes?: HealthMetric;
  [key: string]: HealthMetric | undefined;
}

export interface FitnessProvider {
  id: string;
  name: string;
  logo: string;
  isConnected: boolean;
  lastSync?: string;
  metrics: string[];
}
