
import { useEffect, useCallback, useRef } from 'react';

export function useCalendarEventListeners(
  debouncedRefresh: () => void,
  refreshCalendar: () => void
) {
  const eventsQueueRef = useRef<Set<string>>(new Set());
  const processingEventsRef = useRef(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Consolidated event handler to reduce duplicate refreshes
  const handleCalendarEvent = useCallback((event: CustomEvent, eventType: string) => {
    console.log(`${eventType} event received:`, event.detail);
    
    // Add to queue instead of refreshing immediately
    eventsQueueRef.current.add(eventType);
    
    // Only schedule processing if not already scheduled
    if (!processingEventsRef.current && !refreshTimeoutRef.current) {
      refreshTimeoutRef.current = setTimeout(() => {
        processEvents();
      }, 500);
    }
  }, []);
  
  // Process all queued events with a single refresh
  const processEvents = useCallback(() => {
    if (processingEventsRef.current) return;
    
    processingEventsRef.current = true;
    refreshTimeoutRef.current = null;
    
    try {
      if (eventsQueueRef.current.size > 0) {
        console.log(`Processing ${eventsQueueRef.current.size} calendar events`);
        eventsQueueRef.current.clear();
        debouncedRefresh();
      }
    } finally {
      processingEventsRef.current = false;
    }
  }, [debouncedRefresh]);

  // Set up event listeners with the consolidated handler
  useEffect(() => {
    // Create type-safe event handlers for each event type
    const handleAppointmentCreated = (event: Event) => 
      handleCalendarEvent(event as CustomEvent, 'appointment-created');
      
    const handleAppointmentUpdated = (event: Event) => 
      handleCalendarEvent(event as CustomEvent, 'appointment-updated');
      
    const handleAppointmentDeleted = (event: Event) => 
      handleCalendarEvent(event as CustomEvent, 'appointment-deleted');
      
    const handleCalendarDataUpdated = (event: Event) => 
      handleCalendarEvent(event as CustomEvent, 'calendar-data-updated');
    
    // Add listeners for appointment events
    window.addEventListener('appointment-created', handleAppointmentCreated);
    window.addEventListener('appointment-updated', handleAppointmentUpdated);
    window.addEventListener('appointment-deleted', handleAppointmentDeleted);
    window.addEventListener('calendar-data-updated', handleCalendarDataUpdated);
    
    // Initial refresh should only happen once
    const initialRefreshTimeout = setTimeout(() => {
      refreshCalendar();
    }, 500);

    // Clean up listeners and timeouts
    return () => {
      window.removeEventListener('appointment-created', handleAppointmentCreated);
      window.removeEventListener('appointment-updated', handleAppointmentUpdated);
      window.removeEventListener('appointment-deleted', handleAppointmentDeleted);
      window.removeEventListener('calendar-data-updated', handleCalendarDataUpdated);
      
      clearTimeout(initialRefreshTimeout);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [handleCalendarEvent, refreshCalendar]);
}
