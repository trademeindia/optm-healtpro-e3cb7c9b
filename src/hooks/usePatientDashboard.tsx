
import { useToast } from '@/hooks/use-toast';
import useFitnessIntegration from '@/hooks/useFitnessIntegration';
import { mockBiologicalAge, mockChronologicalAge } from '@/data/mockBiomarkerData';
import { mockActivityData } from '@/data/mockActivityData';
import { mockTreatmentTasks } from '@/data/mockTreatmentTasks';
import { mockAppointments } from '@/data/mockAppointments';
import { processHealthMetrics } from '@/utils/healthMetricsUtils';
import { useAppointmentHandlers, formatAppointments } from '@/utils/appointmentUtils';

export const usePatientDashboard = () => {
  const { toast } = useToast();
  const { 
    providers, 
    fitnessData, 
    refreshProviderData 
  } = useFitnessIntegration();
  
  const { handleConfirmAppointment, handleRescheduleAppointment } = useAppointmentHandlers();
  
  // Process health metrics from fitness data
  const { healthMetrics, steps } = processHealthMetrics(fitnessData, mockActivityData);
  
  // Function to handle sync of all health data
  const handleSyncAllData = async () => {
    const connectedProviders = providers.filter(p => p.isConnected);
    if (connectedProviders.length === 0) {
      toast({
        title: "No connected apps",
        description: "Please connect a health app to sync data.",
      });
      return;
    }

    toast({
      title: "Syncing data",
      description: "Syncing data from all connected health apps...",
    });

    // Sync data from all connected providers
    for (const provider of connectedProviders) {
      await refreshProviderData(provider.id);
    }

    toast({
      title: "Sync complete",
      description: "Your health data has been updated.",
    });
  };
  
  const hasConnectedApps = providers.some(p => p.isConnected);
  
  // Format appointments for consistent usage across components
  const formattedAppointments = formatAppointments(mockAppointments);

  return {
    activityData: steps,
    treatmentTasks: mockTreatmentTasks,
    upcomingAppointments: mockAppointments, // Keep original appointments for internal use
    formattedAppointments, // Add formatted appointments for UI components
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
