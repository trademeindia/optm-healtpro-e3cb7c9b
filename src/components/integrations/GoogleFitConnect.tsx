
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

// Google Fit API scopes needed for our application
const GOOGLE_FIT_SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.body.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.location.read',
  'https://www.googleapis.com/auth/fitness.sleep.read'
].join(' ');

interface GoogleFitConnectProps {
  onConnected?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

// Google icon component
const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
  >
    <path 
      fill="currentColor" 
      d="M12.545 12.151L12.545 12.151L12.545 12.151L12.545 12.151L12.545 12.151ZM10.495 14.207C9.722 13.825 9.235 13.026 9.235 12.114C9.235 11.202 9.722 10.402 10.495 10.021C10.495 10.021 10.495 10.021 10.495 10.021V7.823C8.835 8.252 7.625 10.016 7.625 12.114C7.625 14.213 8.835 15.976 10.495 16.405V14.207C10.495 14.207 10.495 14.207 10.495 14.207ZM12.05 8.859C13.624 8.859 14.9 10.135 14.9 11.709C14.9 13.283 13.624 14.559 12.05 14.559C10.476 14.559 9.2 13.283 9.2 11.709C9.2 10.135 10.476 8.859 12.05 8.859ZM16.42 9.509L16.42 9.509V7.291C14.8 7.42 13.269 7.993 12 8.959C12.82 9.586 13.31 10.592 13.31 11.709C13.31 12.826 12.82 13.832 12 14.459C13.269 15.425 14.8 15.997 16.42 16.127V13.909C17.193 13.528 17.68 12.729 17.68 11.816C17.68 10.904 17.193 10.104 16.42 9.723L16.42 9.509ZM12.035 5.125C15.88 5.125 19 8.244 19 12.089C19 15.935 15.88 19.054 12.035 19.054C8.19 19.054 5.07 15.935 5.07 12.089C5.07 8.244 8.19 5.125 12.035 5.125Z" 
    />
  </svg>
);

export const GoogleFitConnect: React.FC<GoogleFitConnectProps> = ({
  onConnected,
  className,
  variant = 'default',
  size = 'default'
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { user } = useAuth();

  const handleConnectGoogleFit = async () => {
    if (!user) {
      toast.error("You must be logged in to connect Google Fit");
      return;
    }

    // For demo users, simulate connection
    if (user.id.startsWith('demo-')) {
      setIsConnecting(true);
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      toast.success("Demo Google Fit connected successfully", {
        description: "This is a simulated connection for the demo account."
      });
      
      if (onConnected) {
        onConnected();
      }
      
      setIsConnecting(false);
      return;
    }

    setIsConnecting(true);
    try {
      // Use the edge function directly via Supabase - this is the core fix
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL || "https://xjxxuqqyjqzgmvtgrpgv.supabase.co"}/functions/v1/connect-google-fit`;
      
      // Store current URL in localStorage to redirect back after auth
      localStorage.setItem('healthAppRedirectUrl', window.location.href);
      
      // Initiate Google OAuth flow
      window.location.href = `${functionUrl}?userId=${user.id}`;
    } catch (error) {
      console.error('Error connecting to Google Fit:', error);
      toast.error("Failed to connect to Google Fit. Please try again.");
      setIsConnecting(false);
    }
  };

  return (
    <Button
      onClick={handleConnectGoogleFit}
      disabled={isConnecting}
      className={className}
      variant={variant}
      size={size}
    >
      {isConnecting ? (
        <>Connecting...</>
      ) : (
        <>
          <GoogleIcon className="mr-2 h-4 w-4" />
          Connect Google Fit
        </>
      )}
    </Button>
  );
};

export default GoogleFitConnect;
