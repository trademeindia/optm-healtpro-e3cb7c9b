
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { ButtonProps } from '@/components/ui/button';
// Replace FaGoogle with a simple icon until react-icons is loaded properly
import { LogIn } from 'lucide-react';

interface GoogleFitConnectProps extends Omit<ButtonProps, 'onConnected'> {
  onConnected?: () => void;
}

const GoogleFitConnect: React.FC<GoogleFitConnectProps> = ({ 
  onConnected, 
  className,
  variant,
  size,
  ...buttonProps 
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    // Check if user already has Google Fit connected
    const checkConnection = async () => {
      try {
        if (!user?.id) return;
        
        const { data, error } = await supabase
          .from('fitness_connections')
          .select('*')
          .eq('user_id', user.id)
          .eq('provider', 'google_fit')
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          console.error('Error checking Google Fit connection:', error);
          return;
        }
        
        setIsConnected(!!data);
      } catch (err) {
        console.error('Failed to check Google Fit connection status:', err);
      }
    };
    
    checkConnection();
  }, [user]);
  
  const connectGoogleFit = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (!user) {
        setError('You need to be logged in to connect Google Fit');
        setIsConnecting(false);
        return;
      }
      
      // We need to use server-side OAuth for Google Fit API access
      // Call our edge function to get the authorization URL
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        setError('No active session found. Please log in again.');
        setIsConnecting(false);
        return;
      }
      
      // Store current URL to redirect back after OAuth
      localStorage.setItem('healthAppRedirectUrl', window.location.href);
      
      // Call our edge function to get the authorization URL
      const { data, error } = await supabase.functions.invoke('get-google-fit-auth-url', {
        body: { 
          userId: user.id,
          redirectUrl: `${window.location.origin}/oauth-callback`
        },
      });
      
      if (error) {
        console.error('Error getting Google Fit auth URL:', error);
        setError('Could not initiate Google Fit connection');
        setIsConnecting(false);
        return;
      }
      
      if (data?.authUrl) {
        // Redirect to Google's OAuth consent screen
        window.location.href = data.authUrl;
      } else {
        setError('Invalid response from server');
        setIsConnecting(false);
      }
    } catch (err) {
      console.error('Error connecting to Google Fit:', err);
      setError('Could not connect to Google Fit');
      setIsConnecting(false);
    }
  };
  
  const disconnectGoogleFit = async () => {
    try {
      if (!user?.id) return;
      
      setIsConnecting(true);
      
      // Call edge function to revoke access
      await supabase.functions.invoke('disconnect-google-fit', {
        body: { userId: user.id }
      });
      
      // Delete the connection record
      await supabase
        .from('fitness_connections')
        .delete()
        .eq('user_id', user.id)
        .eq('provider', 'google_fit');
      
      setIsConnected(false);
      setError(null);
    } catch (err) {
      console.error('Error disconnecting Google Fit:', err);
      setError('Could not disconnect from Google Fit');
    } finally {
      setIsConnecting(false);
    }
  };
  
  // If used as standalone button
  if (!buttonProps.children) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Connect to Google Fit</CardTitle>
          <CardDescription>
            Sync your activity and health data from Google Fit to enhance your
            health tracking experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500">{error}</p>}
          {isConnected ? (
            <div className="text-green-500">
              <p>
                <span className="font-bold">Connected!</span> Your Google Fit
                account is linked.
              </p>
            </div>
          ) : (
            <p>
              Connect your Google Fit account to automatically track your steps,
              sleep, and other health metrics.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          {isConnected ? (
            <Button
              variant="destructive"
              onClick={disconnectGoogleFit}
              disabled={isConnecting}
            >
              {isConnecting ? "Disconnecting..." : "Disconnect Google Fit"}
            </Button>
          ) : (
            <Button
              onClick={connectGoogleFit}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  Connecting...
                </>
              ) : (
                <>
                  <LogIn className="mr-2" /> Connect Google Fit
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }
  
  // If used as a button with custom children
  return isConnected ? (
    <Button
      variant={variant || "destructive"}
      size={size}
      onClick={disconnectGoogleFit}
      disabled={isConnecting}
      className={className}
      {...buttonProps}
    >
      {isConnecting ? "Disconnecting..." : buttonProps.children || "Disconnect Google Fit"}
    </Button>
  ) : (
    <Button
      variant={variant}
      size={size}
      onClick={connectGoogleFit}
      disabled={isConnecting}
      className={className}
      {...buttonProps}
    >
      {isConnecting ? (
        <>Connecting...</>
      ) : (
        <>{buttonProps.children || <><LogIn className="mr-2" /> Connect Google Fit</>}</>
      )}
    </Button>
  );
};

export default GoogleFitConnect;
