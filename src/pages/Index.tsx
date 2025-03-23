
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Loader2 } from 'lucide-react';

// Loading component for index page
const IndexLoader = () => (
  <div className="flex items-center justify-center min-h-screen w-full bg-background">
    <div className="text-foreground p-6 text-center border border-gray-200 rounded-lg shadow-sm max-w-md bg-white/50 dark:bg-gray-800/50">
      <Loader2 className="w-12 h-12 mb-4 mx-auto text-primary animate-spin" />
      <h2 className="text-xl font-medium">Loading...</h2>
      <p className="mt-2 text-muted-foreground">Initializing application</p>
    </div>
  </div>
);

const IndexContent = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const [initError, setInitError] = useState<Error | null>(null);

  const handleRedirect = useCallback((path: string) => {
    try {
      console.log(`Navigating to ${path}`);
      setHasRedirected(true);
      navigate(path);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error("Navigation error:", err);
      setInitError(err);
      toast.error("Navigation failed", { 
        description: "There was a problem redirecting you. Please try refreshing the page." 
      });
    }
  }, [navigate]);

  useEffect(() => {
    console.log("Index page rendered with auth state:", { isAuthenticated, isLoading, user, hasRedirected, redirectAttempts });
    
    // Only try to redirect if we haven't already and we're not loading
    if (!isLoading && !hasRedirected) {
      if (isAuthenticated && user) {
        console.log('Index page: User authenticated, role is', user.role);
        // Handle routing based on user role
        const dashboard = 
          user.role === 'doctor' ? '/dashboard/doctor' : 
          user.role === 'receptionist' ? '/dashboard/receptionist' : 
          '/dashboard/patient';
        
        handleRedirect(dashboard);
      } else {
        console.log('Index page: User not authenticated, redirecting to login');
        handleRedirect('/login');
      }
    }
    
    // Safety timeout - if we're still loading for too long, force redirect to login
    if (isLoading && !hasRedirected && redirectAttempts === 0) {
      const timer = setTimeout(() => {
        setRedirectAttempts(prev => prev + 1);
        if (!hasRedirected) {
          console.log('Index page: Auth loading timeout, redirecting to login');
          handleRedirect('/login');
          toast.info('Taking you to login page');
        }
      }, 5000); // 5 second timeout
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, navigate, user, hasRedirected, handleRedirect, redirectAttempts]);

  if (initError) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-background">
        <div className="text-foreground p-6 text-center border border-red-200 rounded-lg shadow-sm max-w-md bg-white/50 dark:bg-gray-800/50">
          <div className="text-red-500 w-12 h-12 mb-4 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium">Application Error</h2>
          <p className="mt-2 text-muted-foreground">{initError.message || "Failed to initialize the application"}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <IndexLoader />;
  }

  // Fallback UI for any unexpected state
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background">
      <div className="text-foreground p-6 text-center border border-gray-200 rounded-lg shadow-sm max-w-md bg-white/50 dark:bg-gray-800/50">
        <h2 className="text-xl font-medium">Welcome to Medical Dashboard</h2>
        <p className="mt-2 text-muted-foreground">Initializing application...</p>
        <Button 
          onClick={() => navigate('/login')} 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Go to Login
        </Button>
      </div>
    </div>
  );
};

// Wrap the content with an error boundary to catch any rendering errors
const Index: React.FC = () => {
  const navigate = useNavigate();
  
  const handleError = (error: Error) => {
    console.error("Error in Index page:", error);
    toast.error("Something went wrong while loading the application");
    
    // If there's an error on the index page, redirect to login as a fallback
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <ErrorBoundary onError={handleError}>
      <IndexContent />
    </ErrorBoundary>
  );
};

export default Index;
