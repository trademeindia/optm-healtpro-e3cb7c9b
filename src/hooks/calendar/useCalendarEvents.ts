
import { useState, useCallback, useEffect } from 'react';
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
  // FIXED: Reduced refresh frequency to prevent UI flickering
  useEffect(() => {    
    // Set up a periodic refresh (every 5 minutes instead of 2)
    const refreshInterval = setInterval(() => {
      console.log("Performing automatic calendar refresh");
      refreshCalendar();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [refreshCalendar]);

  // Listen for calendar update events with debouncing
  useEffect(() => {
    // Track if a refresh is already scheduled
    let refreshTimeout: NodeJS.Timeout | null = null;
    
    const handleCalendarEvent = () => {
      console.log("Calendar event received in CalendarTab");
      
      // Clear any existing timeout to debounce rapid events
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      
      // Set a new timeout to debounce rapid events
      refreshTimeout = setTimeout(() => {
        debouncedRefresh();
        refreshTimeout = null;
      }, 1000); // 1 second debounce
    };
    
    // Listen for calendar events
    window.addEventListener('calendar-data-updated', handleCalendarEvent);
    
    return () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      window.removeEventListener('calendar-data-updated', handleCalendarEvent);
    };
  }, [debouncedRefresh]);
}
