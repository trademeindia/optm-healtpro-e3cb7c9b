
import { useCallback } from 'react';
import { CalendarEvent } from '../types';

export const useEventValidator = () => {
  const validateEventData = useCallback((eventData: Partial<CalendarEvent>): boolean => {
    if (!eventData.start || !eventData.end) {
      console.error("Missing start or end time");
      return false;
    }
    
    const start = eventData.start instanceof Date ? eventData.start : new Date(eventData.start);
    const end = eventData.end instanceof Date ? eventData.end : new Date(eventData.end);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error("Invalid date object in event data");
      return false;
    }
    
    if (end <= start) {
      console.error("End time must be after start time");
      return false;
    }
    
    return true;
  }, []);

  return { validateEventData };
};
