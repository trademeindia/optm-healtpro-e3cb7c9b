
import { useEffect, useCallback, useRef } from 'react';

export function useCalendarEventListeners(
  debouncedRefresh: () => void,
  refreshCalendar: () => void
) {
  const eventsQueueRef = useRef<Set<string>>(new Set());
  const processingEventsRef = useRef(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastEventTimeRef = useRef(0);
  const MIN_EVENT_INTERVAL = 1000; // Minimum 1 second between handling events

  // Consolidated event handler with rate limiting
  const handleCalendarEvent = useCallback((event: CustomEvent, eventType: string) => {
    // Check if we've processed an event too recently
    const now = Date.now();
    if (now - lastEventTimeRef.current < MIN_EVENT_INTERVAL) {
      console.log(`Skipping rapid ${eventType} event, throttling applied`);
      return;
    }
    
    console.log(`${eventType} event received:`, event.detail);
    lastEventTimeRef.current = now;
    
    // Add to queue instead of refreshing immediately
    eventsQueueRef.current.add(eventType);
    
    // Only schedule processing if not already scheduled
    if (!processingEventsRef.current && !refreshTimeoutRef.current) {
      // Use a longer timeout to batch more events
      refreshTimeoutRef.current = setTimeout(() => {
        processEvents();
      }, 1000); // Increased timeout for better batching
    }
  }, []);
  
  // Process all queued events with a single refresh
  const processEvents = useCallback(() => {
    if (processingEventsRef.current) {
      console.log("Already processing events, skipping");
      return;
    }
    
    processingEventsRef.current = true;
    
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
    
    try {
      if (eventsQueueRef.current.size > 0) {
        console.log(`Processing ${eventsQueueRef.current.size} calendar events`);
        eventsQueueRef.current.clear();
        
        // Use a small timeout before triggering refresh to avoid UI blocking
        setTimeout(() => {
          debouncedRefresh();
        }, 50);
      }
    } catch (error) {
      console.error("Error processing calendar events:", error);
    } finally {
      // Wait a bit before allowing more event processing to prevent rapid refreshes
      setTimeout(() => {
        processingEventsRef.current = false;
      }, 500);
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
    
    // Initial refresh should only happen once and with a delay
    const initialRefreshTimeout = setTimeout(() => {
      console.log("Performing initial calendar refresh");
      refreshCalendar();
    }, 1500); // Increased timeout for initial load

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
