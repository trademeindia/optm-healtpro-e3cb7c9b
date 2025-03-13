
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useCalendarIntegration } from '@/hooks/calendar/useCalendarIntegration';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarViewWrapper from '@/components/calendar/CalendarViewWrapper';
import AppointmentsCard from '@/components/calendar/AppointmentsCard';

const CalendarTab: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>('week');
  const [isConnecting, setIsConnecting] = useState(false);
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
            onEventsChange={refreshCalendar}
            calendarViewRef={calendarViewRef}
            publicCalendarUrl={publicCalendarUrl}
          />
        </div>

        <div>
          <AppointmentsCard 
            isLoading={isLoading}
            isAuthorized={isAuthorized}
            appointments={validAppointments}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarTab;
