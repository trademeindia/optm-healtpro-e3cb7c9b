
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
      const mockEvents = generateMockEvents(selectedDate, appointmentChanges.current);
      
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
      
      // Signal that calendar data is updated
      window.dispatchEvent(new Event('calendar-data-updated'));
      
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
  }, [isAuthorized, selectedDate, user, appointmentChanges.current]);

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
    
    // Increment the change counter to ensure different mock data
    appointmentChanges.current += 1;
    
    // Force a refresh by setting a new timestamp 
    // This will trigger the useEffect below
    setLastRefresh(Date.now());
    
    // Also dispatch an event to notify other components about the refresh
    window.dispatchEvent(new Event('calendar-updated'));
  }, [isAuthorized]);

  // Load calendar data when authorized or refresh is triggered
  useEffect(() => {
    if (isAuthorized) {
      console.log("Calendar data refresh triggered at:", new Date(lastRefresh).toISOString());
      fetchEvents();
    }
  }, [isAuthorized, fetchEvents, lastRefresh]);
  
  // Listen for specific appointment events with more robust event handling
  useEffect(() => {
    if (isAuthorized) {
      const handleAppointmentCreated = (event: Event) => {
        console.log("Appointment created event detected, refreshing calendar data");
        
        // Get details from the custom event if available
        const customEvent = event as CustomEvent;
        if (customEvent.detail) {
          console.log("New appointment details:", customEvent.detail);
        }
        
        // Increment the change counter
        appointmentChanges.current += 1;
        
        // Set slight delay to ensure all systems have processed the new data
        setTimeout(() => refreshCalendar(), 300);
      };
      
      const handleAppointmentUpdated = () => {
        console.log("Appointment updated event detected, refreshing calendar data");
        
        // Increment the change counter
        appointmentChanges.current += 1;
        
        // Set slight delay to ensure all systems have processed the new data
        setTimeout(() => refreshCalendar(), 300);
      };
      
      // Listen for direct calendar update events
      const handleCalendarUpdated = () => {
        console.log("Calendar updated event detected, refreshing calendar data");
        setTimeout(() => refreshCalendar(), 300);
      };
      
      window.addEventListener('appointment-created', handleAppointmentCreated);
      window.addEventListener('appointment-updated', handleAppointmentUpdated);
      window.addEventListener('calendar-updated', handleCalendarUpdated);
      
      return () => {
        window.removeEventListener('appointment-created', handleAppointmentCreated);
        window.removeEventListener('appointment-updated', handleAppointmentUpdated);
        window.removeEventListener('calendar-updated', handleCalendarUpdated);
      };
    }
  }, [isAuthorized, refreshCalendar]);

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
