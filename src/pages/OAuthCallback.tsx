
import React from 'react';
import OAuthErrorDisplay from '@/components/auth/oauth/OAuthErrorDisplay';
import OAuthLoadingState from '@/components/auth/oauth/OAuthLoadingState';
import { useOAuthCallback } from '@/hooks/useOAuthCallback';

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
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
    </div>
  );
};

export default OAuthCallback;
