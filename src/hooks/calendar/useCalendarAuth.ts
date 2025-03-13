
import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

// Google Calendar ID to use across the application
export const GOOGLE_CALENDAR_ID = '9a409a615a87e969d7841278f3c59968d682fc699d907ecf4d9472341743d1d5@group.calendar.google.com';
export const GOOGLE_CALENDAR_URL = `https://calendar.google.com/calendar/ical/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/public/basic.ics`;

export function useCalendarAuth() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarAuthStorage, setCalendarAuthStorage] = useLocalStorage<string>('calendar-auth', 'false');
  
  // Initialize auth state from storage
  useEffect(() => {
    const isAuth = calendarAuthStorage === 'true';
    setIsAuthorized(isAuth);
    console.log("Calendar authorization saved to storage:", isAuth);
    setIsLoading(false);
  }, [calendarAuthStorage]);

  // Google Calendar authorization - in a real app, would use OAuth
  const authorizeCalendar = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Authorizing calendar integration...");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real integration, we would:
      // 1. Redirect to Google OAuth consent screen
      // 2. Get access token and refresh token
      // 3. Store tokens securely
      // 4. Use tokens to make API calls
      
      // For demo, we just mark as authorized
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
    publicCalendarUrl: GOOGLE_CALENDAR_URL
  };
}
