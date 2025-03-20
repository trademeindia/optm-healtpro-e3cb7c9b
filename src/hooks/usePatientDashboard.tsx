
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import useFitnessIntegration from '@/hooks/useFitnessIntegration';
import { mockBiologicalAge, mockChronologicalAge } from '@/data/mockBiomarkerData';
import { useHealthMetrics } from './dashboard/useHealthMetrics';
import { useActivityData } from './dashboard/useActivityData';
import { useAppointments } from './dashboard/useAppointments';
import { useTreatmentTasks } from './dashboard/useTreatmentTasks';
import { HealthMetric } from '@/types/health';
import { FitnessData } from '@/hooks/useFitnessIntegration';

// Define a default FitnessData object to use as fallback
const defaultFitnessData: FitnessData = {
  steps: {
    data: [],
    summary: { total: 0, average: 0 }
  },
  heartRate: {
    data: [],
    summary: { average: 0, min: 0, max: 0 }
  },
  calories: {
    data: [],
    summary: { total: 0, average: 0 }
  }
};

export const usePatientDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dataInitialized, setDataInitialized] = useState(false);

  // Try-catch around integration to prevent dashboard from crashing
  const { 
    providers = [], 
    fitnessData = defaultFitnessData,
    refreshProviderData = async () => {}
  } = useFitnessIntegration();

  // Memoize data processing to avoid redundant calculations
  const healthMetrics = useHealthMetrics(fitnessData) || [];
  const { 
    activityData = {}, 
    fitnessData: transformedFitnessData = defaultFitnessData 
  } = useActivityData(fitnessData);
  const treatmentTasks = useTreatmentTasks() || [];
  const { 
    upcomingAppointments = [], 
    handleConfirmAppointment = () => {}, 
    handleRescheduleAppointment = () => {} 
  } = useAppointments();

  // Initialize data with a more reliable approach
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Set a shorter timeout to avoid long loading screens
        setTimeout(() => {
          if (!dataInitialized) {
            setDataInitialized(true);
            setIsLoading(false);
          }
        }, 800);
      } catch (err) {
        console.error("Dashboard initialization error:", err);
        setError(err instanceof Error ? err : new Error('Unknown error during initialization'));
        setIsLoading(false);
      }
    };

    initializeData();
  }, [dataInitialized]);

  // Create a memoized sync function to prevent unnecessary re-renders
  const handleSyncAllData = useCallback(async () => {
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

      // Use Promise.all for concurrent requests
      await Promise.all(
        connectedProviders.map(provider => refreshProviderData(provider.id))
      );

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
  }, [providers, refreshProviderData]);

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
