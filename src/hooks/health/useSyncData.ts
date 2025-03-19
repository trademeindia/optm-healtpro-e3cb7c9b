
import { useState, useCallback } from 'react';
import { SyncOptions } from '@/services/health/types';
import { healthDataService } from '@/services/health/metricsService';

export const useSyncData = (userId: string | undefined) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<Error | null>(null);

  const syncData = useCallback(async (
    options: SyncOptions = {}
  ): Promise<boolean> => {
    if (!userId) return false;
    
    const { forceRefresh = false } = options;
    
    // Skip if already syncing
    if (isSyncing) return false;
    
    setIsSyncing(true);
    setSyncError(null);
    
    try {
      // In a real app, this would make API calls to fetch updated health data
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update last sync time
      const newSyncTime = new Date();
      setLastSyncTime(newSyncTime);
      
      return true;
    } catch (error) {
      console.error('Error syncing health data:', error);
      setSyncError(error instanceof Error ? error : new Error('Unknown error during sync'));
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [userId, isSyncing]);

  return {
    isSyncing,
    lastSyncTime,
    syncError,
    syncData
  };
};
