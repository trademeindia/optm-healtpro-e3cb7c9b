
import { useAuth } from '@/contexts/auth';
import { useCalendarAuth } from './useCalendarAuth';
import { useCalendarData } from './useCalendarData';
import { CalendarEvent, UpcomingAppointment } from './types';
import { useCallback } from 'react';

export type { CalendarEvent, UpcomingAppointment };

export const useCalendarIntegration = () => {
  const { user } = useAuth();
  
  const { 
    isAuthorized, 
    isLoading: isAuthLoading, 
    error: authError, 
    publicCalendarUrl,
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

  // Enhanced refresh that ensures we fetch new data
  const enhancedRefresh = useCallback(async () => {
    console.log("Enhanced calendar refresh triggered");
    
    // First refresh
    await refreshCalendar();
    
    // Second refresh after a delay to ensure everything is updated
    setTimeout(async () => {
      console.log("Executing second refresh to ensure data consistency");
      await refreshCalendar();
      
      // Dispatch events to notify all components
      window.dispatchEvent(new Event('calendar-updated'));
      window.dispatchEvent(new Event('calendar-data-updated'));
    }, 1000);
  }, [refreshCalendar]);

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
    refreshCalendar: enhancedRefresh,
    selectedDate,
    setSelectedDate,
    publicCalendarUrl,
    error,
    user
  };
};
