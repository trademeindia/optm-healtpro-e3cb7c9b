
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { FitnessData } from './useFitnessIntegration';
import { googleFitService, GoogleFitDataPoint } from '@/services/integrations/googleFitService';

export interface HistoricalDataQuery {
  dataType: string;
  startDate: Date;
  endDate: Date;
}

export interface GoogleFitIntegrationReturn {
  isConnected: boolean;
  isLoading: boolean;
  connectGoogleFit: () => void;
  disconnectGoogleFit: () => Promise<boolean>;
  syncGoogleFitData: () => Promise<FitnessData>;
  lastSyncTime: string | null;
  healthData: FitnessData;
  getHistoricalData: (query: HistoricalDataQuery) => Promise<GoogleFitDataPoint[]>;
}

export const useGoogleFitIntegration = (): GoogleFitIntegrationReturn => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [healthData, setHealthData] = useState<FitnessData>({});
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Initialize integration status on component mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = useCallback(() => {
    try {
      const connected = googleFitService.isAuthenticated();
      setIsConnected(connected);
      
      if (connected) {
        // If connected, sync data automatically
        syncGoogleFitData();
      }
    } catch (error) {
      console.error("Error checking Google Fit connection:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connectGoogleFit = useCallback(() => {
    setIsLoading(true);
    
    try {
      googleFitService.initiateAuth();
      
      // Check connection status after a delay to allow auth flow to complete
      setTimeout(() => {
        const connected = googleFitService.isAuthenticated();
        setIsConnected(connected);
        
        if (connected) {
          syncGoogleFitData();
        } else {
          setIsLoading(false);
        }
      }, 2500);
    } catch (error) {
      console.error("Error connecting to Google Fit:", error);
      toast.error("Failed to connect to Google Fit", {
        description: "Please try again or check your network connection",
        duration: 5000
      });
      setIsLoading(false);
    }
  }, []);

  const disconnectGoogleFit = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const success = await googleFitService.disconnect();
      
      if (success) {
        setIsConnected(false);
        setHealthData({});
        setLastSyncTime(null);
        
        toast.success("Disconnected from Google Fit", {
          duration: 3000
        });
      } else {
        toast.error("Failed to disconnect from Google Fit", {
          duration: 3000
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error disconnecting from Google Fit:", error);
      toast.error("Error disconnecting from Google Fit", {
        description: "Please try again",
        duration: 3000
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  const getHistoricalData = useCallback(async (query: HistoricalDataQuery): Promise<GoogleFitDataPoint[]> => {
    setIsLoading(true);
    
    try {
      const data = await googleFitService.getHistoricalData(
        query.dataType,
        query.startDate,
        query.endDate
      );
      
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

  return {
    isConnected,
    isLoading,
    connectGoogleFit,
    disconnectGoogleFit,
    syncGoogleFitData,
    lastSyncTime,
    healthData,
    getHistoricalData
  };
};
