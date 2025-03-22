
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/ErrorBoundary';

const IndexContent = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    console.log("Index page rendered with auth state:", { isAuthenticated, isLoading, user, hasRedirected });
    
    if (!isLoading && !hasRedirected) {
      if (isAuthenticated && user) {
        console.log('Index page: User authenticated, role is', user.role);
        // Handle routing based on user role
        const dashboard = 
          user.role === 'doctor' ? '/dashboard/doctor' : 
          user.role === 'receptionist' ? '/dashboard/receptionist' : 
          '/dashboard/patient';
        console.log(`Navigating to ${dashboard}`);
        setHasRedirected(true);
        navigate(dashboard);
      } else {
        console.log('Index page: User not authenticated, redirecting to login');
        setHasRedirected(true);
        navigate('/login');
      }
    }
  }, [isAuthenticated, isLoading, navigate, user, hasRedirected]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-background">
        <div className="text-foreground p-6 text-center border border-gray-200 rounded-lg shadow-sm max-w-md bg-white/50 dark:bg-gray-800/50">
          <div className="w-12 h-12 mb-4 mx-auto rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
          <h2 className="text-xl font-medium">Loading...</h2>
          <p className="mt-2 text-muted-foreground">Please wait while we prepare your experience</p>
        </div>
      </div>
    );
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
  const handleError = (error: Error) => {
    console.error("Error in Index page:", error);
    toast.error("Something went wrong while loading the application");
  };

  return (
    <ErrorBoundary onError={handleError}>
      <IndexContent />
    </ErrorBoundary>
  );
};

export default Index;
