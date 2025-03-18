
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const [navigationError, setNavigationError] = useState<string | null>(null);

  useEffect(() => {
    // Debug logging
    console.log("Index page rendering, auth state:", { 
      isAuthenticated, 
      isLoading, 
      user: user ? `${user.role} (${user.id})` : 'none',
      redirectAttempts
    });
    
    let redirectTimer: number | null = null;
    
    if (!isLoading) {
      try {
        if (isAuthenticated && user) {
          console.log('User authenticated, role:', user.role);
          const dashboard = user.role === 'doctor' ? '/dashboard' : '/patient-dashboard';
          console.log(`Navigating to ${dashboard}`);
          
          // Use a small timeout to ensure state is settled before navigation
          redirectTimer = window.setTimeout(() => {
            navigate(dashboard, { replace: true });
          }, 100);
          
        } else {
          console.log('User not authenticated, redirecting to login');
          
          // Use a small timeout to ensure state is settled before navigation
          redirectTimer = window.setTimeout(() => {
            navigate('/login', { replace: true });
          }, 100);
        }
      } catch (error) {
        console.error('Navigation error:', error);
        setNavigationError(error instanceof Error ? error.message : 'Unknown navigation error');
        setRedirectAttempts(prev => prev + 1);
        
        // If multiple redirect attempts fail, force reload
        if (redirectAttempts >= 2) {
          toast.error('Navigation issue detected', {
            description: 'Reloading the application...',
            duration: 3000
          });
          
          // Give toast time to display before reload
          window.setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
        }
      }
    }
    
    // Cleanup timer
    return () => {
      if (redirectTimer) window.clearTimeout(redirectTimer);
    };
  }, [isAuthenticated, isLoading, navigate, user, redirectAttempts]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <div className="text-foreground p-4 text-center">
        <h2 className="text-xl font-medium">
          {isLoading ? 'Loading your dashboard' : 'Redirecting'}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {isLoading 
            ? 'Please wait while we prepare your experience' 
            : 'Taking you to the right place...'}
        </p>
        
        {navigationError && (
          <div className="mt-4 p-3 bg-destructive/10 rounded-md text-sm">
            <p className="text-destructive font-medium">Navigation error occurred</p>
            <p className="mt-1 text-muted-foreground">{navigationError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-primary underline text-sm"
            >
              Reload the application
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
