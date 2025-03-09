
import React, { useEffect } from 'react';
import OAuthErrorDisplay from '@/components/auth/oauth/OAuthErrorDisplay';
import OAuthLoadingState from '@/components/auth/oauth/OAuthLoadingState';
import { useOAuthCallback } from '@/hooks/useOAuthCallback';
import { Card, CardContent } from '@/components/ui/card';

const OAuthCallback: React.FC = () => {
  const {
    error,
    errorDetails,
    isVerifying,
    debugInfo,
    retryCount,
    handleRetry,
    navigate
  } = useOAuthCallback();

  // Add a backup fallback redirect
  useEffect(() => {
    // If nothing happens after 15 seconds, force redirect to prevent blank screen
    const fallbackTimer = setTimeout(() => {
      console.log("OAuth callback fallback redirect triggered");
      if (document.visibilityState === 'visible' && window.location.pathname.includes('oauth-callback')) {
        console.log("User still on OAuth callback page after 15 seconds, redirecting to safety");
        navigate('/dashboard');
      }
    }, 15000);

    return () => clearTimeout(fallbackTimer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md border-primary/10 shadow-lg">
        <CardContent className="pt-6 px-6 pb-6">
          {error ? (
            <OAuthErrorDisplay 
              error={error} 
              errorDetails={errorDetails} 
              debugInfo={debugInfo} 
              onRetry={handleRetry} 
              onReturnToLogin={() => navigate('/login')} 
            />
          ) : (
            <OAuthLoadingState 
              isVerifying={isVerifying} 
              retryCount={retryCount} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;
