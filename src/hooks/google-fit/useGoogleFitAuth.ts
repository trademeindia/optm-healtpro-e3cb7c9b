
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { googleFitService } from '@/services/integrations/googleFitService';

export const useGoogleFitAuth = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = useCallback(() => {
    try {
      const connected = googleFitService.isAuthenticated();
      setIsConnected(connected);
    } catch (error) {
      console.error("Error checking Google Fit connection:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connectGoogleFit = useCallback(() => {
    setIsLoading(true);
    
    try {
      googleFitService.initiateAuth();
      
      setTimeout(() => {
        const connected = googleFitService.isAuthenticated();
        setIsConnected(connected);
        
        if (!connected) {
          setIsLoading(false);
        }
      }, 2500);
    } catch (error) {
      console.error("Error connecting to Google Fit:", error);
      toast.error("Failed to connect to Google Fit", {
        description: "Please try again or check your network connection",
        duration: 5000
      });
      setIsLoading(false);
    }
  }, []);

  const disconnectGoogleFit = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const success = await googleFitService.disconnect();
      
      if (success) {
        setIsConnected(false);
        
        toast.success("Disconnected from Google Fit", {
          duration: 3000
        });
      } else {
        toast.error("Failed to disconnect from Google Fit", {
          duration: 3000
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error disconnecting from Google Fit:", error);
      toast.error("Error disconnecting from Google Fit", {
        description: "Please try again",
        duration: 3000
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isConnected,
    isLoading,
    connectGoogleFit,
    disconnectGoogleFit,
    checkConnectionStatus
  };
};
