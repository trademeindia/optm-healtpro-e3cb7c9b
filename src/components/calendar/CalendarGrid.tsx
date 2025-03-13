
import React, { RefObject } from 'react';
import { CalendarEvent, UpcomingAppointment } from '@/hooks/calendar/types';
import CalendarViewWrapper from '@/components/calendar/CalendarViewWrapper';
import AppointmentsCard from '@/components/calendar/AppointmentsCard';
import { User } from '@/contexts/auth/types';

interface CalendarGridProps {
  isAuthorized: boolean;
  isLoading: boolean;
  selectedView: 'day' | 'week' | 'month';
  setSelectedView: (view: 'day' | 'week' | 'month') => void;
  calendarData: CalendarEvent[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onConnectCalendar: () => Promise<boolean>;
  isConnecting: boolean;
  onEventsChange: () => void;
  calendarViewRef: RefObject<any>;
  publicCalendarUrl?: string;
  reloadCalendarIframe: () => void;
  validAppointments: UpcomingAppointment[];
  refreshCalendar: () => Promise<void>;
  currentUser?: User;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  isAuthorized,
  isLoading,
  selectedView,
  setSelectedView,
  calendarData,
  selectedDate,
  onDateSelect,
  onConnectCalendar,
  isConnecting,
  onEventsChange,
  calendarViewRef,
  publicCalendarUrl,
  reloadCalendarIframe,
  validAppointments,
  refreshCalendar,
  currentUser
}) => {
  // Create a wrapper function to adapt Promise<boolean> to Promise<void>
  const handleConnectCalendar = async () => {
    await onConnectCalendar();
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      <div className="lg:col-span-2">
        <CalendarViewWrapper 
          isAuthorized={isAuthorized}
          isLoading={isLoading}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          calendarData={calendarData}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          onConnectCalendar={handleConnectCalendar}
          isConnecting={isConnecting}
          onEventsChange={onEventsChange}
          calendarViewRef={calendarViewRef}
          publicCalendarUrl={publicCalendarUrl}
          reloadCalendarIframe={reloadCalendarIframe}
        />
      </div>

      <div className="h-full">
        <AppointmentsCard 
          isLoading={isLoading}
          isAuthorized={isAuthorized}
          appointments={validAppointments}
          onRefresh={refreshCalendar}
        />
      </div>
    </div>
  );
};

export default CalendarGrid;
