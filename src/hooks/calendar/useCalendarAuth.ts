
import { useState, useCallback } from 'react';

export const useCalendarAuth = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const authorizeCalendar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate authorization
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsAuthorized(true);
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
    authorizeCalendar,
    disconnectCalendar
  };
};
