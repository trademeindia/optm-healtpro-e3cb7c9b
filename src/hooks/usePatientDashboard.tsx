
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import useFitnessIntegration from '@/hooks/useFitnessIntegration';
import { mockBiologicalAge, mockChronologicalAge } from '@/data/mockBiomarkerData';
import { useHealthMetrics } from './dashboard/useHealthMetrics';
import { useActivityData } from './dashboard/useActivityData';
import { useAppointments } from './dashboard/useAppointments';
import { useTreatmentTasks } from './dashboard/useTreatmentTasks';

export const usePatientDashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastRefreshTimeRef = useRef(0);
  const MIN_REFRESH_INTERVAL = 5000; // Minimum 5 seconds between refreshes
  
  const { 
    providers, 
    fitnessData, 
    refreshProviderData 
  } = useFitnessIntegration();

  const healthMetrics = useHealthMetrics(fitnessData);
  const activityData = useActivityData(fitnessData);
  const treatmentTasks = useTreatmentTasks();
  const { 
    upcomingAppointments, 
    handleConfirmAppointment, 
    handleRescheduleAppointment 
  } = useAppointments();

  // Throttled sync function to prevent excessive API calls
  const handleSyncAllData = useCallback(async () => {
    // Check if already refreshing
    if (isRefreshing) {
      toast.info("Sync already in progress", {
        description: "Please wait for the current sync to complete.",
        duration: 2000
      });
      return;
    }
    
    // Check if minimum time has passed since last refresh
    const now = Date.now();
    if (now - lastRefreshTimeRef.current < MIN_REFRESH_INTERVAL) {
      console.log(`Skipping sync, only ${now - lastRefreshTimeRef.current}ms since last sync`);
      toast.info("Please wait before syncing again", {
        duration: 2000
      });
      return;
    }
    
    const connectedProviders = providers.filter(p => p.isConnected);
    if (connectedProviders.length === 0) {
      toast.error("No connected apps", {
        description: "Please connect a health app to sync data.",
        duration: 4000
      });
      return;
    }

    try {
      setIsRefreshing(true);
      lastRefreshTimeRef.current = now;
      
      toast.info("Syncing data", {
        description: "Syncing data from all connected health apps...",
        duration: 3000
      });

      // Process providers sequentially to avoid overwhelming the system
      for (const provider of connectedProviders) {
        await refreshProviderData(provider.id);
        // Add a small delay between provider requests
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      toast.success("Sync complete", {
        description: "Your health data has been updated.",
        duration: 3000
      });
    } catch (error) {
      console.error("Error syncing data:", error);
      toast.error("Sync failed", {
        description: "There was an error syncing your health data. Please try again.",
        duration: 4000
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [providers, refreshProviderData, isRefreshing]);

  const hasConnectedApps = providers.some(p => p.isConnected);

  return {
    activityData,
    treatmentTasks,
    upcomingAppointments,
    healthMetrics,
    hasConnectedApps,
    biologicalAge: mockBiologicalAge,
    chronologicalAge: mockChronologicalAge,
    handleConfirmAppointment,
    handleRescheduleAppointment,
    handleSyncAllData,
    isRefreshing
  };
};

export default usePatientDashboard;
