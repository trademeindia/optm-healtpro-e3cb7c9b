
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { FitnessData } from '@/hooks/useFitnessIntegration';
import { 
  googleFitService, 
  GoogleFitDataPoint, 
  HistoricalDataRequest 
} from '@/services/integrations/googleFitService';

export const useGoogleFitData = () => {
  const [healthData, setHealthData] = useState<FitnessData>({});
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const syncGoogleFitData = useCallback(async (): Promise<FitnessData> => {
    setIsLoading(true);
    
    try {
      const result = await googleFitService.syncHealthData();
      
      if (result.success) {
        setHealthData(result.data);
        setLastSyncTime(result.timestamp);
        
        toast.success("Health data synced", {
          description: "Your Google Fit data has been updated",
          duration: 3000
        });
        
        return result.data;
      } else {
        toast.error("Failed to sync health data", {
          description: result.message,
          duration: 3000
        });
        return {};
      }
    } catch (error) {
      console.error("Error syncing Google Fit data:", error);
      toast.error("Error syncing health data", {
        description: "Please try again later",
        duration: 3000
      });
      return {};
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getHistoricalData = useCallback(async (query: HistoricalDataRequest): Promise<GoogleFitDataPoint[]> => {
    setIsLoading(true);
    
    try {
      const data = await googleFitService.getHistoricalData(query);
      return data;
    } catch (error) {
      console.error("Error fetching historical data:", error);
      toast.error("Failed to fetch historical data", {
        duration: 3000
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetHealthData = useCallback(() => {
    setHealthData({});
    setLastSyncTime(null);
  }, []);

  return {
    healthData,
    lastSyncTime,
    isLoading,
    syncGoogleFitData,
    getHistoricalData,
    resetHealthData,
    setIsLoading
  };
};
