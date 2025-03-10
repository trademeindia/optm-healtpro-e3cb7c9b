
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { CalendarEvent, UpcomingAppointment } from './types';
import { generateMockEvents, mapEventsToAppointments } from './mockCalendarData';

export function useCalendarData(isAuthorized: boolean) {
  const [isLoading, setIsLoading] = useState(false);
  const [calendarData, setCalendarData] = useState<CalendarEvent[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!isAuthorized) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching calendar events");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate some mock data
      const mockEvents: CalendarEvent[] = generateMockEvents(selectedDate);
      setCalendarData(mockEvents);
      
      // Also set upcoming appointments based on mock data
      const upcoming = mapEventsToAppointments(mockEvents);
      setUpcomingAppointments(upcoming);
      
      console.log("Successfully fetched calendar events", mockEvents.length);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      setError(error.message || "Failed to fetch calendar data");
      
      toast.error("Failed to fetch calendar data", {
        description: "Could not retrieve your calendar events. Please try again.",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthorized, selectedDate]);

  const refreshCalendar = useCallback(async () => {
    if (!isAuthorized) {
      toast.error("Calendar not connected", {
        description: "Please connect your Google Calendar first",
        duration: 3000
      });
      return;
    }
    
    toast.info("Refreshing calendar data...", {
      duration: 1500
    });
    
    await fetchEvents();
    
    toast.success("Calendar refreshed", {
      description: "Your calendar data has been updated",
      duration: 3000
    });
  }, [isAuthorized, fetchEvents]);

  // Fetch events when authorization status or selected date changes
  useEffect(() => {
    if (isAuthorized) {
      fetchEvents();
    }
  }, [isAuthorized, selectedDate, fetchEvents]);

  return {
    isLoading,
    calendarData,
    upcomingAppointments,
    selectedDate,
    setSelectedDate,
    fetchEvents,
    refreshCalendar,
    error
  };
}
