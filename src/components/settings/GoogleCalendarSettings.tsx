
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleCalendarService, signInToGoogleCalendar, signOutFromGoogleCalendar } from '@/services/calendar/googleCalendarService';

const GoogleCalendarSettings: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check initial connection status
  useEffect(() => {
    const checkConnection = () => {
      const connected = GoogleCalendarService.isAuthenticated();
      setIsConnected(connected);
    };
    checkConnection();
  }, []);

  // Handle connect/disconnect
  const handleToggleConnection = async () => {
    setIsLoading(true);
    
    try {
      if (isConnected) {
        // Disconnect
        const success = await signOutFromGoogleCalendar();
        if (success) {
          setIsConnected(false);
          toast({
            title: "Disconnected from Google Calendar",
            description: "Your calendar integration has been removed.",
          });
        } else {
          throw new Error("Failed to disconnect");
        }
      } else {
        // Connect
        const success = await GoogleCalendarService.authenticate();
        if (success) {
          setIsConnected(true);
          toast({
            title: "Connected to Google Calendar",
            description: "Your appointments will now sync with Google Calendar.",
          });
        } else {
          throw new Error("Failed to connect");
        }
      }
    } catch (error) {
      console.error("Calendar integration error:", error);
      toast({
        title: "Calendar Integration Failed",
        description: "There was a problem with your Google Calendar integration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium mb-3">Google Calendar Integration</h3>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isConnected ? 'bg-green-100' : 'bg-gray-100'}`}>
            <Calendar className={`h-5 w-5 ${isConnected ? 'text-green-600' : 'text-gray-600'}`} />
          </div>
          <div>
            <p className="font-medium">Google Calendar</p>
            <p className="text-xs text-muted-foreground">
              {isConnected ? 'Connected and syncing appointments' : 'Not connected'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch 
            id="google-calendar" 
            checked={isConnected} 
            disabled={isLoading}
          />
          <Button 
            variant={isConnected ? "outline" : "default"} 
            size="sm" 
            onClick={handleToggleConnection}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : isConnected ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Calendar className="h-4 w-4 mr-2" />
            )}
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
        </div>
      </div>
      
      {isConnected && (
        <div className="mt-4 p-3 bg-primary/10 rounded-md">
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-600 mt-0.5" />
            <p className="text-sm">
              Your appointments will automatically sync with Google Calendar
            </p>
          </div>
        </div>
      )}
      
      {!isConnected && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <p className="text-sm">
              Connect your Google Calendar to automatically sync appointments and receive reminders
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarSettings;
