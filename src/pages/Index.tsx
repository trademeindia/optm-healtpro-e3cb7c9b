
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Spinner } from '@/components/ui/spinner';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Index page rendered with auth state:", { 
      isAuthenticated, 
      isLoading, 
      user,
      redirectAttempts 
    });
    
    // Avoid infinite redirects by checking if we're still loading
    if (!isLoading) {
      try {
        if (isAuthenticated && user) {
          console.log('Index page: User authenticated, role is', user.role);
          const dashboard = user.role === 'doctor' ? '/dashboard' : '/patient-dashboard';
          console.log(`Navigating to ${dashboard}`);
          navigate(dashboard);
        } else {
          console.log('Index page: User not authenticated, redirecting to login');
          navigate('/login');
        }
        
        // Increment redirect attempts to track potential issues
        setRedirectAttempts(prev => prev + 1);
        
        // If we've attempted too many redirects, something might be wrong
        if (redirectAttempts > 5) {
          setError("Too many redirect attempts. Please refresh the page.");
        }
      } catch (err) {
        console.error("Navigation error:", err);
        setError("Navigation failed. Please try refreshing the page.");
      }
    }
  }, [isAuthenticated, isLoading, navigate, user, redirectAttempts]);

  // If there's an error, show it
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-background">
        <div className="max-w-md p-6 bg-card rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-destructive mb-4">Application Error</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Show a better loading indicator while isLoading is true
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background">
      <div className="flex flex-col items-center space-y-4">
        <Spinner size="lg" />
        <div className="text-foreground p-4 text-center">
          <h2 className="text-xl font-medium">Loading Application...</h2>
          <p className="mt-2 text-muted-foreground">Please wait while we prepare your experience</p>
          
          {/* Add debug information that will be visible in development */}
          <div className="mt-4 p-2 bg-muted rounded text-xs text-muted-foreground">
            <p>Loading state: {isLoading ? 'Loading' : 'Completed'}</p>
            <p>Auth state: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
            <p>Redirect attempts: {redirectAttempts}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
