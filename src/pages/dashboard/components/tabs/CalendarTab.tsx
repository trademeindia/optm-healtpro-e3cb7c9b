
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useCalendarIntegration } from '@/hooks/calendar/useCalendarIntegration';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarViewWrapper from '@/components/calendar/CalendarViewWrapper';
import AppointmentsCard from '@/components/calendar/AppointmentsCard';

const CalendarTab: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>('week');
  const [isConnecting, setIsConnecting] = useState(false);
  const { 
    isLoading, 
    isAuthorized, 
    calendarData, 
    authorizeCalendar, 
    fetchEvents, 
    refreshCalendar,
    selectedDate,
    setSelectedDate,
    upcomingAppointments
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
    if (!isAuthorized) {
      toast.error("Calendar not connected", {
        description: "Please connect your Google Calendar first",
        duration: 3000
      });
      return;
    }
  };

  const handleRefresh = async () => {
    try {
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
    <div className="space-y-6">
      <CalendarHeader 
        isLoading={isLoading}
        isAuthorized={isAuthorized}
        isConnecting={isConnecting}
        onRefresh={handleRefresh}
        onCreateAppointment={handleCreateAppointment}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
        />

        <div className="space-y-6">
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
