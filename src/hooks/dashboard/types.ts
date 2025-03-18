
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
  title: string; // Make this required to match UpcomingAppointment
  date: string;
  time: string;
  endTime: string; // Add this to match UpcomingAppointment
  doctor: string;
  type: string;
  status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
}

export interface ActivityData {
  data: { day: string; value: number }[];
  currentValue: number;
  source?: string;
  lastSync?: string;
}
