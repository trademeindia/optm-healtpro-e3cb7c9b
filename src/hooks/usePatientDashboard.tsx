
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import useFitnessIntegration from '@/hooks/useFitnessIntegration';
import { mockBiologicalAge, mockChronologicalAge } from '@/data/mockBiomarkerData';
import { useHealthMetrics } from './dashboard/useHealthMetrics';
import { useActivityData } from './dashboard/useActivityData';
import { useAppointments } from './dashboard/useAppointments';
import { useTreatmentTasks } from './dashboard/useTreatmentTasks';
import { getConnectionStatus } from '@/integrations/supabase/client';

export const usePatientDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dataLoadAttempts, setDataLoadAttempts] = useState(0);

  // Add missing properties to the fitness integration hook if needed
  const { 
    providers, 
    fitnessData, 
    refreshProviderData,
    isLoading: fitnessLoading = false,
    error: fitnessError = null
  } = useFitnessIntegration();

  const healthMetrics = useHealthMetrics(fitnessData);
  const activityData = useActivityData(fitnessData);
  const treatmentTasks = useTreatmentTasks();
  
  // Add missing properties to the appointments hook if needed
  const { 
    upcomingAppointments, 
    handleConfirmAppointment, 
    handleRescheduleAppointment,
    isLoading: appointmentsLoading = false,
    error: appointmentsError = null 
  } = useAppointments();

  // Combine loading states and errors
  useEffect(() => {
    const loadingComplete = !fitnessLoading && !appointmentsLoading;
    
    if (loadingComplete) {
      // Delay setting isLoading to false to ensure all UI elements are ready
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
    
    // Combine any errors
    if (fitnessError) {
      setError(fitnessError);
    } else if (appointmentsError) {
      setError(appointmentsError);
    }
  }, [fitnessLoading, appointmentsLoading, fitnessError, appointmentsError]);

  // Check Supabase connection and reset errors if it comes back online
  useEffect(() => {
    // Connection status check
    const { isConnected } = getConnectionStatus();
    
    // If connected and we have an error, maybe we can try again
    if (isConnected && error && dataLoadAttempts < 2) {
      console.log('Supabase connection established, retrying data load');
      setDataLoadAttempts(prev => prev + 1);
      setError(null);
      setIsLoading(true);
    }
    
    const interval = setInterval(() => {
      const { isConnected: nowConnected } = getConnectionStatus();
      if (nowConnected && error && dataLoadAttempts < 2) {
        console.log('Supabase connection re-established, retrying data load');
        setDataLoadAttempts(prev => prev + 1);
        setError(null);
        setIsLoading(true);
      }
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, [error, dataLoadAttempts]);

  // Handle syncing data from connected health apps
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

    try {
      for (const provider of connectedProviders) {
        await refreshProviderData(provider.id);
      }

      toast.success("Sync complete", {
        description: "Your health data has been updated.",
        duration: 3000
      });
    } catch (syncError) {
      console.error('Error syncing health data:', syncError);
      toast.error("Sync failed", {
        description: "There was a problem syncing your health data. Please try again.",
        duration: 4000
      });
    }
  };

  const hasConnectedApps = providers.some(p => p.isConnected);

  return {
    activityData,
    treatmentTasks,
    upcomingAppointments,
    healthMetrics,
    hasConnectedApps,
    biologicalAge: mockBiologicalAge,
    chronologicalAge: mockChronologicalAge,
    isLoading,
    error,
    handleConfirmAppointment,
    handleRescheduleAppointment,
    handleSyncAllData
  };
};

export default usePatientDashboard;
