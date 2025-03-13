
import { useState, useCallback } from 'react';
import { CalendarEvent } from './types';
import { useEventFilters } from './useEventFilters';
import { useCalendarEventListeners as useEventListeners } from './useEventListeners';

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

  // Use the extracted event filtering hooks
  const { getEventsForDate, getEventsForHour } = useEventFilters(events);

  return {
    selectedEvent,
    isDetailsOpen,
    openEventDetails,
    closeEventDetails,
    getEventsForDate,
    getEventsForHour
  };
}

// Re-export the event listeners hook for backward compatibility
export { useEventListeners as useCalendarEventListeners } from './useEventListeners';
