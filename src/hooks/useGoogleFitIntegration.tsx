
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { FitnessData } from './fitness';
import { googleFitService, GoogleFitDataPoint, GoogleFitSyncResult } from '@/services/integrations/googleFitService';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();

  useEffect(() => {
    checkConnectionStatus();
    
    // Set up automatic refresh interval (every 15 minutes)
    const refreshInterval = setInterval(() => {
      if (isConnected) {
        syncGoogleFitData();
      }
    }, 15 * 60 * 1000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  const checkConnectionStatus = useCallback(() => {
    try {
      const connected = googleFitService.isAuthenticated();
      setIsConnected(connected);
      
      if (connected) {
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
      // Log the current user for debug purposes
      if (user) {
        console.log(`Connecting Google Fit for user: ${user.email}`);
      }
      
      googleFitService.initiateAuth();
      
      setTimeout(() => {
        const connected = googleFitService.isAuthenticated();
        setIsConnected(connected);
        
        if (connected) {
          syncGoogleFitData();
          
          // Store user-specific connection info
          if (user) {
            localStorage.setItem(`googleFit_connected_${user.id}`, 'true');
          }
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
  }, [user]);

  const disconnectGoogleFit = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const success = await googleFitService.disconnect();
      
      if (success) {
        setIsConnected(false);
        setHealthData({});
        setLastSyncTime(null);
        
        // Remove user-specific connection info
        if (user) {
          localStorage.removeItem(`googleFit_connected_${user.id}`);
        }
        
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
  }, [user]);

  const syncGoogleFitData = useCallback(async (): Promise<FitnessData> => {
    setIsLoading(true);
    
    try {
      // Log sync attempt with user context
      if (user) {
        console.log(`Syncing Google Fit data for user: ${user.email}`);
      }
      
      const result = await googleFitService.syncHealthData();
      
      if (result.success) {
        setHealthData(result.data);
        setLastSyncTime(result.timestamp);
        
        // Save last sync time for this user
        if (user) {
          localStorage.setItem(`googleFit_lastSync_${user.id}`, result.timestamp);
        }
        
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
  }, [user]);

  const getHistoricalData = useCallback(async (query: HistoricalDataQuery): Promise<GoogleFitDataPoint[]> => {
    setIsLoading(true);
    
    try {
      // Include user context in historical data query
      if (user) {
        console.log(`Getting historical ${query.dataType} data for user: ${user.email}`);
      }
      
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
  }, [user]);

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
