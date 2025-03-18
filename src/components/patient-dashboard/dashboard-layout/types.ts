
import { HealthMetric } from '@/hooks/dashboard/useHealthMetrics';
import { ActivityData } from '@/hooks/dashboard/useActivityData';
import { TreatmentTask } from '@/hooks/dashboard/useTreatmentTasks';
import { UpcomingAppointment } from '@/hooks/calendar/types';

export interface DashboardMainContentProps {
  healthMetrics: HealthMetric[];
  activityData: ActivityData[];
  treatmentTasks: TreatmentTask[];
  upcomingAppointments: UpcomingAppointment[];
  biologicalAge: number;
  chronologicalAge: number;
  hasConnectedApps: boolean;
  onSyncData: () => void;
  handleConfirmAppointment: (appointmentId: string) => void;
  handleRescheduleAppointment: (appointmentId: string) => void;
  // This is the incorrectly spelled prop that might come in
  handleReschedureAppointment?: (appointmentId: string) => void;
}
