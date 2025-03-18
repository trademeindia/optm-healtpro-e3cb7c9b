
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [renderAttempts, setRenderAttempts] = useState(0);

  useEffect(() => {
    console.log("Index page rendered with auth state:", { isAuthenticated, isLoading, user, renderAttempts });
    
    // Increment render attempts to track how many times we've tried
    setRenderAttempts(prev => prev + 1);
    
    if (!isLoading) {
      if (isAuthenticated && user) {
        console.log('Index page: User authenticated, role is', user.role);
        const dashboard = user.role === 'doctor' ? '/dashboard' : '/patient-dashboard';
        console.log(`Navigating to ${dashboard}`);
        
        // Add a toast to verify the navigation is happening
        toast.info(`Welcome back, ${user.name}`, {
          description: `Redirecting to your dashboard...`,
          duration: 3000
        });
        
        navigate(dashboard);
      } else {
        console.log('Index page: User not authenticated, redirecting to login');
        toast.info('Please sign in to continue', {
          duration: 2000
        });
        navigate('/login');
      }
    }
  }, [isAuthenticated, isLoading, navigate, user, renderAttempts]);

  // Added more visible loading state with color and styling
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-background text-foreground">
        <div className="p-8 rounded-lg border border-muted shadow-md bg-background">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full border-t-4 border-primary animate-spin"></div>
            <h2 className="text-2xl font-medium text-primary">Loading...</h2>
            <p className="mt-2 text-muted-foreground text-center">
              Please wait while we prepare your experience
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
