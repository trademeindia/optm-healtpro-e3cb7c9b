
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();
  
  useEffect(() => {
    // Use a single effect for navigation with proper dependencies
    if (!isLoading) {
      if (isAuthenticated && user) {
        console.log('Index page: User authenticated, role is', user.role);
        const dashboard = user.role === 'doctor' ? '/dashboard' : '/patient-dashboard';
        console.log(`Navigating to ${dashboard}`);
        navigate(dashboard, { replace: true });
      } else {
        console.log('Index page: User not authenticated, redirecting to login');
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  // Show a loading spinner while auth is being determined
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background">
      <div className={isLoading ? "animate-pulse" : "hidden"} aria-hidden={!isLoading}>
        <div className="text-foreground p-4 text-center">
          <h2 className="text-xl font-medium">Loading...</h2>
          <p className="mt-2 text-muted-foreground">Please wait while we prepare your experience</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
