
import { useCallback, useRef, useState } from 'react';

export function useCalendarRefresh(refreshCalendar: () => Promise<void>) {
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const refreshCountRef = useRef(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debounced refresh function to prevent multiple refreshes
  const debouncedRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    // Track refresh count
    refreshCountRef.current += 1;
    const currentRefreshCount = refreshCountRef.current;
    
    refreshTimeoutRef.current = setTimeout(() => {
      console.log(`Executing debounced calendar refresh #${currentRefreshCount}`);
      setIsRefreshing(true);
      
      refreshCalendar()
        .then(() => {
          // Ensure a complete refresh cycle by dispatching the event again
          window.dispatchEvent(new Event('calendar-data-updated'));
        })
        .finally(() => {
          setIsRefreshing(false);
        });
    }, 800);
  }, [refreshCalendar]);

  // Function for manual refresh with toast notification
  const handleManualRefresh = useCallback(async () => {
    try {
      console.log("Manually refreshing calendar data...");
      setIsRefreshing(true);
      
      // First refresh
      await refreshCalendar();
      
      // Dispatch a calendar-updated event to ensure all components refresh
      window.dispatchEvent(new Event('calendar-updated'));
      
      // Second refresh after a delay to ensure everything is updated
      setTimeout(async () => {
        await refreshCalendar();
        window.dispatchEvent(new Event('calendar-data-updated'));
      }, 800);
      
      return true;
    } catch (error) {
      console.error("Error refreshing calendar:", error);
      return false;
    } finally {
      setIsRefreshing(false);
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
    cleanupRefresh,
    isRefreshing
  };
}
