
export interface DashboardMainContentProps {
  healthMetrics: {
    heartRate: {
      value: number;
      unit: string;
      change: number;
      source?: string;
      lastSync?: string;
    };
    bloodPressure: {
      value: string;
      unit: string;
      change: number;
      source?: string;
      lastSync?: string;
    };
    temperature: {
      value: number;
      unit: string;
      change: number;
      source?: string;
      lastSync?: string;
    };
    oxygen: {
      value: number;
      unit: string;
      change: number;
      source?: string;
      lastSync?: string;
    };
  };
  activityData: {
    data: any[];
    currentValue: number;
    source?: string;
    lastSync?: string;
  };
  treatmentTasks: {
    id: string;
    title: string;
    time: string;
    completed: boolean;
  }[];
  upcomingAppointments: {
    id: string;
    date: string;
    time: string;
    doctor: string;
    type: string;
  }[];
  biologicalAge: number;
  chronologicalAge: number;
  hasConnectedApps: boolean;
  onSyncData: () => void;
  handleConfirmAppointment: (id: string) => void;
  handleRescheduleAppointment: (id: string) => void;
}
