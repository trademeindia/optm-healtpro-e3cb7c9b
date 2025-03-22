
import React, { Suspense } from 'react';
import { useOAuthCallback } from '@/hooks/useOAuthCallback';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const OAuthCallback: React.FC = () => {
  const { isProcessing, error } = useOAuthCallback();
  const navigate = useNavigate();

  // Handle retry by redirecting back to login
  const handleRetry = () => {
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {isProcessing ? (
            <>
              <div className="relative h-16 w-16 rounded-full bg-primary/10">
                <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Processing Authentication</h2>
              <p className="text-sm text-muted-foreground">
                Please wait while we authenticate your account. You'll be redirected shortly.
              </p>
            </>
          ) : error ? (
            <>
              <div className="relative h-16 w-16 rounded-full bg-destructive/10">
                <AlertCircle className="absolute inset-0 m-auto h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold">Authentication Error</h2>
              <p className="text-sm text-destructive">{error}</p>
              <Button onClick={handleRetry} className="mt-2">
                Return to Login
              </Button>
            </>
          ) : (
            <>
              <div className="relative h-16 w-16 rounded-full bg-primary/10">
                <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Redirecting...</h2>
              <p className="text-sm text-muted-foreground">
                You should be redirected automatically. If not, please click below.
              </p>
              <Button onClick={handleRetry} variant="outline" className="mt-2">
                Return to Login
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;
