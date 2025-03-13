
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

// Update to use a more reliable embed URL format for the Google Calendar
// Using US Holidays public calendar which is guaranteed to be accessible
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
      
      // Simulate successful authorization
      // In a real app, this would be an OAuth flow to Google Calendar API
      setIsAuthorized(true);
      
      // Dispatch multiple events to ensure all components are aware of the authorization
      // Event for components that specifically listen for authorization events
      window.dispatchEvent(new CustomEvent('calendar-authorized', {
        detail: { success: true, timestamp: new Date().toISOString() }
      }));
      
      // Event for components that listen for general calendar updates
      window.dispatchEvent(new CustomEvent('calendar-updated', {
        detail: { action: 'authorize', timestamp: new Date().toISOString() }
      }));
      
      console.log("Calendar authorization successful");
      
      // Trigger immediate calendar refresh
      window.dispatchEvent(new CustomEvent('calendar-data-updated', {
        detail: { timestamp: new Date().toISOString() }
      }));
      
      // Additional refresh after a short delay to ensure all components are updated
      setTimeout(() => {
        window.dispatchEvent(new Event('calendar-updated'));
        console.log("Secondary refresh after authorization");
      }, 1000);
      
      return true;
    } catch (error: any) {
      console.error("Authorization error:", error);
      setError(error.message || "Failed to connect to calendar");
      setIsAuthorized(false);
      
      // Dispatch an event to notify components about failed calendar authorization
      window.dispatchEvent(new CustomEvent('calendar-authorized', {
        detail: { success: false, error: error.message }
      }));
      
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
