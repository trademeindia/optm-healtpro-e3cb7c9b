
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useCalendarIntegration } from '@/hooks/calendar/useCalendarIntegration';
import { useCalendarRefresh } from '@/hooks/calendar/useCalendarRefresh';
import { useCalendarConnection } from '@/hooks/calendar/useCalendarConnection';
import { useCalendarEventListeners } from '@/hooks/calendar/useCalendarEvents';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarGrid from '@/components/calendar/CalendarGrid';

const CalendarTab: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>('week');
  const calendarViewRef = useRef<any>(null);
  
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
    publicCalendarUrl,
    user
  } = useCalendarIntegration();

  const validAppointments = upcomingAppointments || [];

  // Use our hooks for calendar functionality
  const { debouncedRefresh, handleManualRefresh, cleanupRefresh, isRefreshing } = useCalendarRefresh(refreshCalendar);
  const { isConnecting, handleConnectCalendar } = useCalendarConnection(isAuthorized, isLoading, authorizeCalendar);
  
  // Setup event listeners
  useCalendarEventListeners(debouncedRefresh, refreshCalendar);

  // Initial refresh when authorized
  useEffect(() => {
    if (isAuthorized) {
      console.log("Initial calendar refresh on authorization");
      refreshCalendar();
    }
    
    return cleanupRefresh;
  }, [isAuthorized, refreshCalendar, cleanupRefresh]);

  // Refresh when appointments are created or updated
  useEffect(() => {
    const handleAppointmentEvent = () => {
      console.log("Appointment event detected in CalendarTab, triggering refresh");
      debouncedRefresh();
    };
    
    window.addEventListener('appointment-created', handleAppointmentEvent);
    window.addEventListener('appointment-updated', handleAppointmentEvent);
    window.addEventListener('calendar-updated', handleAppointmentEvent);
    
    return () => {
      window.removeEventListener('appointment-created', handleAppointmentEvent);
      window.removeEventListener('appointment-updated', handleAppointmentEvent);
      window.removeEventListener('calendar-updated', handleAppointmentEvent);
    };
  }, [debouncedRefresh]);

  const handleConnect = async () => {
    const success = await handleConnectCalendar();
    
    if (success) {
      toast.success("Calendar connected successfully", {
        description: "Your Google Calendar has been connected",
        duration: 3000
      });
      
      await fetchEvents();
      return true;
    } else {
      toast.error("Failed to connect calendar", {
        description: "Please try again or check your network connection",
        duration: 5000
      });
      return false;
    }
  };

  const handleCreateAppointment = () => {
    // Open the create appointment dialog in the CalendarView component
    if (calendarViewRef.current && calendarViewRef.current.openCreateDialog) {
      calendarViewRef.current.openCreateDialog(selectedDate);
    } else {
      console.log("Create appointment button clicked, but ref not available");
      toast.error("Could not open appointment creation dialog", {
        description: "Please try again or refresh the page"
      });
    }
  };

  const handleRefresh = async () => {
    const success = await handleManualRefresh();
    
    if (success) {
      toast.success("Calendar refreshed", {
        duration: 2000
      });
      
      // Force a refresh of the appointments UI
      setTimeout(() => {
        window.dispatchEvent(new Event('calendar-data-updated'));
      }, 500);
    } else {
      toast.error("Failed to refresh calendar", {
        duration: 3000
      });
    }
  };

  // Function to explicitly reload the iframe
  const reloadCalendarIframe = () => {
    console.log("Reloading calendar iframe from CalendarTab");
    window.dispatchEvent(new Event('calendar-updated'));
    
    // Also refresh the data
    setTimeout(() => {
      debouncedRefresh();
    }, 300);
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-4">
      <CalendarHeader 
        isLoading={isLoading || isRefreshing}
        isAuthorized={isAuthorized}
        isConnecting={isConnecting}
        onRefresh={handleRefresh}
        onCreateAppointment={handleCreateAppointment}
      />

      <CalendarGrid
        isAuthorized={isAuthorized}
        isLoading={isLoading || isRefreshing}
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        calendarData={calendarData}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        onConnectCalendar={handleConnect}
        isConnecting={isConnecting}
        onEventsChange={debouncedRefresh}
        calendarViewRef={calendarViewRef}
        publicCalendarUrl={publicCalendarUrl}
        reloadCalendarIframe={reloadCalendarIframe}
        validAppointments={validAppointments}
        refreshCalendar={refreshCalendar}
        currentUser={user}
      />
    </div>
  );
};

export default CalendarTab;
