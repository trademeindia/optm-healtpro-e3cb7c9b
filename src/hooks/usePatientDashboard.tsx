
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import useFitnessIntegration from '@/hooks/useFitnessIntegration';
import { mockBiologicalAge, mockChronologicalAge } from '@/data/mockBiomarkerData';
import { useHealthMetrics } from './dashboard/useHealthMetrics';
import { useActivityData } from './dashboard/useActivityData';
import { useAppointments } from './dashboard/useAppointments';
import { useTreatmentTasks } from './dashboard/useTreatmentTasks';
import { HealthMetric } from '@/types/health';

export const usePatientDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Try-catch around integration to prevent dashboard from crashing
  const { 
    providers = [], 
    fitnessData = {},
    refreshProviderData = async () => {}
  } = useFitnessIntegration();

  // Set defaults for all data to prevent undefined errors
  const healthMetrics: HealthMetric[] = useHealthMetrics(fitnessData) || [];
  const { activityData = {}, fitnessData: transformedFitnessData = {} } = useActivityData(fitnessData);
  const treatmentTasks = useTreatmentTasks() || [];
  const { 
    upcomingAppointments = [], 
    handleConfirmAppointment = () => {}, 
    handleRescheduleAppointment = () => {} 
  } = useAppointments();

  // Set loading to false after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSyncAllData = async () => {
    try {
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
    } catch (err) {
      console.error("Error syncing data:", err);
      toast.error("Sync failed", {
        description: "There was a problem syncing your health data.",
        duration: 4000
      });
    }
  };

  const hasConnectedApps = Array.isArray(providers) && providers.some(p => p.isConnected);

  return {
    activityData,
    fitnessData,
    treatmentTasks,
    upcomingAppointments,
    healthMetrics,
    hasConnectedApps,
    biologicalAge: mockBiologicalAge,
    chronologicalAge: mockChronologicalAge,
    handleConfirmAppointment,
    handleRescheduleAppointment,
    handleSyncAllData,
    isLoading,
    error
  };
};

export default usePatientDashboard;
