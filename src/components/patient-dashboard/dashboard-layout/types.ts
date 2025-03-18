
export interface DashboardMainContentProps {
  healthMetrics: any;
  activityData: any;
  treatmentTasks: {
    id: string;
    title: string;
    time: string;
    completed: boolean;
  }[];
  upcomingAppointments: any[];
  biologicalAge: number;
  chronologicalAge: number;
  hasConnectedApps: boolean;
  onSyncData: () => void;
  handleConfirmAppointment?: (id: string) => void;
  handleRescheduleAppointment?: (id: string) => void;
}

export interface LeftColumnProps {
  activityData: any;
  upcomingAppointments: any[];
  handleConfirmAppointment: (id: string) => void;
  handleRescheduleAppointment: (id: string) => void;
  biologicalAge: number;
  chronologicalAge: number;
  hasConnectedApps: boolean;
  onSyncData: () => void;
  healthMetrics: any;
  treatmentTasks: {
    id: string;
    title: string;
    time: string;
    completed: boolean;
  }[];
}

export interface RightColumnProps {
  treatmentTasks: {
    id: string;
    title: string;
    time: string;
    completed: boolean;
  }[];
  biologicalAge: number;
  chronologicalAge: number;
}
