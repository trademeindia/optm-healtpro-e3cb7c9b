
import { useState, useCallback, useEffect, useRef } from 'react';
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
  const lastRefreshTimeRef = useRef<number>(0);
  const isRefreshingRef = useRef(false);
  
  // Reduced refresh frequency to prevent UI flickering
  useEffect(() => {    
    // Set up a periodic refresh (every 10 minutes instead of 5)
    const refreshInterval = setInterval(() => {
      // Only refresh if there hasn't been a recent refresh
      const now = Date.now();
      if (now - lastRefreshTimeRef.current > 3 * 60 * 1000 && !isRefreshingRef.current) {
        console.log("Performing automatic calendar refresh");
        isRefreshingRef.current = true;
        
        refreshCalendar()
          .finally(() => {
            lastRefreshTimeRef.current = Date.now();
            isRefreshingRef.current = false;
          });
      }
    }, 10 * 60 * 1000); // 10 minutes
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [refreshCalendar]);

  // Listen for calendar update events with debouncing
  useEffect(() => {
    // Track if a refresh is already scheduled
    let refreshTimeout: NodeJS.Timeout | null = null;
    
    const handleCalendarEvent = (event: CustomEvent) => {
      console.log("Calendar event received in CalendarTab", event.detail);
      
      // Skip if we're already refreshing or if there was a recent refresh
      const now = Date.now();
      if (isRefreshingRef.current || (now - lastRefreshTimeRef.current < 2000)) {
        console.log("Skipping refresh due to recent activity");
        return;
      }
      
      // Clear any existing timeout to debounce rapid events
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      
      // Set a new timeout to debounce rapid events
      refreshTimeout = setTimeout(() => {
        isRefreshingRef.current = true;
        debouncedRefresh();
        lastRefreshTimeRef.current = Date.now();
        isRefreshingRef.current = false;
        refreshTimeout = null;
      }, 2000); // 2 second debounce
    };
    
    // Listen for calendar events
    window.addEventListener('calendar-data-updated', handleCalendarEvent as EventListener);
    
    return () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      window.removeEventListener('calendar-data-updated', handleCalendarEvent as EventListener);
    };
  }, [debouncedRefresh]);
}
