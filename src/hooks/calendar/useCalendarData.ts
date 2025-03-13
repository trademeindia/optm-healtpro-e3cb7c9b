
import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { CalendarEvent, UpcomingAppointment } from './types';
import { generateMockEvents, mapEventsToAppointments } from './mockCalendarData';

// Using the public URL as an identifier for the specific calendar
const CALENDAR_ID = '9a409a615a87e969d7841278f3c59968d682fc699d907ecf4d9472341743d1d5@group.calendar.google.com';

export function useCalendarData(isAuthorized: boolean) {
  const [isLoading, setIsLoading] = useState(false);
  const [calendarData, setCalendarData] = useState<CalendarEvent[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const isRefreshingRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Function to reload the iframe
  const reloadCalendarIframe = useCallback(() => {
    // Find any iframe in the document that matches our Google Calendar URL
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      if (iframe.src && iframe.src.includes('calendar.google.com')) {
        console.log("Reloading Google Calendar iframe");
        // Force iframe reload by setting the src again
        const currentSrc = iframe.src;
        iframe.src = '';
        setTimeout(() => {
          iframe.src = currentSrc;
        }, 100);
      }
    });
  }, []);

  const fetchEvents = useCallback(async () => {
    // Don't fetch if not authorized or already fetching
    if (!isAuthorized || isRefreshingRef.current) return;
    
    setIsLoading(true);
    setError(null);
    isRefreshingRef.current = true;
    
    try {
      console.log("Fetching calendar events...");
      
      // In a real implementation, we would use the calendar ID to fetch events
      // from Google Calendar API, but never expose the secret token in client code
      console.log(`Fetching events for calendar: ${CALENDAR_ID}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate some mock data - in production, this would be real data from the API
      const mockEvents = generateMockEvents(selectedDate);
      
      console.log(`Fetched ${mockEvents.length} calendar events`);
      setCalendarData(mockEvents);
      
      // Update upcoming appointments
      const upcoming = mapEventsToAppointments(mockEvents);
      setUpcomingAppointments(upcoming);
      
      // Attempt to reload the iframe to show updated Google Calendar
      reloadCalendarIframe();
      
    } catch (error: any) {
      console.error("Error fetching events:", error);
      setError(error.message || "Failed to fetch calendar data");
      
      toast.error("Failed to fetch calendar data", {
        description: "Could not retrieve your calendar events. Please try again.",
      });
    } finally {
      setIsLoading(false);
      isRefreshingRef.current = false;
    }
  }, [isAuthorized, selectedDate, reloadCalendarIframe]);

  const refreshCalendar = useCallback(async () => {
    if (!isAuthorized) {
      toast.error("Calendar not connected", {
        description: "Please connect your Google Calendar first",
      });
      return;
    }
    
    if (isRefreshingRef.current) {
      console.log("Calendar refresh already in progress, skipping");
      return;
    }
    
    console.log("Refreshing calendar data...");
    toast.info("Refreshing calendar data...");
    
    // Force a refresh by setting a new timestamp
    setLastRefresh(Date.now());
    
    // Immediately try to reload the iframe
    reloadCalendarIframe();
  }, [isAuthorized, reloadCalendarIframe]);

  // Load calendar data when authorized or refresh is triggered
  useEffect(() => {
    if (isAuthorized) {
      console.log("Calendar data refresh triggered at:", new Date(lastRefresh).toISOString());
      fetchEvents();
    }
  }, [isAuthorized, selectedDate, fetchEvents, lastRefresh]);

  return {
    isLoading,
    calendarData,
    upcomingAppointments,
    selectedDate,
    setSelectedDate,
    fetchEvents,
    refreshCalendar,
    error,
    reloadCalendarIframe
  };
}
