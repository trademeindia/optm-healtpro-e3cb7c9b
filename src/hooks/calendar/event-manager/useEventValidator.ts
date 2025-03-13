
import { useCallback } from 'react';
import { CalendarEvent } from '../types';

export const useEventValidator = () => {
  const validateEventData = useCallback((eventData: Partial<CalendarEvent>): boolean => {
    // Required fields check
    if (!eventData.title) {
      console.error("Event validation failed: Missing title");
      return false;
    }

    if (!eventData.start || !eventData.end) {
      console.error("Event validation failed: Missing start or end times");
      return false;
    }

    // If type is undefined or empty, reject
    if (!eventData.type) {
      console.error("Event validation failed: Missing type");
      return false;
    }

    // If patient name is undefined or empty, reject
    if (!eventData.patientName) {
      console.error("Event validation failed: Missing patient name");
      return false;
    }

    // Check that start is before end if both are provided
    if (eventData.start && eventData.end) {
      const start = eventData.start instanceof Date 
        ? eventData.start 
        : new Date(eventData.start);
      
      const end = eventData.end instanceof Date 
        ? eventData.end 
        : new Date(eventData.end);

      if (start >= end) {
        console.error("Event validation failed: Start time must be before end time");
        return false;
      }
    }

    // All validation passed
    return true;
  }, []);

  return { validateEventData };
};
