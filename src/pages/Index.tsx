
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigationPerformedRef = useRef(false);
  
  useEffect(() => {
    // Only navigate when auth state is determined and navigation hasn't been performed yet
    if (!isLoading && !navigationPerformedRef.current) {
      if (isAuthenticated && user) {
        console.log('Index page: User authenticated, role is', user.role);
        const dashboard = user.role === 'doctor' ? '/dashboard' : '/patient-dashboard';
        console.log(`Navigating to ${dashboard}`);
        
        // Set the flag to prevent double navigation
        navigationPerformedRef.current = true;
        navigate(dashboard, { replace: true });
      } else if (!isAuthenticated) {
        console.log('Index page: User not authenticated, redirecting to login');
        
        // Set the flag to prevent double navigation
        navigationPerformedRef.current = true;
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  // Show a loading spinner while auth is being determined
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background">
      <div className={isLoading || !navigationPerformedRef.current ? "animate-pulse" : "hidden"} aria-hidden={!isLoading && navigationPerformedRef.current}>
        <div className="text-foreground p-4 text-center">
          <h2 className="text-xl font-medium">Loading...</h2>
          <p className="mt-2 text-muted-foreground">Please wait while we prepare your experience</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
