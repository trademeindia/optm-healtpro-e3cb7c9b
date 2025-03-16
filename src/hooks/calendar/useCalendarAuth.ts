
import { useState, useCallback } from 'react';

// Add this export
export const GOOGLE_CALENDAR_ID = 'demo@group.calendar.google.com';

export const useCalendarAuth = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [publicCalendarUrl, setPublicCalendarUrl] = useState<string>('https://calendar.google.com/calendar/ical/demo@group.calendar.google.com/public/basic.ics');

  const authorizeCalendar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate authorization
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsAuthorized(true);
      setPublicCalendarUrl('https://calendar.google.com/calendar/ical/demo@group.calendar.google.com/public/basic.ics');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to authorize calendar'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectCalendar = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Simulate disconnection
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsAuthorized(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to disconnect calendar'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isAuthorized,
    isLoading,
    error,
    publicCalendarUrl,
    authorizeCalendar,
    disconnectCalendar
  };
};
