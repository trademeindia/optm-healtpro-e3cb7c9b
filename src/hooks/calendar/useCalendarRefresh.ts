
import { useCallback, useRef } from 'react';

export function useCalendarRefresh(refreshCalendar: () => Promise<void>) {
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  // Improved debounce function with a flag to prevent multiple concurrent refreshes
  const debouncedRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    // Skip if already refreshing
    if (isRefreshingRef.current) {
      console.log("Refresh already in progress, skipping");
      return;
    }
    
    refreshTimeoutRef.current = setTimeout(async () => {
      console.log("Executing debounced calendar refresh");
      isRefreshingRef.current = true;
      try {
        await refreshCalendar();
      } finally {
        isRefreshingRef.current = false;
      }
    }, 1200);
  }, [refreshCalendar]);

  // Function for manual refresh with toast notification
  const handleManualRefresh = useCallback(async () => {
    try {
      // Skip if already refreshing
      if (isRefreshingRef.current) {
        console.log("Refresh already in progress, skipping manual refresh");
        return true;
      }
      
      console.log("Manually refreshing calendar data...");
      isRefreshingRef.current = true;
      await refreshCalendar();
      
      // Dispatch a single calendar-updated event
      window.dispatchEvent(new CustomEvent('calendar-data-updated', {
        detail: { action: 'manual-refresh', timestamp: new Date().toISOString() }
      }));
      
      return true;
    } catch (error) {
      console.error("Error refreshing calendar:", error);
      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }, [refreshCalendar]);

  // Cleanup function
  const cleanupRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
  }, []);

  return {
    debouncedRefresh,
    handleManualRefresh,
    cleanupRefresh
  };
}
