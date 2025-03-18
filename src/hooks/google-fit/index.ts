
import { useCallback } from 'react';
import { useGoogleFitAuth } from './useGoogleFitAuth';
import { useGoogleFitData } from './useGoogleFitData';
import { FitnessData } from '@/hooks/useFitnessIntegration';
import { GoogleFitDataPoint, HistoricalDataRequest } from '@/services/integrations/googleFitService';

export interface GoogleFitIntegrationReturn {
  isConnected: boolean;
  isLoading: boolean;
  connectGoogleFit: () => void;
  disconnectGoogleFit: () => Promise<boolean>;
  syncGoogleFitData: () => Promise<FitnessData>;
  lastSyncTime: string | null;
  healthData: FitnessData;
  getHistoricalData: (query: HistoricalDataRequest) => Promise<GoogleFitDataPoint[]>;
}

export const useGoogleFitIntegration = (): GoogleFitIntegrationReturn => {
  const { 
    isConnected, 
    isLoading: authLoading, 
    connectGoogleFit, 
    disconnectGoogleFit,
    checkConnectionStatus
  } = useGoogleFitAuth();

  const {
    healthData,
    lastSyncTime,
    isLoading: dataLoading,
    syncGoogleFitData: syncData,
    getHistoricalData,
    resetHealthData
  } = useGoogleFitData();

  // Combined loading state
  const isLoading = authLoading || dataLoading;

  // Enhanced sync that checks connection
  const syncGoogleFitData = useCallback(async (): Promise<FitnessData> => {
    if (!isConnected) {
      return {};
    }
    return await syncData();
  }, [isConnected, syncData]);

  // Enhanced disconnect that also resets data
  const handleDisconnect = useCallback(async (): Promise<boolean> => {
    const success = await disconnectGoogleFit();
    if (success) {
      resetHealthData();
    }
    return success;
  }, [disconnectGoogleFit, resetHealthData]);

  return {
    isConnected,
    isLoading,
    connectGoogleFit,
    disconnectGoogleFit: handleDisconnect,
    syncGoogleFitData,
    lastSyncTime,
    healthData,
    getHistoricalData
  };
};

export * from './useGoogleFitAuth';
export * from './useGoogleFitData';
