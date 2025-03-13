
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

// Use the public calendar URL for display
const PUBLIC_GOOGLE_CALENDAR_URL = 'https://calendar.google.com/calendar/embed?src=9a409a615a87e969d7841278f3c59968d682fc699d907ecf4d9472341743d1d5%40group.calendar.google.com&ctz=Asia%2FKolkata';

export function useCalendarAuth() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
