
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useCalendarIntegration } from '@/hooks/calendar/useCalendarIntegration';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarViewWrapper from '@/components/calendar/CalendarViewWrapper';
import AppointmentsCard from '@/components/calendar/AppointmentsCard';

const CalendarTab: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>('week');
  const [isConnecting, setIsConnecting] = useState(false);
  const calendarViewRef = useRef<any>(null);
  const connectionAttemptedRef = useRef(false);
  
  const { 
    isLoading, 
    isAuthorized, 
    calendarData, 
    authorizeCalendar, 
    fetchEvents, 
    refreshCalendar,
    selectedDate,
    setSelectedDate,
    upcomingAppointments,
    publicCalendarUrl
  } = useCalendarIntegration();

  const validAppointments = upcomingAppointments || [];

  // Auto-connect to calendar if needed (only once per session)
  useEffect(() => {
    const autoConnectCalendar = async () => {
      // Only attempt auto-connect once and only if not already connected
      if (!isAuthorized && !isLoading && !connectionAttemptedRef.current && !isConnecting) {
        console.log("Attempting automatic calendar reconnection");
        connectionAttemptedRef.current = true;
        setIsConnecting(true);
        
        try {
          await authorizeCalendar();
          console.log("Auto-reconnection to calendar successful");
        } catch (error) {
          console.error("Auto-reconnection failed:", error);
        } finally {
          setIsConnecting(false);
        }
      }
    };
    
    autoConnectCalendar();
  }, [isAuthorized, isLoading, authorizeCalendar, isConnecting]);

  // Set up a periodic refresh for the calendar data when authorized
  useEffect(() => {
    if (!isAuthorized) return;
    
    // Initial fetch
    refreshCalendar();
    
    // Set up a periodic refresh (every 2 minutes)
    const refreshInterval = setInterval(() => {
      console.log("Performing automatic calendar refresh");
      refreshCalendar();
    }, 2 * 60 * 1000); // 2 minutes
    
    return () => clearInterval(refreshInterval);
  }, [isAuthorized, refreshCalendar]);

  // Listen for calendar update events
  useEffect(() => {
    const handleCalendarEvent = () => {
      console.log("Calendar event received in CalendarTab");
      refreshCalendar();
    };
    
    // Also listen for appointment creation events
    window.addEventListener('appointment-created', handleCalendarEvent);
    window.addEventListener('appointment-updated', handleCalendarEvent);
    
    return () => {
      window.removeEventListener('appointment-created', handleCalendarEvent);
      window.removeEventListener('appointment-updated', handleCalendarEvent);
    };
  }, [refreshCalendar]);

  const handleConnectCalendar = async () => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);
      console.info("Starting calendar authorization process");
      const result = await authorizeCalendar();
      
      if (!result) {
        throw new Error("Calendar authorization failed");
      }
      
      console.info("Calendar authorization successful");
      toast.success("Calendar connected successfully", {
        description: "Your Google Calendar has been connected",
        duration: 3000
      });
      
      await fetchEvents();
    } catch (error) {
      console.error("Calendar connection error:", error);
      toast.error("Failed to connect calendar", {
        description: "Please try again or check your network connection",
        duration: 5000
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCreateAppointment = () => {
    // Open the create appointment dialog in the CalendarView component
    if (calendarViewRef.current && calendarViewRef.current.openCreateDialog) {
      calendarViewRef.current.openCreateDialog(selectedDate);
    } else {
      console.log("Create appointment button clicked, but ref not available");
    }
  };

  const handleRefresh = async () => {
    try {
      console.log("Manually refreshing calendar data...");
      await refreshCalendar();
      toast.success("Calendar refreshed", {
        duration: 2000
      });
      
      // Dispatch a calendar-updated event to ensure all components refresh
      window.dispatchEvent(new Event('calendar-updated'));
    } catch (error) {
      console.error("Error refreshing calendar:", error);
      toast.error("Failed to refresh calendar", {
        duration: 3000
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-4">
      <CalendarHeader 
        isLoading={isLoading}
        isAuthorized={isAuthorized}
        isConnecting={isConnecting}
        onRefresh={handleRefresh}
        onCreateAppointment={handleCreateAppointment}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <CalendarViewWrapper 
            isAuthorized={isAuthorized}
            isLoading={isLoading}
            selectedView={selectedView}
            setSelectedView={setSelectedView}
            calendarData={calendarData}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onConnectCalendar={handleConnectCalendar}
            isConnecting={isConnecting}
            onEventsChange={handleRefresh}
            calendarViewRef={calendarViewRef}
            publicCalendarUrl={publicCalendarUrl}
          />
        </div>

        <div className="h-full">
          <AppointmentsCard 
            isLoading={isLoading}
            isAuthorized={isAuthorized}
            appointments={validAppointments}
            onRefresh={refreshCalendar}
            publicCalendarUrl={publicCalendarUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarTab;
