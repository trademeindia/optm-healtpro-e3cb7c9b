
import { FitnessData } from '@/hooks/useFitnessIntegration';
import useFitnessIntegration from '@/hooks/useFitnessIntegration';
import { getHeartRate, getBloodPressure, getTemperature, getOxygen } from './useHealthMetrics';
import { activityData, treatmentTasks, upcomingAppointments } from './mockData';
import { useAppointments } from './useAppointments';
import { useHealthSync } from './useHealthSync';

export const usePatientDashboard = () => {
  const { 
    providers, 
    fitnessData, 
    refreshProviderData 
  } = useFitnessIntegration();
  
  const { handleConfirmAppointment, handleRescheduleAppointment } = useAppointments();
  const { handleSyncAllData } = useHealthSync(providers, refreshProviderData);

  const getSteps = (fitnessData: FitnessData) => {
    return fitnessData.steps ? {
      data: activityData,
      currentValue: Number(fitnessData.steps.value),
      source: fitnessData.steps.source,
      lastSync: new Date(fitnessData.steps.timestamp).toLocaleTimeString()
    } : { data: activityData, currentValue: 8152 };
  };

  // Get processed health metrics
  const healthMetrics = {
    heartRate: getHeartRate(fitnessData),
    bloodPressure: getBloodPressure(fitnessData),
    temperature: getTemperature(fitnessData),
    oxygen: getOxygen(fitnessData)
  };
  
  const steps = getSteps(fitnessData);
  const hasConnectedApps = providers.some(p => p.isConnected);

  return {
    activityData: steps,
    treatmentTasks,
    upcomingAppointments,
    healthMetrics,
    hasConnectedApps,
    handleConfirmAppointment,
    handleRescheduleAppointment,
    handleSyncAllData
  };
};

export default usePatientDashboard;
