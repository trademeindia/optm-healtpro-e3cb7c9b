
import { useCallback } from 'react';
import { useDebounceRefresh } from './refresh/useDebounceRefresh';
import { useManualRefresh } from './refresh/useManualRefresh';

export function useCalendarRefresh(refreshCalendar: () => Promise<void>) {
  // Get debounced refresh hook
  const { 
    debouncedRefresh, 
    cleanupRefresh 
  } = useDebounceRefresh(refreshCalendar);
  
  // Get manual refresh hook
  const { 
    handleManualRefresh 
  } = useManualRefresh(refreshCalendar);

  return {
    debouncedRefresh,
    handleManualRefresh,
    cleanupRefresh
  };
}
