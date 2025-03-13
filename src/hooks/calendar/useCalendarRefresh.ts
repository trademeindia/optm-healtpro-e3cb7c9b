
import { useCallback, useRef } from 'react';

export function useCalendarRefresh(refreshCalendar: () => Promise<void>) {
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced refresh function to prevent multiple refreshes
  const debouncedRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    refreshTimeoutRef.current = setTimeout(() => {
      console.log("Executing debounced calendar refresh");
      refreshCalendar();
    }, 1200);
  }, [refreshCalendar]);

  // Function for manual refresh with toast notification
  const handleManualRefresh = useCallback(async () => {
    try {
      console.log("Manually refreshing calendar data...");
      await refreshCalendar();
      
      // Dispatch a calendar-updated event to ensure all components refresh
      window.dispatchEvent(new Event('calendar-updated'));
      return true;
    } catch (error) {
      console.error("Error refreshing calendar:", error);
      return false;
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
