
import React from 'react';
import { Loader2 } from 'lucide-react';

interface OAuthLoadingStateProps {
  isVerifying: boolean;
  retryCount: number;
}

const OAuthLoadingState: React.FC<OAuthLoadingStateProps> = ({ isVerifying, retryCount }) => {
  return (
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
      <h2 className="text-xl font-semibold mb-2">Processing Your Login</h2>
      <p className="text-gray-500">Please wait while we authenticate your account...</p>
      {isVerifying && (
        <p className="text-gray-400 mt-2 text-sm">Verifying your credentials...</p>
      )}
      {retryCount > 0 && (
        <p className="text-amber-500 mt-2 text-sm">Retry attempt {retryCount}/2</p>
      )}
    </div>
  );
};

export default OAuthLoadingState;
