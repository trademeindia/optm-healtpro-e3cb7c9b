
import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { CalendarEvent, UpcomingAppointment } from './types';
import { generateMockEvents, mapEventsToAppointments } from './mockCalendarData';
import { useAuth } from '@/contexts/auth';

// Using the public URL as an identifier for the specific calendar
const CALENDAR_ID = '9a409a615a87e969d7841278f3c59968d682fc699d907ecf4d9472341743d1d5@group.calendar.google.com';

export function useCalendarData(isAuthorized: boolean) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [calendarData, setCalendarData] = useState<CalendarEvent[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const isRefreshingRef = useRef(false);
  const appointmentChanges = useRef(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      
      // Apply role-based access control to filter events
      let filteredEvents = mockEvents;
      
      if (user && user.role === 'patient' && user.patientId) {
        // Patient can only see their own appointments
        filteredEvents = mockEvents.filter(event => {
          // Check for events with matching patient ID or name that might belong to this patient
          const eventPatientId = (event as any).patientId;
          
          // Filter logic: either the patientId matches, or the patient name contains the user's name
          // This is a simplification - in a real app, you would have proper patient IDs
          return (eventPatientId && eventPatientId === user.patientId) || 
                 (event.patientName && event.patientName.includes(user.name));
        });
        
        console.log(`Filtered ${mockEvents.length} events to ${filteredEvents.length} for patient user`);
      }
      
      console.log(`Fetched ${filteredEvents.length} calendar events`);
      setCalendarData(filteredEvents);
      
      // Update upcoming appointments
      const upcoming = mapEventsToAppointments(filteredEvents);
      setUpcomingAppointments(upcoming);
      
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
  }, [isAuthorized, selectedDate, user]);

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
    
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Debounce multiple rapid refresh calls
    debounceTimeoutRef.current = setTimeout(() => {
      console.log("Refreshing calendar data...");
      appointmentChanges.current += 1;
      
      // Force a refresh by setting a new timestamp 
      setLastRefresh(Date.now());
      debounceTimeoutRef.current = null;
    }, 500); // 500ms debounce
    
  }, [isAuthorized]);

  // Load calendar data when authorized or refresh is triggered
  useEffect(() => {
    if (isAuthorized) {
      console.log("Calendar data refresh triggered at:", new Date(lastRefresh).toISOString());
      fetchEvents();
    }
  }, [isAuthorized, fetchEvents, lastRefresh]);
  
  // Clean up any timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

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
