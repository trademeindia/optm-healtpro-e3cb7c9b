
import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

export function useCalendarAuth() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarAuthStorage, setCalendarAuthStorage] = useLocalStorage('calendar-auth', 'false');
  
  // Set the public calendar URL to the one provided by the user
  const publicCalendarUrl = 'https://calendar.google.com/calendar/ical/9a409a615a87e969d7841278f3c59968d682fc699d907ecf4d9472341743d1d5%40group.calendar.google.com/public/basic.ics';

  // Initialize auth state from storage
  useEffect(() => {
    const isAuth = calendarAuthStorage === 'true';
    setIsAuthorized(isAuth);
    console.log("Calendar authorization saved to storage:", isAuth);
    setIsLoading(false);
  }, [calendarAuthStorage]);

  // Google Calendar authorization mock
  const authorizeCalendar = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would trigger a Google OAuth flow
      // For demo purposes, we're just simulating a successful auth
      console.log("Authorizing calendar integration...");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save auth status to storage
      setCalendarAuthStorage('true');
      setIsAuthorized(true);
      
      return true;
    } catch (error: any) {
      console.error("Calendar authorization error:", error);
      setError(error.message || "Failed to authorize calendar");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setCalendarAuthStorage]);

  const disconnectCalendar = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Simulate disconnect
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Clear auth state
      setCalendarAuthStorage('false');
      setIsAuthorized(false);
      
      return true;
    } catch (error: any) {
      console.error("Calendar disconnect error:", error);
      setError(error.message || "Failed to disconnect calendar");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setCalendarAuthStorage]);

  return {
    isAuthorized,
    isLoading,
    error,
    authorizeCalendar,
    disconnectCalendar,
    publicCalendarUrl
  };
}
