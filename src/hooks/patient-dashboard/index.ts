
import { useHealthMetrics } from './useHealthMetrics';
import { useActivityData } from './useActivityData';
import { useAppointmentHandlers } from './useAppointmentHandlers';
import { useDataSync } from './useDataSync';
import useFitnessIntegration from '@/hooks/useFitnessIntegration';
import { mockTreatmentTasks, mockAppointments } from './mockData';
import { mockBiologicalAge, mockChronologicalAge } from '@/data/mockBiomarkerData';

export const usePatientDashboard = () => {
  const { 
    providers, 
    fitnessData, 
    refreshProviderData 
  } = useFitnessIntegration();

  // Get health metrics
  const healthMetrics = useHealthMetrics(fitnessData);
  
  // Get activity data
  const activityData = useActivityData(fitnessData);
  
  // Get appointment handlers
  const { 
    handleConfirmAppointment, 
    handleRescheduleAppointment 
  } = useAppointmentHandlers();
  
  // Get data sync functionality
  const { 
    handleSyncAllData, 
    hasConnectedApps 
  } = useDataSync(providers, refreshProviderData);

  return {
    activityData,
    treatmentTasks: mockTreatmentTasks,
    upcomingAppointments: mockAppointments,
    healthMetrics,
    biologicalAge: mockBiologicalAge,
    chronologicalAge: mockChronologicalAge,
    hasConnectedApps,
    handleConfirmAppointment,
    handleRescheduleAppointment,
    handleSyncAllData
  };
};

export default usePatientDashboard;
