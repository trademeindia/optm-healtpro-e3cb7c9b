
import React from 'react';
import { HealthMetricsCard } from './HealthMetricsCard';
import { AppointmentsCard } from './AppointmentsCard';
import { BiologicalAgeCard } from './BiologicalAgeCard';
import { ActivityTrackingCard } from './ActivityTrackingCard';
import { Appointment } from '@/services/calendar/types';
import { ActivityData } from '@/hooks/patient-dashboard';

interface DashboardMainContentProps {
  healthMetrics: {
    heartRate: number;
    bloodPressure: { systolic: number; diastolic: number };
    bloodOxygen: number;
    temperature: number;
  };
  upcomingAppointments: Appointment[];
  biologicalAge: number;
  chronologicalAge: number;
  activityData: ActivityData;
  handleSyncAllData: () => Promise<void>;
  hasConnectedApps: boolean;
  handleConfirmAppointment: (id: string) => void;
  handleRescheduleAppointment: (id: string) => void;
}

const DashboardMainContent: React.FC<DashboardMainContentProps> = ({
  healthMetrics,
  upcomingAppointments,
  biologicalAge,
  chronologicalAge,
  activityData,
  handleSyncAllData,
  hasConnectedApps,
  handleConfirmAppointment,
  handleRescheduleAppointment
}) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* Health Metrics */}
      <HealthMetricsCard healthMetrics={healthMetrics} />
      
      {/* Upcoming Appointments */}
      <AppointmentsCard 
        upcomingAppointments={upcomingAppointments}
        handleConfirmAppointment={handleConfirmAppointment}
        handleRescheduleAppointment={handleRescheduleAppointment}
      />
      
      {/* Biological Age */}
      <BiologicalAgeCard 
        biologicalAge={biologicalAge}
        chronologicalAge={chronologicalAge}
      />
      
      {/* Activity Tracking */}
      <ActivityTrackingCard 
        activityData={activityData}
        handleSyncAllData={handleSyncAllData}
        hasConnectedApps={hasConnectedApps}
      />
    </div>
  );
};

export default DashboardMainContent;
