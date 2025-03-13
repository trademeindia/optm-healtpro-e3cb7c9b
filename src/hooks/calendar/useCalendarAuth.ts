
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

// Update to use a more reliable embed URL format for the Google Calendar
const PUBLIC_GOOGLE_CALENDAR_URL = 'https://calendar.google.com/calendar/embed?src=en.usa%23holiday%40group.v.calendar.google.com&ctz=America%2FNew_York';
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
