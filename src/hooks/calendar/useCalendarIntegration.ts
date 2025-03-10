
import { useAuth } from '@/contexts/AuthContext';
import { useCalendarAuth } from './useCalendarAuth';
import { useCalendarData } from './useCalendarData';
import { CalendarEvent, UpcomingAppointment } from './types';

export type { CalendarEvent, UpcomingAppointment };

export const useCalendarIntegration = () => {
  const { user } = useAuth();
  
  const { 
    isAuthorized, 
    isLoading: isAuthLoading, 
    error: authError, 
    authorizeCalendar 
  } = useCalendarAuth();
  
  const {
    isLoading: isDataLoading,
    calendarData,
    upcomingAppointments,
    selectedDate,
    setSelectedDate,
    fetchEvents,
    refreshCalendar,
    error: dataError
  } = useCalendarData(isAuthorized);

  // Combine loading states and errors
  const isLoading = isAuthLoading || isDataLoading;
  const error = authError || dataError;

  return {
    isLoading,
    isAuthorized,
    calendarData,
    upcomingAppointments,
    authorizeCalendar,
    fetchEvents,
    refreshCalendar,
    selectedDate,
    setSelectedDate,
    error
  };
};
