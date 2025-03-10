
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/utils';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  isAvailable: boolean;
  patientId?: string;
  patientName?: string;
  type?: string;
  location?: string;
  description?: string;
}

export interface UpcomingAppointment {
  id: string;
  title: string;
  date: string;
  time: string;
  patientName?: string;
  patientId?: string;
  type: string;
  location?: string;
}

export const useCalendarIntegration = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [calendarData, setCalendarData] = useState<CalendarEvent[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock Google OAuth flow - in a real app, this would connect to Google OAuth
  const authorizeCalendar = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would redirect to Google OAuth
      setIsAuthorized(true);
      
      toast.success("Calendar Connected", {
        description: "Your Google Calendar has been successfully connected",
        duration: 3000
      });
      
      // Immediately fetch events after authorization
      await fetchEvents();
    } catch (error) {
      console.error("Authorization error:", error);
      toast.error("Connection Failed", {
        description: "Could not connect to Google Calendar. Please try again.",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mock data fetch for demo
  const fetchEvents = useCallback(async () => {
    if (!isAuthorized) return;
    
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate some mock data
      const mockEvents: CalendarEvent[] = generateMockEvents(selectedDate);
      setCalendarData(mockEvents);
      
      // Also set upcoming appointments based on mock data
      const upcoming = mockEvents
        .filter(event => !event.isAvailable && new Date(event.start) > new Date())
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .slice(0, 5)
        .map(event => ({
          id: event.id,
          title: event.title,
          date: formatDate(event.start, "MMMM d, yyyy"),
          time: formatDate(event.start, "h:mm a") + " - " + formatDate(event.end, "h:mm a"),
          patientName: event.patientName,
          patientId: event.patientId,
          type: event.type || "Consultation",
          location: event.location
        }));
      
      setUpcomingAppointments(upcoming);
    } catch (error) {
      console.error("Error fetching events:", error);
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

  // Fetch events when the component mounts or when isAuthorized changes
  useEffect(() => {
    if (isAuthorized) {
      fetchEvents();
    }
  }, [isAuthorized, fetchEvents]);

  // Refetch when the selected date changes
  useEffect(() => {
    if (isAuthorized) {
      fetchEvents();
    }
  }, [selectedDate, isAuthorized, fetchEvents]);

  // For demo purposes, let's auto-authorize on first load for a better demo experience
  useEffect(() => {
    // Uncomment this for auto-authorization in demo mode
    // if (!isAuthorized && !isLoading) {
    //   authorizeCalendar();
    // }
  }, []);

  return {
    isLoading,
    isAuthorized,
    calendarData,
    upcomingAppointments,
    authorizeCalendar,
    fetchEvents,
    refreshCalendar,
    selectedDate,
    setSelectedDate
  };
};

// Helper function to generate mock events for demo purposes
function generateMockEvents(baseDate: Date): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - baseDate.getDay()); // Start from Sunday
  
  const patientNames = [
    "Emma Rodriguez", "Marcus Johnson", "Sarah Chen", 
    "David Williams", "Olivia Martinez", "James Wilson",
    "Sophia Thompson", "Alexander Davis", "Ava Garcia"
  ];
  
  const appointmentTypes = [
    "Initial Consultation", "Follow-up", "Physical Therapy", 
    "Examination", "Treatment Review", "Urgent Care"
  ];
  
  const locations = [
    "Main Office - Room 101", "Virtual Meeting", "Clinic A - Floor 2",
    "Rehab Center", "West Wing - Suite 305"
  ];

  // Generate available slots and some booked appointments
  for (let day = 0; day < 14; day++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + day);
    
    // Skip slots on weekends for available appointments
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    
    if (!isWeekend) {
      // Generate slots from 9 AM to 5 PM
      for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const start = new Date(currentDate);
          start.setHours(hour, minute, 0, 0);
          
          const end = new Date(start);
          end.setMinutes(end.getMinutes() + 30);
          
          // Calculate if this slot should be booked (30% chance)
          const isBooked = Math.random() < 0.3;
          
          if (isBooked) {
            const patientName = patientNames[Math.floor(Math.random() * patientNames.length)];
            const type = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
            const location = locations[Math.floor(Math.random() * locations.length)];
            
            events.push({
              id: `appointment-${day}-${hour}-${minute}`,
              title: `${type} - ${patientName}`,
              start,
              end,
              isAvailable: false,
              patientName,
              patientId: `patient-${Math.floor(Math.random() * 1000)}`,
              type,
              location,
              description: `${type} appointment with ${patientName}`
            });
          } else {
            events.push({
              id: `slot-${day}-${hour}-${minute}`,
              title: 'Available',
              start,
              end,
              isAvailable: true
            });
          }
        }
      }
    }
    
    // Add some personal events and blocked times (even on weekends)
    if (Math.random() < 0.4) {
      const startHour = Math.floor(Math.random() * 10) + 8; // Between 8 AM and 6 PM
      const start = new Date(currentDate);
      start.setHours(startHour, 0, 0, 0);
      
      const durationHours = Math.floor(Math.random() * 3) + 1; // 1-3 hours
      const end = new Date(start);
      end.setHours(end.getHours() + durationHours);
      
      events.push({
        id: `blocked-${day}-${startHour}`,
        title: 'Blocked', // Not showing real title for privacy
        start,
        end,
        isAvailable: false
      });
    }
  }
  
  return events;
}
