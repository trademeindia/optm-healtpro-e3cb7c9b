
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import OAuthTroubleshooting from './OAuthTroubleshooting';
import OAuthDebugInfo from './OAuthDebugInfo';

interface OAuthErrorDisplayProps {
  error: string;
  errorDetails: string | null;
  debugInfo: Record<string, any>;
  onRetry: () => void;
  onReturnToLogin: () => void;
}

const OAuthErrorDisplay: React.FC<OAuthErrorDisplayProps> = ({
  error,
  errorDetails,
  debugInfo,
  onRetry,
  onReturnToLogin
}) => {
  return (
    <div className="text-center max-w-md">
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-red-600 mb-2">Authentication Error</h2>
      <p className="text-gray-600 mb-2">{error}</p>
      {errorDetails && (
        <p className="text-gray-500 mb-4 text-sm">{errorDetails}</p>
      )}

      <OAuthTroubleshooting />
      <OAuthDebugInfo debugInfo={debugInfo} />
      
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Button 
          variant="outline" 
          onClick={onReturnToLogin}
        >
          Return to Login
        </Button>
        <Button 
          variant="default" 
          onClick={onRetry}
          className="flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Retry Authentication
        </Button>
      </div>
    </div>
  );
};

export default OAuthErrorDisplay;
