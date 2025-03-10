
import { useState } from 'react';
import { CalendarEvent } from '@/hooks/calendar/types';

export interface CalendarEventsResult {
  selectedEvent: CalendarEvent | null;
  isDetailsOpen: boolean;
  openEventDetails: (event: CalendarEvent) => void;
  closeEventDetails: () => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEventsForHour: (date: Date, hour: number) => CalendarEvent[];
}

export const useCalendarEvents = (events: CalendarEvent[]): CalendarEventsResult => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const openEventDetails = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const closeEventDetails = () => {
    setIsDetailsOpen(false);
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear();
    });
  };

  // Get events for a specific hour on a specific date
  const getEventsForHour = (date: Date, hour: number): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getHours() === hour;
    });
  };

  return {
    selectedEvent,
    isDetailsOpen,
    openEventDetails,
    closeEventDetails,
    getEventsForDate,
    getEventsForHour
  };
};
