
import { useHealthMetrics } from './useHealthMetrics';
import { useActivityData, ActivityData } from './useActivityData';
import { useDataSync } from './useDataSync';
import { useAppointmentHandlers } from './useAppointmentHandlers';
import { FitnessData, FitnessProvider } from '@/types/medicalData';
import { Appointment } from '@/services/calendar/types';
import { mockTreatmentTasks } from './mockData';

export const usePatientDashboard = () => {
  // Mock data for fitness providers
  const fitnessProviders: FitnessProvider[] = [
    { id: 'apple-health', name: 'Apple Health', isConnected: true, lastSync: '2023-06-01T10:30:00Z' },
    { id: 'fitbit', name: 'Fitbit', isConnected: false },
    { id: 'google-fit', name: 'Google Fit', isConnected: true, lastSync: '2023-05-28T14:15:00Z' },
  ];

  // Mock data for fitness data
  const fitnessData: FitnessData = {
    steps: {
      value: '8152',
      source: 'Apple Health',
      timestamp: Date.now() - 3600000 // 1 hour ago
    }
  };

  // Mock function to refresh provider data
  const refreshProviderData = async (providerId: string): Promise<void> => {
    console.log(`Refreshing data for provider: ${providerId}`);
    // In a real app, this would make API calls to sync the data
    return;
  };

  // Use the health metrics hook
  const healthMetrics = useHealthMetrics(fitnessData);

  // Use the activity data hook
  const activityData = useActivityData(fitnessData);

  // Use the data sync hook
  const { handleSyncAllData, hasConnectedApps } = useDataSync(fitnessProviders, refreshProviderData);

  // Use the appointment handlers hook
  const { handleConfirmAppointment, handleRescheduleAppointment } = useAppointmentHandlers();

  // Mock data for upcoming appointments
  const upcomingAppointments: Appointment[] = [
    {
      id: '1',
      date: 'June 20, 2023',
      time: '10:30 AM',
      doctorName: 'Dr. Nikolas Pascal',
      type: 'Follow-up',
      patientId: '101',
      patientName: 'John Doe',
      status: 'scheduled'
    },
    {
      id: '2',
      date: 'July 5, 2023',
      time: '02:00 PM',
      doctorName: 'Dr. Nikolas Pascal',
      type: 'Physical Therapy',
      patientId: '101',
      patientName: 'John Doe',
      status: 'scheduled'
    }
  ];

  // Mock data for biological and chronological age
  const biologicalAge = 32;
  const chronologicalAge = 35;
  
  // Include treatment tasks from mock data
  const treatmentTasks = mockTreatmentTasks;

  return {
    healthMetrics,
    upcomingAppointments,
    biologicalAge,
    chronologicalAge,
    activityData,
    treatmentTasks,
    handleSyncAllData,
    hasConnectedApps,
    handleConfirmAppointment,
    handleRescheduleAppointment
  };
};

export type { ActivityData } from './useActivityData';
export default usePatientDashboard;
