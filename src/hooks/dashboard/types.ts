
export interface TreatmentTask {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

export interface HealthMetricData {
  value: number | string;
  unit: string;
  change?: number;
  source?: string;
  lastSync?: string;
  timestamp?: string;
}

export interface HealthMetrics {
  heartRate: HealthMetricData;
  bloodPressure: HealthMetricData;
  temperature: HealthMetricData;
  oxygen: HealthMetricData;
  [key: string]: HealthMetricData;
}

export interface DashboardAppointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  type: string;
  status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  title?: string;
  endTime?: string;
}

export interface ActivityData {
  data: { day: string; value: number }[];
  currentValue: number;
  source?: string;
  lastSync?: string;
}
