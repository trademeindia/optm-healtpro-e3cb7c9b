
import { AppointmentStatus } from '@/types/appointment';

export interface DashboardAppointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  type: string;
  status?: AppointmentStatus;
}

export interface HealthMetricData {
  value: string | number;
  unit: string;
  change: number;
  source?: string;
  lastSync?: string;
}

export interface ActivityDataPoint {
  day: string;
  value: number;
}

export interface ActivityData {
  data: ActivityDataPoint[];
  currentValue: number;
  source?: string;
  lastSync?: string;
}

export interface TreatmentTask {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

export interface HealthMetrics {
  heartRate: HealthMetricData;
  bloodPressure: HealthMetricData;
  temperature: HealthMetricData;
  oxygen: HealthMetricData;
}
