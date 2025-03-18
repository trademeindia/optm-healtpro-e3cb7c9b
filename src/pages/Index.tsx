
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from '@/components/error-boundary/ErrorBoundary';
import { toast } from 'sonner';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [redirectAttempts, setRedirectAttempts] = useState(0);

  useEffect(() => {
    console.log("Index page rendered with auth state:", { isAuthenticated, isLoading, user });
    
    if (!isLoading) {
      try {
        if (isAuthenticated && user) {
          console.log('Index page: User authenticated, role is', user.role);
          const dashboard = user.role === 'doctor' ? '/dashboard' : '/patient-dashboard';
          console.log(`Navigating to ${dashboard}`);
          navigate(dashboard, { replace: true });
        } else {
          console.log('Index page: User not authenticated, redirecting to login');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Error during navigation:', error);
        setRedirectAttempts(prev => prev + 1);
        
        // If multiple redirect attempts fail, force reload
        if (redirectAttempts > 2) {
          console.log('Multiple redirect attempts failed, forcing page reload');
          toast.error('Navigation issue detected', {
            description: 'Reloading the application...',
            duration: 3000
          });
          
          // Give toast time to display before reload
          setTimeout(() => {
            window.location.href = '/login';
          }, 1000);
        }
      }
    }
  }, [isAuthenticated, isLoading, navigate, user, redirectAttempts]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <div className="text-foreground p-4 text-center">
          <h2 className="text-xl font-medium">Loading your dashboard</h2>
          <p className="mt-2 text-muted-foreground">Please wait while we prepare your experience</p>
        </div>
      </div>
    );
  }

  // Render a simple loading state while redirecting
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <div className="text-foreground p-4 text-center">
        <h2 className="text-xl font-medium">Redirecting</h2>
        <p className="mt-2 text-muted-foreground">Taking you to the right place...</p>
      </div>
    </div>
  );
};

export default Index;
