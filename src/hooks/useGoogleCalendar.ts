
import { useState, useEffect } from 'react';
import { 
  initializeGoogleApi, 
  isSignedInToGoogleCalendar, 
  signInToGoogleCalendar, 
  signOutFromGoogleCalendar 
} from '@/utils/googleCalendar';
import { useToast } from '@/hooks/use-toast';

export const useGoogleCalendar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if Google Calendar sync is enabled in localStorage
    const syncEnabledInStorage = localStorage.getItem('googleCalendarSyncEnabled') === 'true';
    setSyncEnabled(syncEnabledInStorage);
    
    // Initialize Google API
    initializeGoogleApi();
    
    // Wait for the API to load
    const handleGapiLoaded = () => {
      setIsSignedIn(isSignedInToGoogleCalendar());
      setIsLoading(false);
    };
    
    document.addEventListener('gapi-loaded', handleGapiLoaded);
    
    return () => {
      document.removeEventListener('gapi-loaded', handleGapiLoaded);
    };
  }, []);
  
  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInToGoogleCalendar();
      setIsSignedIn(true);
      toast({
        title: "Successfully Connected",
        description: "Your Google Calendar is now connected.",
      });
    } catch (error) {
      console.error("Error signing in to Google Calendar", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to Google Calendar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignOut = () => {
    const success = signOutFromGoogleCalendar();
    if (success) {
      setIsSignedIn(false);
      setSyncEnabled(false);
      toast({
        title: "Disconnected",
        description: "Your Google Calendar has been disconnected.",
      });
    }
  };
  
  const toggleSync = (enabled: boolean) => {
    if (enabled && !isSignedIn) {
      handleSignIn();
    }
    
    setSyncEnabled(enabled);
    localStorage.setItem('googleCalendarSyncEnabled', enabled.toString());
    
    toast({
      title: enabled ? "Sync Enabled" : "Sync Disabled",
      description: enabled 
        ? "Your appointments will now be synced with Google Calendar." 
        : "Your appointments will no longer be synced with Google Calendar.",
    });
  };
  
  return {
    isSignedIn,
    isLoading,
    syncEnabled,
    signIn: handleSignIn,
    signOut: handleSignOut,
    toggleSync
  };
};
