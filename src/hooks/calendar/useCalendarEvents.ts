
import { useState, useCallback } from 'react';
import { CalendarEvent } from './types';

export function useCalendarEvents(events: CalendarEvent[]) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const openEventDetails = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  }, []);

  const closeEventDetails = useCallback(() => {
    setIsDetailsOpen(false);
  }, []);

  // Get events for a specific date
  const getEventsForDate = useCallback((date: Date) => {
    return events.filter(event => {
      const eventDate = event.start instanceof Date ? event.start : new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  }, [events]);

  // Get events for a specific hour on a specific date
  const getEventsForHour = useCallback((date: Date, hour: number) => {
    return events.filter(event => {
      const eventStart = event.start instanceof Date ? event.start : new Date(event.start);
      return (
        eventStart.getDate() === date.getDate() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getFullYear() === date.getFullYear() &&
        eventStart.getHours() === hour
      );
    });
  }, [events]);

  return {
    selectedEvent,
    isDetailsOpen,
    openEventDetails,
    closeEventDetails,
    getEventsForDate,
    getEventsForHour
  };
}

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
