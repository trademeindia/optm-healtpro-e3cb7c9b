
import { HealthMetricData } from '@/hooks/dashboard/types';
import { TreatmentTask } from '@/hooks/dashboard/types';
import { HealthMetrics } from '@/hooks/dashboard/types';
import { ActivityData } from '@/hooks/dashboard/types';
import { UpcomingAppointment } from '@/hooks/calendar/types';
import { DashboardAppointment } from '@/hooks/dashboard/types';

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

// Add the ColumnProps type that was missing
export interface ColumnProps extends DashboardMainContentProps {}
