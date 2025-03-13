
import { useCallback, useRef } from 'react';

export function useCalendarRefresh(refreshCalendar: () => Promise<void>) {
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);
  const lastRefreshTimeRef = useRef<number>(0);
  
  // Improved debounce function with a flag to prevent multiple concurrent refreshes
  // and a cooldown period to prevent too many refreshes in quick succession
  const debouncedRefresh = useCallback(() => {
    // Only process if we're not in the refresh cooldown period
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshTimeRef.current;
    
    if (timeSinceLastRefresh < 2000) {
      console.log(`Skipping refresh, only ${timeSinceLastRefresh}ms since last refresh`);
      return;
    }
    
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
      lastRefreshTimeRef.current = Date.now();
      
      try {
        await refreshCalendar();
      } catch (error) {
        console.error("Error during calendar refresh:", error);
      } finally {
        isRefreshingRef.current = false;
      }
    }, 1500); // Increased debounce time to reduce flickering
  }, [refreshCalendar]);

  // Function for manual refresh with toast notification
  const handleManualRefresh = useCallback(async () => {
    try {
      // Skip if already refreshing
      if (isRefreshingRef.current) {
        console.log("Refresh already in progress, skipping manual refresh");
        return true;
      }
      
      // Skip if we're in the cooldown period
      const now = Date.now();
      const timeSinceLastRefresh = now - lastRefreshTimeRef.current;
      if (timeSinceLastRefresh < 2000) {
        console.log(`Manual refresh skipped, only ${timeSinceLastRefresh}ms since last refresh`);
        return true;
      }
      
      console.log("Manually refreshing calendar data...");
      isRefreshingRef.current = true;
      lastRefreshTimeRef.current = Date.now();
      
      await refreshCalendar();
      
      // Dispatch a single calendar-updated event with a specific delay
      // to prevent multiple rapid refreshes
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('calendar-data-updated', {
          detail: { action: 'manual-refresh', timestamp: new Date().toISOString() }
        }));
      }, 500);
      
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
