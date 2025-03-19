
import { useState, useCallback } from 'react';
import { healthDataService } from '@/services/health';

export const useSyncData = (userId: string | undefined) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const syncData = useCallback(async (forceRefresh: boolean = false): Promise<boolean> => {
    if (!userId) return false;
    
    setIsSyncing(true);
    
    try {
      const success = await healthDataService.syncAllHealthData(userId, {
        forceRefresh
      });
      
      if (success) {
        setLastSyncTime(new Date());
      }
      
      return success;
    } catch (error) {
      console.error('Error syncing health data:', error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [userId]);

  return {
    isSyncing,
    lastSyncTime,
    syncData
  };
};
