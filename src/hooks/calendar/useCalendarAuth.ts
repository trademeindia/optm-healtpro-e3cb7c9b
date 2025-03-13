import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

// Update to use the iCal URL provided by the user
const PUBLIC_GOOGLE_CALENDAR_URL = 'https://calendar.google.com/calendar/ical/9a409a615a87e969d7841278f3c59968d682fc699d907ecf4d9472341743d1d5%40group.calendar.google.com/public/basic.ics';
const CALENDAR_AUTH_KEY = 'calendar_auth_status';

export function useCalendarAuth() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load authorization state from localStorage on initialization
  useEffect(() => {
    const savedAuth = localStorage.getItem(CALENDAR_AUTH_KEY);
    const isAuth = savedAuth === 'true';
    setIsAuthorized(isAuth);
    setIsLoading(false);
    
    console.log("Calendar authorization loaded from storage:", isAuth);
  }, []);
  
  // Save authorization state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CALENDAR_AUTH_KEY, isAuthorized.toString());
      console.log("Calendar authorization saved to storage:", isAuthorized);
    }
  }, [isAuthorized, isLoading]);
  
  const authorizeCalendar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Starting calendar authorization process");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would redirect to Google OAuth
      // Secret code would be used server-side but is never exposed here
      setIsAuthorized(true);
      
      console.log("Calendar authorization successful");
      return true;
    } catch (error: any) {
      console.error("Authorization error:", error);
      setError(error.message || "Failed to connect to calendar");
      setIsAuthorized(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isAuthorized,
    isLoading,
    error,
    publicCalendarUrl: PUBLIC_GOOGLE_CALENDAR_URL,
    authorizeCalendar
  };
}
