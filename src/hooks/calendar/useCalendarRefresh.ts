
import { useCallback, useRef, useEffect } from 'react';

export function useCalendarRefresh(refreshCalendar: () => void) {
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const refreshInProgressRef = useRef(false);
  const lastRefreshTimeRef = useRef(0);
  const refreshRequestCountRef = useRef(0);
  
  const DEBOUNCE_TIME = 1000; // Increased to 1 second
  const MIN_REFRESH_INTERVAL = 8000; // Increased to 8 seconds to prevent frequent refreshes
  const MAX_QUEUED_REFRESHES = 3; // Maximum number of refresh requests to queue

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
      console.log("Refresh already in progress, queueing request");
      
      // Increment counter but cap at maximum
      refreshRequestCountRef.current = Math.min(
        refreshRequestCountRef.current + 1, 
        MAX_QUEUED_REFRESHES
      );
      return;
    }
    
    // Debounce rapid calls
    cleanupRefresh();
    
    // Check if enough time has passed since last refresh
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshTimeRef.current;
    
    if (timeSinceLastRefresh < MIN_REFRESH_INTERVAL) {
      console.log(`Throttling refresh, only ${timeSinceLastRefresh}ms since last refresh`);
      
      // Queue a refresh to happen after the minimum interval
      if (!debounceTimeoutRef.current) {
        const delayNeeded = MIN_REFRESH_INTERVAL - timeSinceLastRefresh;
        console.log(`Scheduling delayed refresh in ${delayNeeded}ms`);
        
        debounceTimeoutRef.current = setTimeout(() => {
          console.log("Executing delayed calendar refresh");
          executeRefresh();
        }, delayNeeded);
      }
      return;
    }
    
    console.log("Scheduling debounced calendar refresh");
    debounceTimeoutRef.current = setTimeout(() => {
      executeRefresh();
    }, DEBOUNCE_TIME);
  }, [cleanupRefresh]);
  
  // Actual refresh execution logic
  const executeRefresh = useCallback(() => {
    refreshInProgressRef.current = true;
    lastRefreshTimeRef.current = Date.now();
    debounceTimeoutRef.current = null;
    
    try {
      // Perform the refresh
      console.log("Executing calendar refresh");
      refreshCalendar();
      refreshRequestCountRef.current = 0; // Reset counter after successful refresh
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      // Reset flag after a delay to prevent rapid refreshes
      setTimeout(() => {
        refreshInProgressRef.current = false;
        
        // Check if there are queued refresh requests
        if (refreshRequestCountRef.current > 0) {
          console.log(`Processing queued refresh request (${refreshRequestCountRef.current} in queue)`);
          refreshRequestCountRef.current--;
          debouncedRefresh();
        }
      }, 1000);
    }
  }, [refreshCalendar]);

  // Manual refresh function with improved throttling
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
        console.log(`Manual refresh throttled, only ${timeSinceLastRefresh}ms since last refresh`);
        return false;
      }
      
      // Always allow manual refreshes
      cleanupRefresh();
      refreshInProgressRef.current = true;
      lastRefreshTimeRef.current = now;
      
      // Perform the refresh
      console.log("Executing manual calendar refresh");
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
