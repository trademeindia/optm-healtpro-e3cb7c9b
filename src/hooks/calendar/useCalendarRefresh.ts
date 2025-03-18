
import { useCallback, useRef, useEffect } from 'react';

export function useCalendarRefresh(refreshCalendar: () => void) {
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const refreshInProgressRef = useRef(false);
  const lastRefreshTimeRef = useRef(0);
  
  const DEBOUNCE_TIME = 800;
  const MIN_REFRESH_INTERVAL = 5000; // Increased to 5 seconds to prevent frequent refreshes

  // Cleanup function to clear any pending timeouts
  const cleanupRefresh = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
  }, []);

  // Debounced refresh function with better throttling
  const debouncedRefresh = useCallback(() => {
    // Skip if currently refreshing
    if (refreshInProgressRef.current) {
      console.log("Refresh already in progress, skipping");
      return;
    }
    
    // Debounce rapid calls
    cleanupRefresh();
    
    // Check if enough time has passed since last refresh
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshTimeRef.current;
    
    if (timeSinceLastRefresh < MIN_REFRESH_INTERVAL) {
      console.log(`Skipping refresh, only ${timeSinceLastRefresh}ms since last refresh`);
      return;
    }
    
    console.log("Scheduling debounced calendar refresh");
    debounceTimeoutRef.current = setTimeout(() => {
      refreshInProgressRef.current = true;
      lastRefreshTimeRef.current = Date.now();
      
      try {
        // Perform the refresh
        refreshCalendar();
      } catch (error) {
        console.error("Error during refresh:", error);
      } finally {
        // Reset flag after a delay to prevent rapid refreshes
        setTimeout(() => {
          refreshInProgressRef.current = false;
        }, 1000);
      }
    }, DEBOUNCE_TIME);
  }, [refreshCalendar, cleanupRefresh]);

  // Manual refresh function with better throttling
  const handleManualRefresh = useCallback(async () => {
    try {
      // Skip if currently refreshing
      if (refreshInProgressRef.current) {
        console.log("Refresh already in progress, skipping manual refresh");
        return false;
      }
      
      // Check if enough time has passed
      const now = Date.now();
      const timeSinceLastRefresh = now - lastRefreshTimeRef.current;
      if (timeSinceLastRefresh < MIN_REFRESH_INTERVAL) {
        console.log(`Manual refresh skipped, only ${timeSinceLastRefresh}ms since last refresh`);
        return false;
      }
      
      // Always allow manual refreshes
      cleanupRefresh();
      refreshInProgressRef.current = true;
      lastRefreshTimeRef.current = Date.now();
      
      // Perform the refresh
      refreshCalendar();
      
      // Reset flag after a delay
      setTimeout(() => {
        refreshInProgressRef.current = false;
      }, 1000);
      
      return true;
    } catch (error) {
      console.error("Error during manual refresh:", error);
      refreshInProgressRef.current = false;
      return false;
    }
  }, [refreshCalendar, cleanupRefresh]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      cleanupRefresh();
      refreshInProgressRef.current = false;
    };
  }, [cleanupRefresh]);

  return {
    debouncedRefresh,
    handleManualRefresh,
    cleanupRefresh
  };
}
