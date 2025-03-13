
import { useEffect } from 'react';

export function useCalendarEventListeners(
  debouncedRefresh: () => void,
  refreshCalendar: () => Promise<void>
) {
  // Set up a periodic refresh for the calendar data when authorized
  useEffect(() => {    
    // Set up a periodic refresh (every 2 minutes)
    const refreshInterval = setInterval(() => {
      console.log("Performing automatic calendar refresh");
      refreshCalendar();
    }, 2 * 60 * 1000); // 2 minutes
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [refreshCalendar]);

  // Listen for calendar update events
  useEffect(() => {
    const handleCalendarEvent = () => {
      console.log("Calendar event received in CalendarTab");
      debouncedRefresh();
    };
    
    // Also listen for appointment creation events
    window.addEventListener('appointment-created', handleCalendarEvent);
    window.addEventListener('appointment-updated', handleCalendarEvent);
    window.addEventListener('calendar-updated', handleCalendarEvent);
    
    return () => {
      window.removeEventListener('appointment-created', handleCalendarEvent);
      window.removeEventListener('appointment-updated', handleCalendarEvent);
      window.removeEventListener('calendar-updated', handleCalendarEvent);
    };
  }, [debouncedRefresh]);
}
