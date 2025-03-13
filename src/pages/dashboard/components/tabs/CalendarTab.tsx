
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
    publicCalendarUrl
  } = useCalendarIntegration();

  const validAppointments = upcomingAppointments || [];

  // Use our new hooks
  const { debouncedRefresh, handleManualRefresh, cleanupRefresh } = useCalendarRefresh(refreshCalendar);
  const { isConnecting, handleConnectCalendar } = useCalendarConnection(isAuthorized, isLoading, authorizeCalendar);
  
  // Setup event listeners
  useCalendarEventListeners(debouncedRefresh, refreshCalendar);

  // Initial refresh when authorized
  useEffect(() => {
    if (isAuthorized) {
      refreshCalendar();
    }
    
    return cleanupRefresh;
  }, [isAuthorized, refreshCalendar, cleanupRefresh]);

  const handleConnect = async () => {
    const success = await handleConnectCalendar();
    
    if (success) {
      toast.success("Calendar connected successfully", {
        description: "Your Google Calendar has been connected",
        duration: 3000
      });
      
      await fetchEvents();
    } else {
      toast.error("Failed to connect calendar", {
        description: "Please try again or check your network connection",
        duration: 5000
      });
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
    const success = await handleManualRefresh();
    
    if (success) {
      toast.success("Calendar refreshed", {
        duration: 2000
      });
    } else {
      toast.error("Failed to refresh calendar", {
        duration: 3000
      });
    }
  };

  // Function to explicitly reload the iframe
  const reloadCalendarIframe = () => {
    window.dispatchEvent(new Event('calendar-updated'));
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

      <CalendarGrid
        isAuthorized={isAuthorized}
        isLoading={isLoading}
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
      />
    </div>
  );
};

export default CalendarTab;
