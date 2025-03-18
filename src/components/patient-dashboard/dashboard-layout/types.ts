
import { HealthMetricData } from '@/hooks/dashboard/types';
import { TreatmentTask } from '@/hooks/dashboard/types';
import { UpcomingAppointment } from '@/hooks/calendar/types';
import { DashboardAppointment } from '@/hooks/dashboard/types';

// Export these interfaces so they can be imported in other files
export interface HealthMetrics {
  heartRate: HealthMetricData;
  bloodPressure: HealthMetricData;
  temperature: HealthMetricData;
  oxygen: HealthMetricData;
  [key: string]: HealthMetricData;
}

export interface ActivityData {
  data: { day: string; value: number }[];
  currentValue: number;
  source?: string;
  lastSync?: string;
}

export interface DashboardMainContentProps {
  healthMetrics: HealthMetrics;
  activityData: ActivityData;
  treatmentTasks: TreatmentTask[];
  upcomingAppointments: UpcomingAppointment[] | DashboardAppointment[];
  biologicalAge: number;
  chronologicalAge: number;
  hasConnectedApps: boolean;
  onSyncData: () => Promise<void>;
  handleConfirmAppointment: (appointmentId: string) => void;
  handleRescheduleAppointment: (appointmentId: string) => void;
  // This is the incorrectly spelled prop that might come in
  handleReschedureAppointment?: (appointmentId: string) => void;
}

// Add the ColumnProps type
export interface ColumnProps extends DashboardMainContentProps {}
