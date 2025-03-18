
import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { CalendarEvent, UpcomingAppointment } from './types';
import { generateMockEvents, mapEventsToAppointments } from './mockCalendarData';
import { useAuth } from '@/contexts/auth';
import { GOOGLE_CALENDAR_ID } from './useCalendarAuth';

export function useCalendarData(isAuthorized: boolean) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [calendarData, setCalendarData] = useState<CalendarEvent[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const isRefreshingRef = useRef(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSuccessfulFetchRef = useRef(0);
  const MIN_REFRESH_INTERVAL = 5000; // 5 seconds minimum between refreshes

  // Improved fetch events function with error handling and rate limiting
  const fetchEvents = useCallback(async () => {
    // Don't fetch if not authorized, already fetching, or fetched too recently
    if (!isAuthorized || isRefreshingRef.current) return;
    
    const now = Date.now();
    if (now - lastSuccessfulFetchRef.current < MIN_REFRESH_INTERVAL) {
      console.log(`Skipping fetch, only ${now - lastSuccessfulFetchRef.current}ms since last fetch`);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    isRefreshingRef.current = true;
    
    try {
      console.log("Fetching calendar events...");
      
      // Log the calendar ID we're using
      console.log(`Fetching events for calendar: ${GOOGLE_CALENDAR_ID}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, we generate mock data
      let mockEvents = generateMockEvents(selectedDate);
      
      // Apply role-based access control to filter events
      let filteredEvents = mockEvents;
      
      if (user && user.role === 'patient' && user.patientId) {
        // Patient can only see their own appointments
        filteredEvents = mockEvents.filter(event => {
          // Check for events with matching patient ID or name that might belong to this patient
          const eventPatientId = (event as any).patientId;
          
          // Filter logic: either the patientId matches, or the patient name contains the user's name
          return (eventPatientId && eventPatientId === user.patientId) || 
                 (event.patientName && user.name && event.patientName.includes(user.name));
        });
        
        console.log(`Filtered ${mockEvents.length} events to ${filteredEvents.length} for patient user`);
      }
      
      console.log(`Fetched ${filteredEvents.length} calendar events`);
      setCalendarData(filteredEvents);
      
      // Update upcoming appointments
      const upcoming = mapEventsToAppointments(filteredEvents);
      setUpcomingAppointments(upcoming);
      
      // Update last successful fetch time
      lastSuccessfulFetchRef.current = Date.now();
      
      // Dispatch a success event for calendar data - do this less frequently
      window.dispatchEvent(new CustomEvent('calendar-data-loaded', { 
        detail: { count: filteredEvents.length, timestamp: new Date().toISOString() } 
      }));
      
    } catch (error: any) {
      console.error("Error fetching events:", error);
      setError(error.message || "Failed to fetch calendar data");
      
      toast.error("Failed to fetch calendar data", {
        description: "Could not retrieve your calendar events. Please try again.",
      });
      
      // Dispatch an error event
      window.dispatchEvent(new CustomEvent('calendar-data-error', { 
        detail: { message: error.message } 
      }));
    } finally {
      setIsLoading(false);
      isRefreshingRef.current = false;
    }
  }, [isAuthorized, selectedDate, user]);

  // Improved refresh function with rate limiting
  const refreshCalendar = useCallback(async () => {
    if (!isAuthorized) {
      console.log("Calendar not authorized, skipping refresh");
      return;
    }
    
    if (isRefreshingRef.current) {
      console.log("Calendar refresh already in progress, skipping");
      return;
    }
    
    const now = Date.now();
    if (now - lastSuccessfulFetchRef.current < MIN_REFRESH_INTERVAL) {
      console.log(`Skipping refresh, only ${now - lastSuccessfulFetchRef.current}ms since last fetch`);
      return;
    }
    
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Debounce multiple rapid refresh calls
    debounceTimeoutRef.current = setTimeout(() => {
      console.log("Refreshing calendar data...");
      
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
