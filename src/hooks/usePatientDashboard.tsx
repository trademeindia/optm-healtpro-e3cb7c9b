
import { toast } from 'sonner';
import useFitnessIntegration from '@/hooks/useFitnessIntegration';
import { mockBiologicalAge, mockChronologicalAge } from '@/data/mockBiomarkerData';
import { useHealthMetrics } from './dashboard/useHealthMetrics';
import { useActivityData } from './dashboard/useActivityData';
import { useAppointments } from './dashboard/useAppointments';
import { useTreatmentTasks } from './dashboard/useTreatmentTasks';
import { HealthMetric } from '@/types/health';

export const usePatientDashboard = () => {
  const { 
    providers, 
    fitnessData,
    refreshProviderData 
  } = useFitnessIntegration();

  const healthMetrics: HealthMetric[] = useHealthMetrics(fitnessData);
  const { activityData, fitnessData: transformedFitnessData } = useActivityData(fitnessData);
  const treatmentTasks = useTreatmentTasks();
  const { 
    upcomingAppointments, 
    handleConfirmAppointment, 
    handleRescheduleAppointment 
  } = useAppointments();

  const handleSyncAllData = async () => {
    const connectedProviders = providers.filter(p => p.isConnected);
    if (connectedProviders.length === 0) {
      toast.error("No connected apps", {
        description: "Please connect a health app to sync data.",
        duration: 4000
      });
      return;
    }

    toast.info("Syncing data", {
      description: "Syncing data from all connected health apps...",
      duration: 3000
    });

    for (const provider of connectedProviders) {
      await refreshProviderData(provider.id);
    }

    toast.success("Sync complete", {
      description: "Your health data has been updated.",
      duration: 3000
    });
  };

  const hasConnectedApps = providers.some(p => p.isConnected);

  return {
    activityData,
    fitnessData, // Now we're returning the original fitnessData
    treatmentTasks,
    upcomingAppointments,
    healthMetrics,
    hasConnectedApps,
    biologicalAge: mockBiologicalAge,
    chronologicalAge: mockChronologicalAge,
    handleConfirmAppointment,
    handleRescheduleAppointment,
    handleSyncAllData
  };
};

export default usePatientDashboard;
